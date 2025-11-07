import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Signup({ onAuth }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const change = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) return setError('All fields required');
    if (form.password.length < 6) return setError('Password min 6 chars');

    try {
      await API.post('/auth/signup', form);
      await onAuth();
      navigate('/myblogs');
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Sign up</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm">Name</label>
          <input name="name" value={form.name} onChange={change} className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input name="email" type="email" value={form.email} onChange={change} className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input name="password" type="password" value={form.password} onChange={change} className="w-full mt-1 p-2 border rounded" />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="w-full bg-indigo-600 text-white py-2 rounded">Create account</button>
      </form>
    </div>
  );
}
