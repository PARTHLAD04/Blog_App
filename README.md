# Blog Application

A modern full-stack blog application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring AI-powered content generation via a Python microservice, and a clean, responsive interface.

## ✨ Features

- 🔐 **User Authentication** (Register/Login) with JWT
- 📝 **Blog Management**: Create, read, update, and delete blog posts
- 💬 **Comments System**: Engage with posts through comments
- 🏷️ **Categories**: Organize posts by categories
- 🔖 **Bookmarking**: Save posts for later reading
- 🤖 **AI-Powered Generation**: Generate blog content using a local LLM (LiquidAI/LFM2.5)
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- ❤️ **Interactions**: Like and interact with posts
- 👤 **User Profiles**: Manage user profile and dashboard

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React 19**
- 🛣️ **React Router v6**
- 🎨 **Tailwind CSS** for styling
- 🔄 **React Icons**
- 📊 **React Toastify** for notifications
- ⚡ **Vite** for optimized build and development

### Backend (Node.js)
- 🚀 **Express.js** & **Node.js**
- 🍃 **MongoDB** with **Mongoose**
- 🔑 **JWT** & **Bcrypt** for security
- 🌐 **CORS** enabled
- 📦 **Axios** for AI service communication

### AI Microservice (Python)
- 🐍 **Python 3.x**
- ⚡ **FastAPI**
- 🤗 **Hugging Face Transformers**
- 🤖 **Model**: LiquidAI/LFM2.5-1.2B-Instruct

## 🚀 Prerequisites

- Node.js (v18 or later)
- Python (v3.8 or later)
- MongoDB Atlas account or local MongoDB installation
- git

## 📁 Project Structure

```
Blog app/
├── backend/               # Node.js Express Server
│   ├── middleware/       # Auth middleware
│   ├── models/           # Mongoose Models (User, Blog, Comment, Category, Bookmark)
│   ├── routes/           # API Routes (auth, users, posts, comments, categories, ai)
│   ├── utils/            # DB connection, etc.
│   └── server.js         # Backend Entry Point
│
├── frontend/             # React Frontend
│   ├── src/
│   │   ├── components/   # UI Components
│   │   ├── pages/        # Application Pages
│   │   ├── api.js        # API Integration
│   │   └── App.jsx       # Main App Component
│   └── vite.config.js    # Vite Configuration
│
└── model/                # Python AI Microservice
    └── model_service.py  # FastAPI AI Server
```

## 🛠️ Getting Started

### 1. Backend Setup (Node.js)

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Run the backend:
```bash
npm start
```

### 2. AI Service Setup (Python)

Navigate to the `model` directory:
```bash
cd model
```

Install Python dependencies (create a virtual environment recommended):
```bash
pip install fastapi uvicorn transformers torch pydantic
```

Start the AI server on port **8001**:
```bash
uvicorn model_service:app --port 8001 --reload
```
*Note: The Node.js backend expects the AI service to be running on port 8001.*

### 3. Frontend Setup (React)

Open a new terminal and navigate to `frontend/`:
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (Protected)
- `PUT /api/posts/:id` - Update post (Protected)
- `DELETE /api/posts/:id` - Delete post (Protected)

### AI Generation
- `POST /api/ai/generate-blog` - Generate content (Protected)

### Comments & Interactions
- `POST /api/comments/:postId` - Add comment
- `POST /api/likes/:postId` - Toggle like

### Categories
- `GET /api/categories` - List categories

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ✉️ Contact

Parth Lad - [@ParthLad04](https://github.com/ParthLad04)

Project Link: [https://github.com/ParthLad04/Blog_App](https://github.com/ParthLad04/Blog_App)
