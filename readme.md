# 🎥 Core Backend Project (YouTube Backend Clone)

A production-grade full-stack video sharing platform inspired by YouTube, built while completing the **Chai aur Backend** series by Hitesh Choudhary.

The project focuses on writing scalable, modular, and production-ready backend architecture instead of only implementing CRUD operations. Every API has been designed with proper validation, authentication, authorization, optimized database queries, and clean code practices.

---

# 🚀 Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Access Token + Refresh Token
- Multer
- Cloudinary
- Cookie Parser
- CORS
- Bcrypt
- MongoDB Aggregation Pipeline

## Frontend

- React
- TypeScript
- Tailwind CSS
- Axios
- React Router DOM
- Vite

---

# 📁 Project Structure

```
core-backend-project
│
├── backend
│   ├── public
│   ├── src
│   │   ├── controllers
│   │   ├── db
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   ├── utils
│   │   ├── app.js
│   │   ├── constants.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   ├── features
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── lib
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   ├── store
│   │   ├── types
│   │   └── utils
│   └── package.json
│
└── README.md
```

---

# ✨ Features

## Authentication

- User Registration
- User Login
- Logout
- Refresh Access Token
- Change Password
- Update Account
- Update Avatar
- Update Cover Image
- JWT Authentication
- Refresh Token Rotation
- HTTP Only Cookies

---

## Videos

- Upload Video
- Update Video
- Delete Video
- Publish / Unpublish Video
- Get Video By ID
- Get All Videos
- Pagination
- Search
- Sorting
- Filtering
- Owner Validation

---

## Playlists

- Create Playlist
- Update Playlist
- Delete Playlist
- Get Playlist
- Add Video to Playlist
- Remove Video from Playlist
- Duplicate Prevention using `$addToSet`

---

## Comments

- Add Comment
- Edit Comment
- Delete Comment
- Get Video Comments
- Pagination

---

## Likes

- Like Video
- Unlike Video
- Like Comment
- Like Tweet
- Toggle Like APIs

---

## Tweets

- Create Tweet
- Update Tweet
- Delete Tweet
- Get User Tweets

---

## Subscriptions

- Subscribe Channel
- Unsubscribe Channel
- Get Subscribers
- Get Subscribed Channels

---

## Dashboard

- Channel Statistics

  - Total Videos
  - Total Views
  - Total Subscribers
  - Total Likes

- Get All Uploaded Videos

---

## Health Check API

Simple production health endpoint for monitoring.

```
GET /api/v1/healthcheck
```

---

# 🔐 Authentication Flow

```
Register

        ↓

Login

        ↓

Generate Access Token

        ↓

Generate Refresh Token

        ↓

Store Refresh Token

        ↓

HTTP Only Cookies

        ↓

Protected Routes
```

---

# 📊 Database Models

- User
- Video
- Playlist
- Comment
- Like
- Subscription
- Tweet

---

# ⚡ Production Optimizations Implemented

## Promise.all()

Independent database queries execute in parallel to reduce API response time.

---

## Aggregation Pipelines

Implemented advanced MongoDB aggregation including

- $lookup
- $facet
- $match
- $project
- $group
- $sort
- $unwind
- $count

---

## Single Query Optimizations

Replaced multiple database queries with atomic operations like

- findOneAndDelete()
- findByIdAndUpdate()

to reduce network round trips.

---

## Pagination

Efficient pagination using

- $skip
- $limit

---

## Dynamic Sorting

Whitelisted sorting fields to prevent malicious queries.

---

## Search

Case-insensitive search using MongoDB Regular Expressions.

---

## Asset Management

Integrated Cloudinary for

- Video Uploads
- Thumbnail Uploads
- Avatar Uploads
- Cover Images

Automatic cleanup implemented for deleted assets.

---

## Security

- JWT Authentication
- Password Hashing using bcrypt
- HTTP Only Cookies
- Input Validation
- ObjectId Validation
- Protected Routes
- Authorization Checks

---

# 🧹 Clean Code Practices

- MVC Architecture
- Async Handler
- Custom ApiResponse
- Custom ApiError
- Centralized Error Handling
- Modular Folder Structure
- Reusable Utility Functions
- Environment Variables
- RESTful APIs

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/PiyushShukla9140/core-backend-project.git
```

---

## Backend

```bash
cd backend

npm install
```

Create

```
.env
```

Example

```env
PORT=8000

MONGODB_URI=your_mongodb_uri

ACCESS_TOKEN_SECRET=

ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=

REFRESH_TOKEN_EXPIRY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

CORS_ORIGIN=http://localhost:5173
```

Run

```bash
npm run dev
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 📌 API Base URL

```
http://localhost:8000/api/v1
```

---

# 📈 Future Improvements

- Responsive UI
- Infinite Scrolling
- Video Streaming
- Notifications
- Watch History
- User Dashboard
- Analytics
- Dark Mode
- Live Search
- Video Recommendations
- Redux Toolkit
- React Query
- Unit Testing
- Docker
- CI/CD Pipeline
- Deployment

---

# 🙏 Acknowledgements

Special thanks to **Hitesh Choudhary** and the **Chai aur Code** community for creating an excellent backend roadmap that emphasizes production-grade engineering practices beyond basic CRUD operations.

---

# 👨‍💻 Author

**Piyush Shukla**

GitHub

https://github.com/PiyushShukla9140

LinkedIn

https://linkedin.com/in/piyush-shukla

---

## ⭐ If you like this project, don't forget to star the repository!