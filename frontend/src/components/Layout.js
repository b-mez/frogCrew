import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, logout, isAdmin, toggleUserRole } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <NavLink to="/" className="text-white text-2xl font-bold">
              FrogCrew
            </NavLink>
            <NavLink 
              to="/" 
              className="ml-4 text-white hover:text-secondary flex items-center"
              title="Home"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
            </NavLink>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-white">{user.name}</span>
                <span className="bg-secondary text-primary text-xs px-2 py-1 rounded-full">
                  {user.role}
                </span>
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={toggleUserRole}
                    className="bg-secondary text-primary px-3 py-1 rounded-md hover:bg-gray-100 text-sm"
                    title="Toggle between ADMIN and USER role for testing"
                  >
                    Toggle Role
                  </button>
                )}
                <button 
                  onClick={logout}
                  className="bg-white text-primary px-3 py-1 rounded-md hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-200 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} FrogCrew. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout; 