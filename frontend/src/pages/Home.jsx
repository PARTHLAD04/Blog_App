import React from 'react';
import { Link } from 'react-router-dom';

export default function Home({ user }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4">Create and share your thoughts</h1>
        <p className="text-slate-600 mb-6">A minimal blog built with MERN stack and Tailwind CSS. Create an account to start writing, or browse public posts.</p>
        <div className="flex gap-3">
          <Link to="/dashboard" className="px-4 py-2 bg-indigo-600 text-white rounded">Discover</Link>
          {!user && <Link to="/signup" className="px-4 py-2 border rounded">Get Started</Link>}
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-3">Features</h3>
        <ul className="list-disc ml-5 text-slate-700">
          <li>Signup / Login with JWT</li>
          <li>Create, edit, delete your blogs</li>
          <li>Public dashboard to browse all blogs</li>
          <li>Like posts (logged-in users)</li>
        </ul>
      </div>
    </div>
  );
}
