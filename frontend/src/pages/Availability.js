import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Availability = () => {
  const { user, isAdmin } = useAuth();
  const [games, setGames] = useState([]);
  const [availabilityData, setAvailabilityData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [allAvailability, setAllAvailability] = useState([]);

  // Fetch games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        
        // Sort games by date (upcoming first)
        const sortedGames = data.sort((a, b) => {
          return new Date(a.gameDate) - new Date(b.gameDate);
        });
        
        setGames(sortedGames);
        
        // Initialize availabilityData with empty values
        const initialData = {};
        sortedGames.forEach(game => {
          initialData[game.id] = '';
        });
        setAvailabilityData(initialData);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchGames();
  }, []);

  // For admins, fetch all crew availability
  useEffect(() => {
    if (isAdmin) {
      const fetchAllAvailability = async () => {
        try {
          // We'll need to fetch availability for each game
          if (games.length === 0) return;
          
          const availabilityPromises = games.map(game => 
            fetch(`/api/availability/game/${game.id}`)
              .then(res => res.ok ? res.json() : [])
              .then(data => ({ gameId: game.id, availabilities: data }))
          );
          
          const results = await Promise.all(availabilityPromises);
          setAllAvailability(results);
        } catch (err) {
          console.error('Error fetching all availability:', err);
        }
      };
      
      fetchAllAvailability();
    }
  }, [isAdmin, games]);

  // Handle input change for availability comments
  const handleAvailabilityChange = (gameId, value) => {
    setAvailabilityData(prev => ({
      ...prev,
      [gameId]: value
    }));
  };

  // Submit availability
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage('');
    
    try {
      // Format all game comments into one submission
      const gameComments = Object.entries(availabilityData)
        .filter(([_, comment]) => comment.trim() !== '')
        .map(([gameId, comment]) => {
          const game = games.find(g => g.id === parseInt(gameId));
          return `Game vs ${game.opponent} on ${formatDate(game.gameDate)}: ${comment}`;
        })
        .join('\n\n');
      
      if (!gameComments) {
        setError('Please provide availability for at least one game');
        setSubmitting(false);
        return;
      }
      
      // Submit to the API
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          crewMemberID: user.id,
          comment: gameComments
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit availability');
      }
      
      // Clear the form
      const resetData = {};
      games.forEach(game => {
        resetData[game.id] = '';
      });
      setAvailabilityData(resetData);
      
      setMessage('Your availability has been submitted successfully!');
      setSubmitting(false);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (timeString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(timeString).toLocaleTimeString(undefined, options);
  };

  // Render the crew member availability submission form
  const renderAvailabilityForm = () => {
    if (loading) return <p className="text-center py-8">Loading games...</p>;
    if (error && !message) return <p className="text-center py-8 text-red-500">Error: {error}</p>;
    
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6">Submit Your Availability</h2>
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}
        
        {error && !message && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-gray-100 p-4 font-medium border-b">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">Game</div>
                <div className="col-span-3">Date & Time</div>
                <div className="col-span-2">Venue</div>
                <div className="col-span-3">Your Availability</div>
              </div>
            </div>
            
            <div className="divide-y">
              {games.length > 0 ? (
                games.map(game => (
                  <div key={game.id} className="p-4 hover:bg-gray-50">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-4">
                        <p className="font-medium">TCU vs {game.opponent}</p>
                      </div>
                      <div className="col-span-3">
                        <p>{formatDate(game.gameDate)}</p>
                        <p className="text-sm text-gray-600">{formatTime(game.gameTime)}</p>
                      </div>
                      <div className="col-span-2">
                        <p>{game.venue}</p>
                      </div>
                      <div className="col-span-3">
                        <textarea
                          value={availabilityData[game.id] || ''}
                          onChange={(e) => handleAvailabilityChange(game.id, e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm"
                          rows={2}
                          placeholder="Available/Not Available"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-8 text-center text-gray-500">
                  No upcoming games found. Check back later for game schedules.
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className={`bg-primary text-white px-6 py-2 rounded-md ${
                submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'
              }`}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Availability'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Render the admin view of all crew availability
  const renderAdminView = () => {
    if (loading) return <p className="text-center py-8">Loading availability data...</p>;
    
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6">Crew Availability Overview</h2>
        
        {games.length > 0 ? (
          games.map(game => {
            const gameAvailability = allAvailability.find(a => a.gameId === game.id);
            const availabilities = gameAvailability ? gameAvailability.availabilities : [];
            
            return (
              <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="bg-primary p-4 text-white">
                  <h3 className="text-xl font-semibold">TCU vs {game.opponent}</h3>
                  <p className="text-sm">
                    {formatDate(game.gameDate)} at {formatTime(game.gameTime)} | {game.venue}
                  </p>
                </div>
                
                <div className="p-4">
                  <h4 className="font-medium mb-4">Crew Availability</h4>
                  
                  {availabilities.length > 0 ? (
                    <div className="divide-y border rounded-md">
                      {availabilities.map((availability, index) => (
                        <div key={index} className="p-4 grid grid-cols-12 gap-4">
                          <div className="col-span-3">
                            <p className="font-medium">{availability.crewMember.firstName} {availability.crewMember.lastName}</p>
                            <p className="text-sm text-gray-600">{availability.crewMember.email}</p>
                          </div>
                          <div className="col-span-9">
                            <p className="text-gray-800 whitespace-pre-line">{availability.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center p-4">
                      No availability submissions for this game yet.
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center py-8 text-gray-500">
            Game availability is not yet available for this season.
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Availability</h1>
      
      {isAdmin ? renderAdminView() : renderAvailabilityForm()}
    </div>
  );
};

export default Availability; 