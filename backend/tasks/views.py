import os
import json
import re
import requests
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from .models import Task
from .serializers import TaskSerializer
import google.generativeai as genai

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer

class SuggestDescriptionView(APIView):
    def post(self, request, *args, **kwargs):
        partial = request.data.get('partial', '')
        if not partial:
            return Response({"suggestions": []})

        api_key = getattr(settings, 'GEMINI_API_KEY', '')
        if not api_key or api_key == 'your_gemini_api_key_here':
            # Fallback mock suggestions for testing if API key is absent
            suggestions = [
                f"{partial} by tomorrow",
                f"{partial} - urgent",
                f"Review: {partial}"
            ]
            return Response({"suggestions": suggestions})

        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-2.5-flash')
            prompt = f"You are a task assistant. Given a partial task description: '{partial}', return 3 short one-line suggestions to complete it. Return ONLY a JSON array of strings, nothing else."
            response = model.generate_content(prompt)
            
            text = response.text
            text = re.sub(r'^```json', '', text, flags=re.IGNORECASE)
            text = re.sub(r'```$', '', text)
            text = text.strip()
            suggestions = json.loads(text)
            return Response({"suggestions": suggestions})
        except Exception as e:
            print(f"SUGGEST AI ERROR: {str(e)}")
            print(f"USING API KEY: {api_key}")
            # Let's return the error message for debugging purposes
            return Response({"suggestions": [f"Error: {str(e)}"]}, status=status.HTTP_400_BAD_REQUEST)

class EnhanceDescriptionView(APIView):
    def post(self, request, *args, **kwargs):
        description = request.data.get('description', '')
        if not description:
            return Response({"enhanced": description})

        api_key = getattr(settings, 'GEMINI_API_KEY', '')
        if not api_key or api_key == 'your_gemini_api_key_here':
            # Fallback mock enhancement for testing if API key is absent
            return Response({"enhanced": f"✨ [Enhanced] {description}. Make sure to double check all constraints before marking as done."})

        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-2.5-flash')
            prompt = f"You are a professional task manager. Rewrite the following task description to be clearer, more actionable, and concise. Return only the improved description text, no preamble.\n\nDescription: {description}"
            response = model.generate_content(prompt)
            
            enhanced_text = response.text.replace('```', '').strip()
            return Response({"enhanced": enhanced_text})
        except Exception as e:
            print(f"ENHANCE AI ERROR: {str(e)}")
            print(f"USING API KEY: {api_key}")
            # Return error for debugging
            return Response({"enhanced": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)