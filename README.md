# DevPulse — API Monitoring Platform
DevPulse is a real-time API and website monitoring platform that helps developers track uptime, response time, failures, and performance of their APIs and services.
It continuously monitors user-provided URLs, records status and response time, and displays analytics through a modern dashboard.


## 🚀 Features

* 🔐 JWT Authentication (Email & Password)
* 🔑 OAuth Login (Google & GitHub)
* 🌐 API & Website Monitoring
* ⏱ Response Time Tracking
* 📉 Status Monitoring (UP / DOWN)
* 📊 Dashboard with Monitoring Cards
* 📈 Live Graph Visualization
* 👤 User Profile with Image Upload
* 🗑 Delete Monitor
* 🧭 Modern Landing Page UI
* ⚡ Background Monitoring Worker


## 🛠 Tech Stack

### Frontend
* React
* Tailwind CSS
* GSAP (Animations)
* Recharts (Graphs)
* Axios
* React Router

### Backend
* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* OAuth (Google & GitHub)
* Axios (Monitoring Requests)

---

## ⚙️ How Monitoring Works

1. User signs up / logs in.
2. User adds a URL to monitor.
3. The backend saves the monitor in MongoDB.
4. A background worker runs every 60 seconds.
5. The server sends a GET request to the URL.
6. The system records:

   * Status (UP / DOWN)
   * Response Time
   * Last Checked Time
7. Dashboard displays monitoring data and graphs.

---

## 🔑 Environment Variables

Create a `.env` file in server folder:

```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GITHUB_CLIENT_ID=your_github_client_id

UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

---

## ▶️ Run Project Locally

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


## 📊 Future Improvements

* Email Notifications when API goes down
* Webhook Alerts
* Public Status Pages
* Team Workspaces
* Monitor Logs History
* Response Time Analytics Graph
* Global Monitoring Nodes
* Docker Deployment


Full Stack Developer
MERN Stack | Next.js | TypeScript | Backend Systems

## ⭐ Project Goal

The goal of DevPulse is to build a production-level SaaS monitoring platform where developers can monitor their APIs and websites in real-time and receive insights about uptime and performance.
