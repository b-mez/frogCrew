import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CrewDirectory = () => {
  const [crewMembers, setCrewMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchCrewMembers = async () => {
      try {
        const response = await fetch('/api/crew-members');
        if (!response.ok) {
          throw new Error('Failed to fetch crew members');
        }
        const data = await response.json();
        setCrewMembers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCrewMembers();
  }, []);

  // Filter crew members based on search term
  const filteredCrewMembers = crewMembers.filter(member => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    
    // Different filtering based on role
    if (isAdmin) {
      return fullName.includes(searchTerm.toLowerCase()) || 
             member.email.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      // Regular users can only search by name
      return fullName.includes(searchTerm.toLowerCase());
    }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Crew Directory</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-4">
          {isAdmin 
            ? "View all crew members and their complete contact information." 
            : "View all crew members. Contact information restricted to admin users only."}
        </p>
        
        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder={isAdmin ? "Search by name or email..." : "Search by name..."}
              className="w-full p-3 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading and error states */}
        {loading && <p className="text-center py-4">Loading crew members...</p>}
        {error && <p className="text-center py-4 text-red-500">Error: {error}</p>}

        {/* Crew list */}
        {!loading && !error && (
          <div className="border rounded-md divide-y">
            {filteredCrewMembers.length > 0 ? (
              filteredCrewMembers.map(member => (
                <div key={member.crewMemberID} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium">{member.firstName} {member.lastName}</h3>
                    {isAdmin && (
                      <>
                        <p className="text-sm text-gray-500">{member.email} | {member.phoneNumber}</p>
                        <div className="mt-1">
                          {member.role === 'ADMIN' && (
                            <span className="bg-secondary text-primary text-xs px-2 py-1 rounded-full">
                              ADMIN
                            </span>
                          )}
                        </div>
                      </>
                    )}
                    
                    {!isAdmin && member.role === 'ADMIN' && (
                      <div className="mt-1">
                        <span className="bg-secondary text-primary text-xs px-2 py-1 rounded-full">
                          ADMIN
                        </span>
                      </div>
                    )}
                  </div>
                  <Link to={`/crew-directory/${member.crewMemberID}`} className="text-primary hover:underline">
                    View Profile
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center py-4">No crew members found matching "{searchTerm}"</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrewDirectory; 