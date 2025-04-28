import React, { useState } from 'react';

const InviteCrew = () => {
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setMessage('Invitations sent successfully!');
      setEmails('');
    }, 1500);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Invite Crew Members</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-6">
          Send invitation emails to new crew members. Enter one email address per line.
        </p>
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="emails" className="block text-gray-700 font-medium mb-2">
              Email Addresses
            </label>
            <textarea
              id="emails"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
              rows={6}
              placeholder="john.doe@example.com&#10;jane.smith@example.com"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter one email address per line
            </p>
          </div>
          
          <button
            type="submit"
            className={`bg-primary text-white px-6 py-2 rounded-md ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Invitations'}
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Invitations</h2>
        <div className="border rounded-md divide-y">
          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">john.doe@example.com</p>
              <p className="text-sm text-gray-500">Sent 2 days ago</p>
            </div>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              Pending
            </span>
          </div>
          
          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">jane.smith@example.com</p>
              <p className="text-sm text-gray-500">Sent 3 days ago</p>
            </div>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Accepted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteCrew; 