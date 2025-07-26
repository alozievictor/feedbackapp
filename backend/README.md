# Rivong Feedback System - Backend API

This is the backend API for the Rivong Feedback System, a platform for creative agencies and clients to exchange design feedback.

## Features

- User authentication and authorization (JWT)
- Project management
- File uploads and management (with Cloudinary)
- Feedback system with coordinated annotations
- Activity tracking

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for file storage

## Project Structure

```
backend/
  ├── src/
  │   ├── config/
  │   │   └── cloudinary.js      # Cloudinary configuration
  │   ├── controllers/
  │   │   ├── auth.controller.js # Authentication controller
  │   │   ├── user.controller.js # User management controller
  │   │   ├── project.controller.js # Project management controller
  │   │   ├── file.controller.js # File management controller
  │   │   └── feedback.controller.js # Feedback controller
  │   ├── middleware/
  │   │   ├── auth.middleware.js # Authentication middleware
  │   │   └── error.middleware.js # Error handling middleware
  │   ├── models/
  │   │   ├── user.model.js      # User model
  │   │   ├── project.model.js   # Project model
  │   │   ├── file.model.js      # File model
  │   │   └── feedback.model.js  # Feedback model
  │   ├── routes/
  │   │   ├── auth.routes.js     # Authentication routes
  │   │   ├── user.routes.js     # User routes
  │   │   ├── project.routes.js  # Project routes
  │   │   ├── file.routes.js     # File routes
  │   │   └── feedback.routes.js # Feedback routes
  │   └── index.js               # Main server file
  ├── .env                       # Environment variables (not in repo)
  ├── .env.example               # Example environment variables
  ├── package.json               # Dependencies and scripts
  └── README.md                  # This file
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` with your own configuration values
4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/profile` - Get own user profile
- `GET /api/users/:id` - Get a user by ID (admin only)
- `PUT /api/users/profile` - Update own profile
- `PUT /api/users/:id` - Update a user (admin only)
- `DELETE /api/users/:id` - Delete a user (admin only)

### Projects
- `GET /api/projects` - Get all accessible projects
- `GET /api/projects/:id` - Get a project by ID
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Files
- `GET /api/files/project/:projectId` - Get all files for a project
- `POST /api/files/project/:projectId` - Upload a file to a project
- `GET /api/files/:fileId` - Get a file by ID
- `DELETE /api/files/:fileId` - Delete a file

### Feedback
- `GET /api/feedback/file/:fileId` - Get all feedback for a file
- `POST /api/feedback/file/:fileId` - Add feedback to a file
- `PUT /api/feedback/:feedbackId` - Update feedback
- `DELETE /api/feedback/:feedbackId` - Delete feedback
- `PATCH /api/feedback/:feedbackId/resolve` - Toggle feedback resolve status

## License

MIT
