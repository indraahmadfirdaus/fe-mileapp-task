# Task Management Application

A modern task management web application built with Vue.js that helps users organize and track their tasks efficiently.

## Overview

This application provides a clean and intuitive interface for managing tasks with features like task creation, filtering, sorting, and due date tracking. The application highlights overdue tasks with distinct styling to help users prioritize their work.

## Features

- **User Authentication**: Secure login and registration system
- **Task Dashboard**: Centralized view of all tasks with filtering and sorting options
- **Task Management**: Create, update, and delete tasks
- **Due Date Tracking**: Visual indicators for overdue tasks
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend Framework**: Vue.js 3 with Composition API
- **State Management**: Pinia
- **Routing**: Vue Router
- **UI Components**: Headless UI
- **Styling**: Tailwind CSS
- **Icons**: Iconify
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Installation

1. Clone the repository
```
git clone <repository-url>
cd fe-mileapp-task
```

2. Install dependencies
```
npm install
```

3. Set up environment variables
```
cp .env.example .env
```
Edit the `.env` file to configure your backend API URL if needed.

4. Start the development server
```
npm run dev
```

5. Build for production
```
npm run build
```

## Usage

1. Register a new account or login with existing credentials
2. View your tasks on the dashboard
3. Create new tasks with title, description, and due date
4. Filter and sort tasks based on different criteria
5. Mark tasks as complete when finished
6. Easily identify overdue tasks with red highlighting

## API Integration

The application connects to a backend API running on port 5000. API requests are configured in the `src/services/api.js` file.

## Project Structure

```
fe-mileapp-task/
├── src/
│   ├── assets/       # Static assets and global styles
│   ├── components/   # Reusable Vue components
│   ├── router/       # Vue Router configuration
│   ├── services/     # API and authentication services
│   ├── stores/       # Pinia state management
│   ├── views/        # Page components
│   ├── App.vue       # Root component
│   └── main.js       # Application entry point
├── public/           # Public static assets
└── index.html        # HTML entry point
```

## License

[MIT License](LICENSE)