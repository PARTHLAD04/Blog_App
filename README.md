# Blog Application

A modern full-stack blog application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring AI-powered content generation and a clean, responsive interface.

## ✨ Features

- 🔐 User authentication (Register/Login)
- 📝 Create, read, update, and delete blog posts
- 🎨 Clean, responsive design with Tailwind CSS
- 🤖 AI-powered blog post generation
- ❤️ Like and interact with posts
- 🔒 Secure authentication using JWT
- ⚡ Fast and efficient API with Express.js
- 🚀 Vite for optimized frontend builds

## 🛠️ Tech Stack

### Frontend
- ⚛️ React 19
- 🛣️ React Router v6
- 🎨 Tailwind CSS for styling
- 🔄 React Icons
- 📊 React Toastify for notifications
- ⚡ Vite for development and building

### Backend
- 🚀 Node.js with Express.js
- 🍃 MongoDB with Mongoose
- 🔑 JWT for authentication
- 🔒 Bcrypt for password hashing
- 🌐 CORS enabled
- 📦 Body parser for request handling

## 🚀 Prerequisites

- Node.js (v18 or later)
- npm (v9 or later) or yarn
- MongoDB Atlas account or local MongoDB installation (v6.0 or later)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variable:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## 📁 Project Structure

```
Blog app/
├── backend/               # Backend server
│   ├── middleware/       # Authentication middleware
│   ├── models/           # MongoDB models (User, Blog)
│   ├── routes/           # API routes (auth, blogs, likes, ai)
│   ├── utils/            # Utility functions
│   ├── .env              # Environment variables
│   ├── package.json      # Backend dependencies
│   └── server.js         # Entry point
│
└── frontend/             # Frontend React application
    ├── public/           # Static files
    └── src/              # Source code
        ├── assets/       # Static assets
        ├── components/   # Reusable components
        ├── pages/        # Page components
        ├── App.jsx       # Main component
        ├── main.jsx      # Entry point
        └── api.js        # API service
```

## Available Scripts

### Backend
- `npm start` - Start the backend server
- `npm run dev` - Start the server in development mode with nodemon
- `npm test` - Run tests

### Frontend
- `npm start` - Start the development server
- `npm test` - Run tests
- `npm run build` - Build for production

## 🔌 API Endpoints

### Auth
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Blogs
- `GET /blogs` - Get all blog posts
- `GET /blogs/:id` - Get a single blog post
- `POST /blogs` - Create a new blog post (protected)
- `PUT /blogs/:id` - Update a blog post (protected)
- `DELETE /blogs/:id` - Delete a blog post (protected)

### AI
- `POST /ai/generate` - Generate blog content using AI (protected)

### Likes
- `POST /likes/:blogId` - Toggle like on a blog post (protected)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ✉️ Contact

Parth Lad - [@ParthLad04](https://github.com/ParthLad04)

Project Link: [https://github.com/ParthLad04/Blog_App](https://github.com/ParthLad04/Blog_App)
