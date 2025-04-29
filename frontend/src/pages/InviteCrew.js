import React, { useState } from 'react';

const InviteCrew = () => {
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Create invitation data with email and selected role
    const invitationData = {
      email: emails.trim(),
      role: isAdmin ? 'ADMIN' : 'USER'
    };
    
    // Send invitation data to API
    fetch('/api/crew-members/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invitationData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to send invitation');
        }
        return response.json();
      })
      .then(data => {
        setIsLoading(false);
        setMessage('Invitation sent successfully!');
        setEmails('');
        setIsAdmin(false); // Reset role selection
      })
      .catch(error => {
        console.error('Error sending invitation:', error);
        setIsLoading(false);
        setMessage('Failed to send invitation. Please try again.');
      });
  };

  const toggleRole = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Invite Crew Members</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-6">
          Send an invitation email to a new crew member.
        </p>
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="emails" className="block text-gray-700 font-medium mb-2">
              User Email Address
            </label>
            <textarea
              id="emails"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
              rows={6}
              placeholder="super.frog@tcu.edu"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the new user's email address in the text box above.
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              User Role
            </label>
            <div className="flex items-center">
              <span className={`mr-2 ${isAdmin ? 'text-gray-500' : 'font-semibold text-primary'}`}>
                Regular User
              </span>
              <button 
                type="button"
                className="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none"
                onClick={toggleRole}
              >
                <span className={`${isAdmin ? 'bg-primary' : 'bg-gray-300'} absolute block w-11 h-6 rounded-full transition-colors duration-300 ease-in-out`}></span>
                <span 
                  className={`${
                    isAdmin ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'
                  } absolute block w-4 h-4 rounded-full transition duration-300 ease-in-out`}
                ></span>
              </button>
              <span className={`ml-2 ${isAdmin ? 'font-semibold text-primary' : 'text-gray-500'}`}>
                Admin
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Toggle to select whether the invited user will have regular or admin privileges.
            </p>
          </div>
          
          <button
            type="submit"
            className={`bg-primary text-white px-6 py-2 rounded-md ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Invitation'}
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