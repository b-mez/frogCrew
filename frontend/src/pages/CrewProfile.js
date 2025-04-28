import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CrewProfile = () => {
  const { id } = useParams();
  const [crewMember, setCrewMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCrewMember = async () => {
      try {
        const response = await fetch(`/api/crew-members/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch crew member profile');
        }
        const data = await response.json();
        setCrewMember(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCrewMember();
  }, [id]);

  // Redirect non-admin users trying to view other profiles
  useEffect(() => {
    if (!loading && !error && crewMember && !isAdmin && user?.id !== crewMember.crewMemberID) {
      navigate('/crew-directory');
    }
  }, [crewMember, isAdmin, loading, error, navigate, user]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${crewMember.firstName} ${crewMember.lastName}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/crew-members/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete crew member');
      }

      // Redirect to crew directory after successful deletion
      navigate('/crew-directory');
    } catch (err) {
      setDeleteError(err.message);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!crewMember) {
    return <div className="text-center py-8">Crew member not found</div>;
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/crew-directory" className="text-primary hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Directory
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{crewMember.firstName} {crewMember.lastName}</h1>
              {crewMember.role === 'ADMIN' && (
                <span className="inline-block bg-white text-primary text-xs px-2 py-1 rounded-full mt-2">
                  ADMIN
                </span>
              )}
            </div>
            {isAdmin && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete Crew Member'}
              </button>
            )}
          </div>
        </div>
        
        {deleteError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-6 rounded">
            Error: {deleteError}
          </div>
        )}
        
        {isAdmin || (user && user.id === parseInt(id)) ? (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-medium">{crewMember.email}</p>
              </div>
              
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="font-medium">{crewMember.phoneNumber}</p>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Role Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Role</p>
                <p className="font-medium">{crewMember.role}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-600">
              Detailed information is only available to administrators or to your own profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrewProfile; 