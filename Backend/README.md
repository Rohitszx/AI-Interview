# NORA AI Interview System

## Description

NORA AI is a scalable interview system built with NestJS. It provides a robust backend for managing job descriptions, resumes, and interviews with AI-powered assistance. The system leverages Groq's advanced LLM capabilities to generate relevant technical interview questions, analyze interview transcripts, and provide detailed feedback to candidates.

## Project setup

```bash
$ npm install
```

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_DATABASE=nora_interview

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1d

# AI Configuration (Groq API)
GROQ_API_KEY=your-groq-api-key

# Storage Configuration
USE_S3=false # Set to true to use S3 instead of local storage
UPLOAD_DIR=./uploads # Local storage directory

# AWS S3 Configuration (only needed if USE_S3=true)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-nora-ai-bucket

# App Configuration
PORT=3000
NODE_ENV=development
```

### Database Migrations

The application uses TypeORM migrations for database schema management. Run the following commands to manage migrations:

```bash
# Generate a new migration
$ npm run migration:generate --name=InitialSchema

# Run migrations
$ npm run migration:run

# Revert the last migration
$ npm run migration:revert
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Architecture

NORA AI follows a clean, modular architecture based on SOLID principles and best practices:

### Core Principles

- **SOLID**: Each component adheres to Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles.
- **Clean Architecture**: The application is organized in layers with clear separation of concerns.
- **DRY (Don't Repeat Yourself)**: Common functionality is abstracted into reusable services and utilities.
- **KISS (Keep It Simple, Stupid)**: Solutions prioritize simplicity and maintainability over complexity.
- **Testability**: Code is designed to be easily testable with comprehensive unit and integration tests.

### Module Structure

- **Feature Modules**: User, Resume, JD (Job Description), Interview, Feedback, Transcript
- **Infrastructure Modules**: Storage, AI
- **Common Module**: Shared services, filters, guards, and utilities

### Key Components

- **Repository Pattern**: Data access is abstracted through repository interfaces
- **DTO Pattern**: Data Transfer Objects for request/response serialization
- **Global Exception Filter**: Consistent error handling across the application
- **Middleware**: Security, logging, and performance enhancements
- **AI Integration**: Seamless integration with Groq's LLM API
- **Storage Abstraction**: Flexible storage system supporting both local filesystem and AWS S3
- **Role-Based Authorization**: Granular access control based on user roles
- **File Upload Service**: Dedicated service for handling file uploads with validation

## Features

### Core Features
- **User Management**: 
  - Email/password authentication
  - Google OAuth integration
  - JWT with refresh token mechanism
  - Secure logout functionality

- **Resume Management**: 
  - Upload, storage, and text extraction from resumes
  - Support for PDF, DOCX, and TXT formats
  - Automatic text extraction for AI processing

- **Job Description Management**: 
  - Upload or paste job descriptions with text extraction
  - Automatic parsing of job requirements and skills

### AI-Powered Features
- **Interview Question Generation**: 
  - AI-generated technical interview questions based on job description and resume
  - Customizable difficulty levels and focus areas
  - Questions tailored to candidate's experience and job requirements

- **Interview Analysis**: 
  - Real-time analysis of interview responses
  - Technical accuracy assessment
  - Communication skills evaluation

- **Feedback Generation**: 
  - Comprehensive feedback on interview performance
  - Actionable improvement suggestions
  - Scoring across multiple dimensions (technical, communication, overall)

- **Transcript Processing**: 
  - Full interview transcript storage and analysis
  - Key insights extraction from conversations

### Infrastructure Features
- **Flexible Storage**: 
  - Local file system storage for development
  - AWS S3 integration for production deployments
  - Automatic file management and cleanup

- **Security**: 
  - Role-based access control (RBAC)
  - Rate limiting to prevent abuse
  - Input validation and sanitization
  - Secure token management
  - Permission-based endpoint protection

## API Documentation

The API is documented using Swagger. Once the application is running, visit `/api/docs` to explore the available endpoints.

## Role-Based Authorization

NORA AI implements a comprehensive role-based authorization system:

### User Roles

- **USER**: Standard user with basic access to the system
- **ADMIN**: Administrative user with full access to all features
- **INTERVIEWER**: User who can conduct interviews and review results
- **CANDIDATE**: User who participates in interviews

### Implementation

- **@Roles() Decorator**: Applied to controllers or individual endpoints to specify required roles
- **RolesGuard**: Global guard that enforces role-based access control
- **User Entity**: Includes role field with appropriate default value

```typescript
// Example of role-based endpoint protection
@Post('delete-interview')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.ADMIN, UserRole.INTERVIEWER)
deleteInterview(@Param('id') id: string) {
  // Only admins and interviewers can access this endpoint
}
```

## File Upload Handling

The system includes a dedicated `FileUploadService` for handling file uploads:

### Features

- **File Validation**: Validates file size, type, and content
- **Type-Specific Handling**: Different validation rules for resumes, job descriptions, and transcripts
- **Storage Abstraction**: Works with both local storage and S3
- **Security**: Prevents malicious file uploads

```typescript
// Example of file upload with validation
const fileInfo = await fileUploadService.uploadFile(file, 'resume', userId);
```

## AI Integration

NORA AI leverages Groq's powerful language models for several key features:

### Interview Question Generation

The system analyzes both the job description and candidate's resume to generate relevant, challenging technical questions. This ensures that:

- Questions are tailored to the specific job requirements
- The candidate's experience and skills are taken into account
- Questions are at an appropriate difficulty level

```typescript
// Example of question generation
const questions = await groqService.generateInterviewQuestions(
  jobDescriptionText,
  resumeText,
  5 // Number of questions
);
```

### Interview Transcript Analysis

After an interview, the system can analyze the full transcript to provide insights on:

- Technical accuracy of answers
- Communication effectiveness
- Overall performance
- Areas for improvement

```typescript
// Example of transcript analysis
const analysis = await groqService.analyzeTranscript(transcriptText);
```

### Feedback Generation

The system generates comprehensive feedback for candidates, including:

- Overall assessment
- Technical strengths demonstrated
- Areas for improvement
- Communication skills assessment
- Specific advice for future interviews

## Storage Integration

NORA AI supports both local file storage and AWS S3 integration:

### Local Storage

For development and testing, files are stored in the local filesystem:

- Default upload directory: `./uploads`
- Subdirectories for different file types (resumes, job descriptions)
- Automatic directory creation and management

### AWS S3 Integration

For production deployments, files can be stored in Amazon S3:

- Configurable bucket and region
- Secure pre-signed URLs for file access
- Automatic cleanup of temporary files
- Configurable file expiration policies

To switch between storage options, simply update the `USE_S3` environment variable:

```
# Use local storage
USE_S3=false

# Use AWS S3
USE_S3=true
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

## Testing

NORA AI includes comprehensive testing:

### Unit Tests

- Tests for individual services and components
- Mocked dependencies for isolation
- Coverage for critical business logic

### Integration Tests

- Tests for service interactions
- File upload and storage integration
- Database operations

### API Tests

- Endpoint testing with supertest
- Authentication and authorization testing
- Error handling verification

```bash
# Run all tests
$ npm run test

# Run tests with coverage report
$ npm run test:cov
```

## API Documentation

The system includes a comprehensive Postman collection for testing and exploring the API:

- Located in `/postman/NORA_AI_API_Collection.json`
- Includes environment configuration in `/postman/NORA_AI_Environment.json`
- Covers all endpoints with example requests and responses
- Automatically handles authentication token management

## Deployment

When deploying to production, ensure the following:

1. Set `NODE_ENV=production` in your environment
2. Run the database migrations using `npm run migration:run`
3. Configure proper security headers and CORS settings
4. Set up proper logging and monitoring
5. Configure AWS S3 for file storage
6. Set up a valid Groq API key for AI features
7. Configure appropriate user roles for administrative access

Check out the [NestJS deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.


