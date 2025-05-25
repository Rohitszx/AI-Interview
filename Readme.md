# NORA AI Interview System

## Overview
NORA AI Interview System is a modern web application that facilitates AI-powered interviews. The system consists of a NestJS backend and React frontend, providing a seamless experience for conducting automated interviews and processing resumes.

## Features
- AI-powered interview processing
- Resume upload and analysis (up to 10MB file size)
- Job description management
- Real-time interview feedback
- Secure file handling
- Modern, responsive UI

## Tech Stack
### Frontend
- React with TypeScript
- Modern UI components
- File upload handling with size validation
- Centralized API management

### Backend
- NestJS framework
- TypeScript
- Swagger API documentation
- Secure file processing with 10MB upload limit
- Production-ready CORS configuration

## Live Demo
Access the live application at: https://ai-interview-1-49w2.onrender.com

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- macOS (developed and tested on darwin 24.5.0)
- zsh shell

## Setup Instructions

### Backend Setup
1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory with the following variables:
```env
PORT=3002
NODE_ENV=development
# Add your GROQ API key if using AI features
GROQ_API_KEY=iiiiqwertyuiuytrewqwer
GROQ_MODEL=llama3-70b-8192
```

4. Start the backend server:
```bash
npm run start:dev
```

The backend will be available at `http://localhost:3002`

### Frontend Setup
1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Frontend directory with:
```env
REACT_APP_API_URL=http://localhost:3002/api/v1
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Environment Configuration Details

### Backend Configuration
The backend is configured with the following settings:
- Body parser limits: 10MB for JSON, urlencoded, and raw data
- CORS enabled for production domain: https://ai-interview-1-49w2.onrender.com
- Helmet security with development-friendly settings
- Swagger API documentation (available in development mode)
- Global validation pipe with whitelist enabled

### Production Settings
```javascript
// CORS Configuration
origin: "https://ai-interview-1-49w2.onrender.com"
credentials: true
methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"]
```

## File Upload Guidelines
- Maximum file size: 10MB (configured in backend)
- Supported formats for resumes: PDF, DOCX
- File size validation implemented on both frontend and backend
- Increased limits for larger resume files

## Development Guidelines
1. Follow TypeScript best practices
2. Implement proper error handling
3. Use the centralized API utility for backend communication
4. Follow the established component structure
5. Maintain type safety with interfaces

## Production Deployment
The application is configured for production deployment with:
- CORS security
- Helmet protection
- Body parser limits (10MB)
- Production environment optimizations

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Troubleshooting
Common issues and solutions:

1. "Request Entity Too Large" Error
   - Verify file size is under 10MB
   - Backend is configured to handle up to 10MB files
   - Check frontend validation settings

2. CORS Issues
   - Verify origin configuration
   - Check CORS headers
   - Ensure credentials handling

## Project Structure
```
NORA_AI/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   └── ...
└── Backend/
    ├── src/
    │   ├── main.ts
    │   ├── app.module.ts
    │   └── ...
    └── ...
```



