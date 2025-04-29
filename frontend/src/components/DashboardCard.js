import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ title, description, icon, to, adminOnly = false, isAdmin = false }) => {
  // Don't render admin-only cards for non-admin users
  if (adminOnly && !isAdmin) {
    return null;
  }

  return (
    <Link 
      to={to} 
      className="transform transition-transform hover:scale-105"
    >
      <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
        <div className="flex items-center mb-4">
          <div className="bg-primary text-white p-2 rounded-full">
            {icon}
          </div>
          <h3 className="ml-3 text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 flex-grow">{description}</p>
        <div className="mt-4 pt-2 border-t border-gray-200 flex justify-between items-center">
          <span className="text-primary font-medium">View</span>
          {adminOnly && (
            <span className="bg-secondary text-xs text-primary px-2 py-1 rounded-full">
              Admin
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default DashboardCard; 