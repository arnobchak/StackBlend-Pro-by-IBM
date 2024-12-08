## Stackblend Pro - An HR WebApp
## Overview
Stackblend Pro is a feature-rich HR management application built with the MERN Stack (MongoDB, Express.js, React.js, and Node.js). It provides tools for shift scheduling, leave management, and report generation, streamlining HR workflows effectively.

Features
Shift Scheduling: Manage and assign employee shifts with ease.
Leave Management: Allow employees to request and track leaves seamlessly.
Report Generation: Generate print-ready reports for attendance, shifts, and leaves.
Data Visualization: Interactive charts and graphs for insights.
Email Notifications: Notify employees via email for leave approvals, shift updates, and more.
Secure User Authentication: Role-based access control using JWT and bcrypt.
Tech Stack
Frontend: React.js, Bootstrap, Axios, Recharts, Chart.js
Backend: Node.js, Express.js, MongoDB
Other Tools: Nodemailer, JWT, dotenv
Installation Guide
Prerequisites
Ensure you have the following installed:

Node.js (v16 or higher)
MongoDB
1. Clone the Repository
bash
Copy code
git clone https://github.com/your-username/stackblend-pro.git
cd stackblend-pro
2. Frontend Setup
Navigate to the frontend directory:

bash
Copy code
cd frontend
Install dependencies:

bash
Copy code
npm install
Start the frontend server:

bash
Copy code
npm start
The app will run at: http://localhost:3000.

3. Backend Setup
Navigate to the backend directory:

bash
Copy code
cd ../backend
Install dependencies:

bash
Copy code
npm install
Create a .env file in the backend folder with the following:

env
Copy code
PORT=5000
MONGO_URI=your_mongo_database_url
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
Start the backend server:

bash
Copy code
npm run server
The backend server will run at: http://localhost:5000.

Dependencies
Frontend Dependencies
json
Copy code
{
  "@emailjs/browser": "^4.3.3",
  "@testing-library/jest-dom": "^5.17.0",
  "@testing-library/react": "^13.4.0",
  "@testing-library/user-event": "^13.5.0",
  "axios": "^1.6.8",
  "bootstrap": "^5.3.3",
  "chartjs": "^0.3.24",
  "date-fns": "^3.6.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-icons": "^5.1.0",
  "react-router-dom": "^6.22.3",
  "react-scripts": "5.0.1",
  "react-to-print": "^2.15.1",
  "react-toastify": "^10.0.5",
  "recharts": "^2.12.7",
  "style-components": "^0.1.0",
  "web-vitals": "^2.1.4"
}
Backend Dependencies
json
Copy code
{
  "bcrypt": "^5.1.1",
  "body": "^5.1.0",
  "cors": "^2.8.5",
  "crypto": "^1.0.1",
  "dotenv": "^16.4.5",
  "express": "^4.19.2",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.2.3",
  "nodemailer": "^6.9.13",
  "nodemon": "^3.1.0",
  "parser": "^0.1.4"
}
Project Structure
Frontend (/frontend)
src/: Contains React components, routes, and services.
public/: Static files like index.html.
Backend (/backend)
models/: Mongoose models for database schemas.
routes/: Express routes for API endpoints.
controllers/: Business logic for routes.
Contributing
Fork the repository.
Create a new branch:
bash
Copy code
git checkout -b feature/your-feature-name
Commit your changes:
bash
Copy code
git commit -m "Add your message here"
Push to the branch:
bash
Copy code
git push origin feature/your-feature-name
Open a Pull Request.
License
This project is licensed under the MIT License.
