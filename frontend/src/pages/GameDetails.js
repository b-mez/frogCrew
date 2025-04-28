import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [crewAssignments, setCrewAssignments] = useState([]);
  const [crewMembers, setCrewMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showCrewSelector, setShowCrewSelector] = useState(false);
  const [selectedCrewMembers, setSelectedCrewMembers] = useState([]);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        // Fetch game details
        const gameResponse = await fetch(`/api/games/${id}`);
        if (!gameResponse.ok) {
          throw new Error('Failed to fetch game details');
        }
        const gameData = await gameResponse.json();
        setGame(gameData);

        // Fetch crew assignments for this game
        const assignmentsResponse = await fetch('/api/crew-assignments');
        if (!assignmentsResponse.ok) {
          throw new Error('Failed to fetch crew assignments');
        }
        const assignmentsData = await assignmentsResponse.json();
        const gameAssignments = assignmentsData.filter(assignment => 
          assignment.gameId === parseInt(id)
        );
        setCrewAssignments(gameAssignments);

        // Fetch all crew members
        const crewMembersResponse = await fetch('/api/crew-members');
        if (!crewMembersResponse.ok) {
          throw new Error('Failed to fetch crew members');
        }
        const crewMembersData = await crewMembersResponse.json();
        setCrewMembers(crewMembersData);
        
        // Initialize selected crew members with current assignments
        setSelectedCrewMembers(gameAssignments.map(assignment => assignment.crewMemberId));

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGameData();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(timeString).toLocaleTimeString(undefined, options);
  };

  const handleEdit = () => {
    navigate(`/games/${id}/edit`);
  };

  // Get crew member details by ID
  const getCrewMemberById = (crewMemberId) => {
    return crewMembers.find(member => member.crewMemberID === crewMemberId) || null;
  };

  // Handle crew member selection
  const handleCrewMemberSelection = (crewMemberId) => {
    setSelectedCrewMembers(prev => {
      if (prev.includes(crewMemberId)) {
        return prev.filter(id => id !== crewMemberId);
      } else {
        return [...prev, crewMemberId];
      }
    });
  };

  // Save crew assignments
  const handleSaveCrewAssignments = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      // Get the full crew member objects for the selected IDs
      const selectedCrewMemberObjects = selectedCrewMembers.map(crewId => {
        const member = crewMembers.find(cm => cm.crewMemberID === crewId);
        if (member) {
          // Remove password from the object before sending
          const { password, ...memberWithoutPassword } = member;
          return memberWithoutPassword;
        }
        return null;
      }).filter(Boolean);
      
      // Send PUT request to update crew assignments
      const response = await fetch(`/api/crewSchedule/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedCrewMemberObjects),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update crew assignments');
      }
      
      // Update the game's crewListIDs
      const updatedGame = { ...game, crewListIDs: selectedCrewMembers };
      setGame(updatedGame);
      
      // Update crew assignments
      const updatedAssignments = selectedCrewMemberObjects.map(member => ({
        id: member.crewMemberID,
        gameId: parseInt(id),
        crewMemberId: member.crewMemberID,
        position: `Assigned Position ${member.crewMemberID}`, // Generic position
        reportTime: `${game.gameDate}T${game.gameTime}:00Z`.replace(/:\d{2}/, ':00'),
        reportLocation: game.venue === 'Amon G. Carter Stadium' ? 'Media Entrance' : 'Control Room'
      }));
      setCrewAssignments(updatedAssignments);
      
      // Close the crew selector
      setShowCrewSelector(false);
      setSubmitting(false);
    } catch (err) {
      console.error('Error updating crew assignments:', err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  // Return loading state
  if (loading) {
    return <div className="text-center py-8">Loading game details...</div>;
  }

  // Return error state
  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  // Return not found state
  if (!game) {
    return <div className="text-center py-8">Game not found</div>;
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/games" className="text-primary hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Games
        </Link>
      </div>

      {/* Game details */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-primary p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">
                {game.sport} TCU vs {game.opponent}
              </h1>
              <p className="mt-2 text-lg">
                {formatDate(game.gameDate)} at {formatTime(game.gameTime)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Game Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm">Venue</p>
              <p className="font-medium">{game.venue}</p>
            </div>
            
            <div>
              <p className="text-gray-600 text-sm">Sport</p>
              <p className="font-medium">{game.sport}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Crew Assignments</h2>
            {isAdmin && (
              <button
                onClick={() => setShowCrewSelector(true)}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
              >
                Update Crew
              </button>
            )}
          </div>
          
          {crewAssignments.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-4 bg-gray-100 p-4 font-medium border-b">
                <div>Crew ID</div>
                <div>Name</div>
                <div>Email</div>
                <div>Phone Number</div>
              </div>
              
              {crewAssignments.map(assignment => {
                const crewMember = getCrewMemberById(assignment.crewMemberId);
                return crewMember ? (
                  <div key={assignment.id} className="grid grid-cols-4 p-4 border-b hover:bg-gray-50">
                    <div>#{crewMember.crewMemberID}</div>
                    <div>{crewMember.firstName} {crewMember.lastName}</div>
                    <div>{crewMember.email}</div>
                    <div>{crewMember.phoneNumber}</div>
                  </div>
                ) : (
                  <div key={assignment.id} className="grid grid-cols-4 p-4 border-b hover:bg-gray-50">
                    <div>#{assignment.crewMemberId}</div>
                    <div colSpan="3" className="text-gray-400">Crew member details not available</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600">No crew members have been assigned to this game yet.</p>
          )}
        </div>
      </div>
      
      {/* Crew Selector Modal */}
      {showCrewSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Update Crew Assignments</h2>
                <button 
                  onClick={() => setShowCrewSelector(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Select crew members to assign to this game. Click on a crew member to toggle selection.
                </p>
                
                <div className="border rounded-md max-h-96 overflow-y-auto">
                  {crewMembers.map(member => (
                    <div 
                      key={member.crewMemberID} 
                      className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                        selectedCrewMembers.includes(member.crewMemberID) ? 'bg-primary bg-opacity-10' : ''
                      }`}
                      onClick={() => handleCrewMemberSelection(member.crewMemberID)}
                    >
                      <div className="flex items-center">
                        <div className="mr-3">
                          <input
                            type="checkbox"
                            checked={selectedCrewMembers.includes(member.crewMemberID)}
                            onChange={() => {}}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{member.firstName} {member.lastName}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                          <p className="text-sm text-gray-600">{member.phoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCrewSelector(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCrewAssignments}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetails; 