import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateScheduleForm = ({ onClose, onScheduleCreated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    scheduleID: '',
    sport: '',
    season: '',
  });
  const [availableGames, setAvailableGames] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available games (games without a schedule)
  useEffect(() => {
    const fetchAvailableGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all games
        const response = await fetch('/api/games');
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const games = await response.json();
        
        // Filter games that don't have a schedule assigned (scheduleID is null, undefined, or empty string)
        const unscheduledGames = games.filter(game => 
          game.scheduleID === null || 
          game.scheduleID === undefined || 
          game.scheduleID === ''
        );
        
        console.log('All games:', games);
        console.log('Unscheduled games:', unscheduledGames);
        
        setAvailableGames(unscheduledGames);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching available games:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAvailableGames();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle game selection
  const handleGameSelection = (gameId) => {
    setSelectedGames(prev => {
      if (prev.includes(gameId)) {
        return prev.filter(id => id !== gameId);
      } else {
        return [...prev, gameId];
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.scheduleID || !formData.sport || !formData.season) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Prepare the schedule data
      const scheduleData = {
        scheduleID: parseInt(formData.scheduleID),
        sport: formData.sport,
        season: formData.season,
        gameIds: selectedGames
      };
      
      // Log the exact data being submitted
      console.log('Submitting schedule:', scheduleData);
      
      // Create the schedule
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create schedule');
      }
      
      const newSchedule = await response.json();
      
      // Notify parent component that a new schedule has been created
      if (onScheduleCreated) {
        onScheduleCreated(newSchedule);
      }
      
      // Navigate to the new schedule's page
      navigate(`/schedules/${newSchedule.scheduleID}`);
      
      // Close the form
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      setError('Failed to create schedule. Please try again.');
    } finally {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create New Schedule</h2>
            <button 
              onClick={onClose}
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
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scheduleID">
                Schedule ID *
              </label>
              <input
                type="text"
                id="scheduleID"
                name="scheduleID"
                value={formData.scheduleID}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g., FB2024, BB2025"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sport">
                Sport *
              </label>
              <input
                type="text"
                id="sport"
                name="sport"
                value={formData.sport}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g., Football, Basketball"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="season">
                Season *
              </label>
              <input
                type="text"
                id="season"
                name="season"
                value={formData.season}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g., Fall 2024, Spring 2025"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Games (Optional)
              </label>
              
              {loading ? (
                <p className="text-gray-500">Loading available games...</p>
              ) : availableGames.length > 0 ? (
                <div className="border rounded-md max-h-60 overflow-y-auto">
                  {availableGames.map(game => (
                    <div 
                      key={game.id} 
                      className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                        selectedGames.includes(game.id) ? 'bg-primary bg-opacity-10' : ''
                      }`}
                      onClick={() => handleGameSelection(game.id)}
                    >
                      <div className="flex items-center">
                        <div className="mr-3">
                          <input
                            type="checkbox"
                            checked={selectedGames.includes(game.id)}
                            onChange={() => {}}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                        </div>
                        <div>
                          <p className="font-medium">TCU vs {game.opponent}</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(game.gameDate)} at {formatTime(game.gameTime)}
                          </p>
                          <p className="text-sm text-gray-600">{game.venue}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No unscheduled games available.</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Schedule'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateScheduleForm; 