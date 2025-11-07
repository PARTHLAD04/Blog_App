# Blog Application

A full-stack blog application built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows users to create, read, update, and delete blog posts.

## Features

- User authentication (Register/Login)
- Create, read, update, and delete blog posts
- Responsive design for all devices
- Rich text editing for blog content
- Secure user authentication using JWT
- RESTful API architecture

## Tech Stack

### Frontend
- React.js
- Redux (for state management)
- React Router (for navigation)
- Axios (for API requests)
- Material-UI or Tailwind CSS (for styling)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose ODM)
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing
- Dotenv for environment variables

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB Atlas account or local MongoDB installation

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

## Project Structure

```
blog-app/
├── backend/               # Backend server
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── .env              # Environment variables
│   ├── package.json      # Backend dependencies
│   └── server.js         # Entry point
│
└── frontend/             # Frontend React application
    ├── public/           # Static files
    └── src/              # Source code
        ├── components/   # Reusable components
        ├── pages/        # Page components
        ├── redux/        # Redux store and slices
        ├── utils/        # Utility functions
        └── App.js        # Main component
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

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a single post
- `POST /api/posts` - Create a new post (protected)
- `PUT /api/posts/:id` - Update a post (protected)
- `DELETE /api/posts/:id` - Delete a post (protected)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

Project Link: [https://github.com/yourusername/blog-app](https://github.com/yourusername/blog-app)
