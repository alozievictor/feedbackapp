# Deployment Guide for Feedback Pro

This guide will help team members set up the Feedback Pro application correctly.

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Modify the `.env` file with your MongoDB connection string.

5. Start the backend server:
   ```
   npm run dev
   ```

6. The server should be running on port 5000.

## Frontend Setup

1. Navigate to the project root directory.

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

   **Important:** If you're connecting to a shared backend server, change the URL to point to that server instead of localhost, e.g.:
   ```
   VITE_API_URL=http://[BACKEND_IP_OR_DOMAIN]:5000/api
   ```

4. Start the frontend development server:
   ```
   npm run dev
   ```

5. The frontend should be running on port 5173 or 5174.

## Common Issues and Solutions

### "Something went wrong" error when logging in:

1. Make sure the backend server is running.
2. Check that your `.env` file has the correct API URL.
3. Ensure your MongoDB database is accessible.
4. Check browser console for detailed error messages.

### CORS errors:

If you see CORS errors in the browser console, ensure the backend CORS settings are correctly configured in `backend/src/server.js`.

### Network errors:

If using a shared backend, make sure firewalls allow connections to port 5000.

## Testing the Connection

You can test if your frontend can reach the backend by opening your browser's developer tools (F12), going to the Network tab, and checking for requests to the API endpoints when you try to log in.

## Troubleshooting

If issues persist, please check:

1. Node.js version (we recommend v16.x or v18.x)
2. npm version 
3. That all dependencies are installed correctly
4. That MongoDB is running and accessible
5. Network connectivity between your machine and the backend server
