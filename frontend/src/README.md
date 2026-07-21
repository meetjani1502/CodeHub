# CodeHub Frontend

This is the frontend application for CodeHub, a GitHub-inspired version control system built with React, Vite, Tailwind CSS, and Axios.

## What this app does

- Displays repositories, branches, commits, pull requests, and issue tracking.
- Supports user authentication via login and registration.
- Allows creating repositories, branches, files, commits, pull requests, and branch switching.
- Uses `http://localhost:5000/api` as the backend API base URL.

## Key pages

- `/` - Landing page with feature overview
- `/login` - User login page
- `/register` - User registration page
- `/repositories` - Repository listing page
- `/create-repository` - Create a new repository
- `/repository/:id` - Repository detail and branch management
- `/branches` - Branch list page
- `/pullrequests` - Pull request listing page
- `/commits` - Commit history page
- `/profile` - User profile page
- `/issues` - Issue tracker page

## Run locally

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the dev server

   ```bash
   npm run dev
   ```

3. Open the app in your browser at the address shown by Vite.

## Build for production

```bash
npm run build
```

## Notes

- The frontend expects the backend to be available at `http://localhost:5000/api`.
- JWT tokens are stored in `localStorage` and attached to requests automatically by the Axios interceptor in `src/api/axios.js`.
- The current frontend structure uses React Router v7 and Tailwind CSS for styling.
