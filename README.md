# Rivong Feedback System

A web application for managing design feedback between a creative agency (Rivong) and their clients.

## Overview

Rivong Feedback System is a platform that streamlines the process of sharing designs and collecting feedback from clients. It provides a centralized space for:

- Uploading and sharing design files
- Providing contextual feedback
- Tracking implementation status
- Managing client relationships

## Features

### Client Side
- Secure login with role-based access
- Project dashboard showing all assigned projects
- File viewing interface for designs
- Feedback system for providing comments
- Real-time status updates

### Admin Side (Rivong Team)
- Complete project management
- Client management
- File uploads and organization
- Feedback tracking and implementation status
- Analytics and reporting

## Technology Stack

- **Frontend**: React, Redux Toolkit, RTK Query, TailwindCSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/feedback_pro.git
cd feedback_pro
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Projects/
│   │   │   ├── FileViewer/
│   │   │   └── Common/
│   │   ├── contexts/
│   │   ├── features/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   ├── package.json
│   └── README.md
└── server/                     # Node.js backend
    ├── controllers/
    ├── models/
    ├── routes/
    ├── config/
    ├── middleware/
    ├── uploads/
    └── package.json
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Rivong Creative Agency for the project requirements
- All contributors to the open-source libraries used in this project
