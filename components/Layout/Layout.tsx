import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
                <span className="font-bold text-xl text-slate-800 tracking-tight">CMS<span className="text-blue-600">AI</span></span>
              </Link>
              <div className="hidden md:flex ml-10 space-x-8">
                <Link to="/" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                <Link to="/about" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                        <UserIcon size={14} />
                        <span className="font-medium">{user?.username}</span>
                    </div>
                    {user?.role === UserRole.ADMIN && (
                        <Link to="/admin" className="text-slate-600 hover:text-indigo-600 transition-colors">
                             <LayoutDashboard size={20} />
                        </Link>
                    )}
                    <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors">
                        <LogOut size={20} />
                    </button>
                </>
              ) : (
                <div className="flex gap-2">
                   <button onClick={() => login(UserRole.USER)} className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
                     Login
                   </button>
                   <button onClick={() => login(UserRole.ADMIN)} className="text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors shadow-md">
                     Admin Demo
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow bg-slate-50">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; 2023 React Markdown CMS. Built with React, Tailwind & Gemini.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
