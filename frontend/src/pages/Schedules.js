import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CreateScheduleForm from '../components/CreateScheduleForm';

const Schedules = () => {
  const { isAdmin } = useAuth();
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddGamesForm, setShowAddGamesForm] = useState(false);
  const [availableGames, setAvailableGames] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch schedules
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/schedules');
      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }
      const data = await response.json();
      setSchedules(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch schedule details and games when a schedule is selected
  useEffect(() => {
    const fetchScheduleDetails = async () => {
      if (!scheduleId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch schedule details
        const scheduleResponse = await fetch(`/api/schedules/${scheduleId}`);
        if (!scheduleResponse.ok) {
          throw new Error('Failed to fetch schedule details');
        }
        const scheduleData = await scheduleResponse.json();
        setSelectedSchedule(scheduleData);
        
        // Fetch each game individually using the gameListIDs from the schedule
        if (scheduleData.gameListIDs && scheduleData.gameListIDs.length > 0) {
          const gamePromises = scheduleData.gameListIDs.map(gameId => 
            fetch(`/api/games/${gameId}`).then(res => {
              if (!res.ok) {
                console.error(`Failed to fetch game ${gameId}`);
                return null; // Return null for failed fetches
              }
              return res.json();
            })
          );
          
          const gamesData = await Promise.all(gamePromises);
          // Filter out any null values from failed fetches
          const validGames = gamesData.filter(game => game !== null);
          setGames(validGames);
        } else {
          setGames([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching schedule details:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchScheduleDetails();
  }, [scheduleId]);

  // Fetch available games for adding to a schedule
  const fetchAvailableGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all games
      const response = await fetch('/api/games');
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const allGames = await response.json();
      
      // Filter games that don't have a schedule assigned or are already in this schedule
      const unscheduledGames = allGames.filter(game => 
        !game.scheduleID || 
        game.scheduleID === null || 
        game.scheduleID === undefined || 
        game.scheduleID === ''
      );
      
      setAvailableGames(unscheduledGames);
      setSelectedGames([]);
      setShowAddGamesForm(true);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching available games:', err);
      setError(err.message);
      setLoading(false);
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

  // Handle schedule selection
  const handleScheduleSelect = (schedule) => {
    navigate(`/schedules/${schedule.scheduleID}`);
  };

  // Handle game selection
  const handleGameSelect = (gameId) => {
    navigate(`/games/${gameId}`);
  };

  // Handle create schedule button click
  const handleCreateScheduleClick = () => {
    setShowCreateForm(true);
  };

  // Handle close create schedule form
  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  // Handle schedule created callback
  const handleScheduleCreated = (newSchedule) => {
    // Refresh the schedules list
    fetchSchedules();
  };

  // Handle game selection for adding to schedule
  const handleGameSelection = (gameId) => {
    setSelectedGames(prev => {
      if (prev.includes(gameId)) {
        return prev.filter(id => id !== gameId);
      } else {
        return [...prev, gameId];
      }
    });
  };

  // Handle adding games to schedule
  const handleAddGamesToSchedule = async () => {
    if (!selectedSchedule || selectedGames.length === 0) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Update each selected game with the schedule ID
      const updatePromises = selectedGames.map(gameId => 
        fetch(`/api/games/${gameId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scheduleID: selectedSchedule.scheduleID
          }),
        }).then(res => {
          if (!res.ok) {
            console.error(`Failed to update game ${gameId}`);
            return null;
          }
          return res.json();
        })
      );
      
      await Promise.all(updatePromises);
      
      // Refresh the schedule details
      const scheduleResponse = await fetch(`/api/schedules/${selectedSchedule.scheduleID}`);
      if (!scheduleResponse.ok) {
        throw new Error('Failed to fetch updated schedule');
      }
      const updatedSchedule = await scheduleResponse.json();
      setSelectedSchedule(updatedSchedule);
      
      // Fetch the updated games
      if (updatedSchedule.gameListIDs && updatedSchedule.gameListIDs.length > 0) {
        const gamePromises = updatedSchedule.gameListIDs.map(gameId => 
          fetch(`/api/games/${gameId}`).then(res => {
            if (!res.ok) {
              console.error(`Failed to fetch game ${gameId}`);
              return null;
            }
            return res.json();
          })
        );
        
        const gamesData = await Promise.all(gamePromises);
        const validGames = gamesData.filter(game => game !== null);
        setGames(validGames);
      }
      
      setShowAddGamesForm(false);
      setSelectedGames([]);
      setSubmitting(false);
    } catch (err) {
      console.error('Error adding games to schedule:', err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  // Render schedule list
  const renderScheduleList = () => {
    if (loading) return <p className="text-center py-8">Loading schedules...</p>;
    if (error) return <p className="text-center py-8 text-red-500">Error: {error}</p>;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedules.length > 0 ? (
          schedules.map(schedule => (
            <div 
              key={schedule.scheduleID} 
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleScheduleSelect(schedule)}
            >
              <h3 className="text-xl font-semibold text-gray-800">{schedule.sport}</h3>
              <p className="text-gray-600">{schedule.season}</p>
              <p className="text-sm text-gray-500 mt-2">
                {schedule.gameListIDs.length} {schedule.gameListIDs.length === 1 ? 'game' : 'games'}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No schedules are currently available.</p>
            {isAdmin && (
              <button 
                onClick={handleCreateScheduleClick}
                className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
              >
                Create New Schedule
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render add games form
  const renderAddGamesForm = () => {
    if (!showAddGamesForm) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add Games to Schedule</h2>
              <button 
                onClick={() => setShowAddGamesForm(false)}
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
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Games to Add
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
                onClick={() => setShowAddGamesForm(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddGamesToSchedule}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                disabled={submitting || selectedGames.length === 0}
              >
                {submitting ? 'Adding...' : 'Add Selected Games'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render schedule details and games
  const renderScheduleDetails = () => {
    if (!selectedSchedule) return null;
    if (loading) return <p className="text-center py-8">Loading schedule details...</p>;
    if (error) return <p className="text-center py-8 text-red-500">Error: {error}</p>;
    
    return (
      <div>
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/schedules')}
            className="mr-4 text-primary hover:underline"
          >
            ← Back to Schedules
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedSchedule.sport} - {selectedSchedule.season}
          </h2>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
            <h3 className="font-medium">Games</h3>
            {isAdmin && (
              <button 
                onClick={fetchAvailableGames}
                className="bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-opacity-90 transition-colors"
              >
                Add Games
              </button>
            )}
          </div>
          
          {games.length > 0 ? (
            <div className="divide-y">
              {games.map(game => (
                <div 
                  key={game.id} 
                  className="p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{formatDate(game.gameDate)}</p>
                      <p className="text-gray-600 text-sm">{formatTime(game.gameTime)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{game.opponent}</p>
                      <p className="text-gray-600 text-sm">{game.venue}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button 
                      onClick={() => handleGameSelect(game.id)}
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                    >
                      View Game Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600">No games are scheduled for this season.</p>
              {isAdmin && (
                <button 
                  onClick={fetchAvailableGames}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Add Games
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Schedules</h1>
        
      </div>
      
      {scheduleId ? renderScheduleDetails() : renderScheduleList()}
      
      {isAdmin && !scheduleId && schedules.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 mb-4">
            As an admin, you can manage game schedules and crew assignments.
          </p>
          <div className="mt-4">
            <button 
              onClick={handleCreateScheduleClick}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 mr-4"
            >
              Create New Schedule
            </button>
          </div>
        </div>
      )}
      
      {showCreateForm && (
        <CreateScheduleForm 
          onClose={handleCloseCreateForm} 
          onScheduleCreated={handleScheduleCreated}
        />
      )}
      
      {renderAddGamesForm()}
    </div>
  );
};

export default Schedules; 