# Smart Task Manager - Project Summary

This document serves as an overview of the architecture, components, integrations, and user interface improvements made while building the Smart Task Manager application using React and Django REST Framework.

## 1. Segregated Component Architecture
The application was built from scratch and segregated into clean, modular React components focused on solitary responsibilities, ensuring high maintainability:

* **`App.js`**: The root entry point of the frontend. It manages global state (like tasks payload, Theme switching, and View routing) and establishes the primary auto-refresh interval loops polling the Django backend.
* **`Navbar.js`**: The global application header handling quick layout traversal between "Home" and "History" views alongside a centralized dark/light theme toggle.
* **`TaskInput.js`**: A specialized sidebar view acting as the data-entry hub. It encapsulates complex form interactions, handles dual date/time pickers, monitors live-typing (Debouncing), and orchestrates directly with the AI and Microphone capabilities seamlessly.
* **`TaskList.js`**: The central content panel sorting and formatting the active state array into individual cards, implementing pure local JS array filtering (`All`, `Pending`, `Completed`).
* **`TaskCard.js`**: Handles the micro-interactions for a single Task. Controls individual `PUT` / `DELETE` API commands to toggle status conditions natively and controls local state inline-editing modes dynamically.
* **`HistoryView.js`**: A dedicated analytics dashboard dissecting task structures into macro statistics (Total, Completed, Overdue) and rendering a read-only graphical dataset layout for historical reference.

## 2. API Integrations

### AI & Native Integrations
We dynamically woven modern AI capabilities straight into the `api.js` request pipelines interacting cleanly with the `TaskInput` component:

* **Google Gemini AI API Integration**: The backend seamlessly authenticates against Google's secure `google-generativeai` SDK. Through proxy view endpoints, we utilized `gemini-2.5-flash` to offer two discrete intelligent processes:
  * **Real-time Suggestion API** (`/api/suggest/`): Captures partial typing strings every 400ms and rapidly returns three separate contextual completions bridging arrays to React hooks.
  * **Description Enhancer API** (`/api/enhance/`): Upgrades draft notes iteratively via the "✨ Enhance with AI" button into cleaner, optimized, professional descriptions.
* **Native Web Speech API**: Leverages the browser's built-in `window.SpeechRecognition` spec via the 🎙️ widget to dynamically transcribe audio logic directly inside the main description text area natively, avoiding expensive external translation services.

### Django REST Backend
Connected heavily via HTTP methods resolving local schemas into SQLite endpoints:
* **Models**: Single strict `Task` relational schema factoring dynamic python properties such as `@property def is_overdue(self)` utilizing contextual timezone comparisons.
* **Core Endpoints**: 
  * `GET/POST /api/tasks/` - Standard fetching and generation structures globally.
  * `PUT/DELETE /api/tasks/{id}/` - Granular specific modifications.
* **Middleware Integrity**: CORS (`django-cors-headers`) pipelines properly authorized mapping strict origin pipelines for the local React App instance safely.

## 3. UI Improvements & Aesthetics

* **Dynamic Inline System**: Implemented entirely raw React inline `style={...}` attributes tied cleanly to top-level color definition JSON tokens mapped mathematically against the current boolean theme properties. No heavy external CSS libraries (Bootstrap/Tailwind) were used.
* **Refined Aesthetics**: 
  * **Variables & Accents**: Implemented deep Indigo (`#4f46e5`) application-action identifiers against neutral Slate backgrounds creating vibrant call-to-actions.
  * **State Based Degradation**: Tasks automatically dim into slightly translucent (`opacity: 0.7`) boxes and apply line-through definitions when marked as completed. Overdue flags tint backgrounds with a subtle red alpha-layer to signify urgency.
  * **Micro-interactions**: Filter capsules transition with `0.2s` interpolators, popover action dropdowns overlay safely locking clicks locally, and task-deletion toggles cleanly fade out states reacting strictly to the continuous 30-second live background synchronizer. 
