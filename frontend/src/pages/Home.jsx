import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Search, Heart, UserPlus, Sparkles, Globe } from 'lucide-react';

export default function Home({ user }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            MERN Blog
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Share your ideas, inspire the world — from Surat with love
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Welcome Card */}
          <div
            className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 
                       hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >
            {/* Gradient Orb */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-linear-to-br from-indigo-400 to-purple-400 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl text-white">
                  <PenTool size={28} />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Start Writing Today</h2>
              </div>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                A minimal, powerful blog platform built with <span className="font-semibold text-indigo-600">MERN stack</span> and styled with <span className="font-semibold text-purple-600">Tailwind CSS</span>. 
                Create an account to publish your thoughts or explore stories from the community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  className="group/btn inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl
                           hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Search size={20} />
                  Discover Blogs
                </Link>

                {!user && (
                  <Link
                    to="/signup"
                    className="group/btn inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-800 font-semibold rounded-xl border-2 border-slate-200
                           hover:border-indigo-300 hover:bg-indigo-50 transform hover:scale-105 transition-all duration-300"
                  >
                    <UserPlus size={20} />
                    Get Started Free
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right: Features Card */}
          <div
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 
                       hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl text-white">
                <Sparkles size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Powerful Features</h3>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {[
                { icon: Globe, title: "Public Dashboard", desc: "Browse all blogs from the community" },
                { icon: Heart, title: "Like & Engage", desc: "Show appreciation (login required)" },
                { icon: PenTool, title: "Full CRUD", desc: "Create, edit, delete your own posts" },
                { icon: UserPlus, title: "JWT Auth", desc: "Secure login and user sessions" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <feature.icon size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{feature.title}</h4>
                    <p className="text-sm text-slate-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-16">
          <p className="text-sm text-slate-500">
            Made with <span className="text-red-500">❤</span> in <span className="font-semibold text-indigo-600">Surat, Gujarat</span> · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}