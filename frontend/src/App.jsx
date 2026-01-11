import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Placeholder pages
import HomePage from './pages/HomePage';
import CreateEditPostPage from './pages/CreateEditPostPage';
import PostDetailsPage from './pages/PostDetailsPage';
import ProfilePage from './pages/ProfilePage'; // Correct import

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="create-post" element={<CreateEditPostPage />} />
          <Route path="edit-post/:id" element={<CreateEditPostPage />} />
          <Route path="posts/:id" element={<PostDetailsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" theme="colored" />
    </AuthProvider>
  );
}

export default App;
