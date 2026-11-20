# Smart Complaint Management System

A full-stack web application designed to simplify public complaint registration, tracking, and management through a centralized digital platform.

## About the Project

Managing public complaints manually can be time-consuming and inefficient. Citizens may face difficulties reporting problems, tracking complaint status, and receiving updates.

The **Smart Complaint Management System** provides a centralized platform where citizens can submit complaints online, while administrators can manage complaints and coordinate their resolution.

The application also integrates AI-powered functionality to assist with complaint-related operations.

## Key Features

### Citizen Module
- User registration and login.
- Submit complaints through an online interface.
- Upload supporting images or files.
- View submitted complaints.
- Track complaint status.

### Admin Module
- Admin dashboard for complaint management.
- View and manage registered complaints.
- Monitor complaint progress.
- Manage complaint assignments and related operations.

### Additional Features
- Secure authentication using JWT.
- Password hashing using bcrypt.
- REST API-based backend.
- MySQL database integration.
- AI-powered functionality using Google Gemini API.
- Responsive frontend interface.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, Vite, HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Authentication | JWT, bcryptjs |
| AI Integration | Google Gemini API |
| API Communication | Axios |
| File Uploads | Multer |
| Version Control | Git, GitHub |

## Project Structure

```text
smart-complaints/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── package.json
│   └── .gitignore
│
└── .gitignore
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/NavyaDevraj/smart-complaints.git
cd smart-complaints
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure your environment variables:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Configure your MySQL database and import the project's database schema.

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Environment Variables

Sensitive credentials are stored in environment variables and are not included in the GitHub repository.

Create your own `.env` file using the configuration above before running the application.

**Never upload API keys, database passwords, or JWT secrets to GitHub.**

## Future Enhancements

- Email and notification integration.
- Advanced complaint analytics and reporting.
- Complaint location mapping.
- Improved complaint tracking and status notifications.
- Enhanced AI-assisted complaint classification.

## Learning Outcomes

Through this project, we explored:
- Full-stack web application development.
- REST API development and integration.
- Database connectivity and management.
- User authentication and authorization.
- Frontend and backend integration.
- Third-party AI API integration.
- Git and GitHub version control.

## Author

Developed as an academic project to explore full-stack development and technology-driven public complaint management.

