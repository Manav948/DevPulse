# DevPulse — Real-Time API Monitoring Platform

DevPulse is a modern real-time API and website monitoring platform that helps developers track uptime, response time, failures, and performance of their services.
It continuously monitors user-provided URLs, stores monitoring logs, analyzes uptime data, and provides live analytics through a modern SaaS-style dashboard.

## Features

### Authentication
- JWT Authentication
- Google OAuth Login
- GitHub OAuth Login

### Monitoring System
- API & Website Monitoring
- Background Monitoring Worker
- Status Detection (UP / DOWN)
- Response Time Tracking
- Real-time Status Updates
- Monitor Management (Create / Update / Delete)

### Dashboard & Analytics
- Monitoring Dashboard
- Live Response Graphs
- Uptime Statistics
- Analytics Overview
- Real-time UI Updates
- Monitor Details Page

###  User Features
- Profile Management
- Profile Image Upload
- Settings Page


# Tech Stack
## Frontend
- React.js
- Tailwind CSS
- GSAP
- Recharts
- Axios
- React Router DOM
- Socket.io Client

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- OAuth (Google & GitHub)
- Socket.io
- Axios

# How Monitoring Works

1. User signs up or logs in.
2. User creates a monitor by submitting a URL.
3. The monitor is stored in MongoDB.
4. A background worker continuously checks active monitors.
5. The server sends HTTP requests to monitored URLs.
6. The system records:
   - Monitor Status
   - Response Time
   - Last Checked Time
7. Monitoring logs are stored for analytics and history.
8. WebSocket events push real-time updates to the dashboard.
9. Users can view uptime analytics and monitor performance.

    
## Run Project Locally 

### Backend
```
cd Backend

npm install

npm run dev
```
### Frontend
```
cd Frontend

npm install

npm run dev
```
# Real-Time Architecture

DevPulse uses WebSockets to provide real-time monitor updates.
Flow:

User Dashboard
⬆
WebSocket Events
⬆
Monitoring Worker
⬆
MongoDB + HTTP Checks
This allows monitor status changes to instantly appear on the frontend without requiring a page refresh.


# Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GITHUB_CLIENT_ID=your_github_client_id

UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
