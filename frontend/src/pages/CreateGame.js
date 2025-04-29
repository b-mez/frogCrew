import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const CreateGame = () => {
  const navigate = useNavigate();
  const [gameData, setGameData] = useState({
    opponent: '',
    gameDate: '',
    gameTime: '',
    venue: '',
    sport: '',
    scheduleID: null
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGameData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!gameData.opponent || !gameData.gameDate || !gameData.gameTime || !gameData.venue || !gameData.sport) {
        throw new Error('Please fill all required fields');
      }

      // Format data for API
      const formattedData = {
        ...gameData,
        scheduleID: gameData.scheduleID === '' ? null : gameData.scheduleID
      };

      // Send request to create game
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      const data = await response.json();
      console.log('Game created:', data);
      
      // Redirect to the game details page
      navigate(`/games/${data.id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary p-6 text-white">
          <h1 className="text-3xl font-bold">Create New Game</h1>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="opponent">
                  Opponent*
                </label>
                <input
                  id="opponent"
                  name="opponent"
                  type="text"
                  value={gameData.opponent}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Baylor"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sport">
                  Sport*
                </label>
                <input
                  id="sport"
                  name="sport"
                  type="text"
                  value={gameData.sport}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Football"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gameDate">
                  Game Date*
                </label>
                <input
                  id="gameDate"
                  name="gameDate"
                  type="date"
                  value={gameData.gameDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gameTime">
                  Game Time*
                </label>
                <input
                  id="gameTime"
                  name="gameTime"
                  type="time"
                  value={gameData.gameTime}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="venue">
                  Venue*
                </label>
                <input
                  id="venue"
                  name="venue"
                  type="text"
                  value={gameData.venue}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Amon G. Carter Stadium"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Link
                to="/games"
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Game'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGame; 