import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'sport', 'venue', or 'opponent'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        
        // Convert date strings to Date objects for easier sorting
        const processedData = data.map(game => ({
          ...game,
          gameDateObj: new Date(game.gameDate)
        }));
        
        setGames(processedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Filter games based on search term
  const filteredGames = games.filter(game => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (game.sport && game.sport.toLowerCase().includes(searchLower)) ||
      (game.opponent && game.opponent.toLowerCase().includes(searchLower)) ||
      (game.venue && game.venue.toLowerCase().includes(searchLower))
    );
  });

  // Sort games based on sorting criteria
  const sortedGames = [...filteredGames].sort((a, b) => {
    let compareA, compareB;
    
    switch (sortBy) {
      case 'date':
        compareA = a.gameDateObj;
        compareB = b.gameDateObj;
        break;
      case 'sport':
        compareA = a.sport ? a.sport.toLowerCase() : '';
        compareB = b.sport ? b.sport.toLowerCase() : '';
        break;
      case 'venue':
        compareA = a.venue ? a.venue.toLowerCase() : '';
        compareB = b.venue ? b.venue.toLowerCase() : '';
        break;
      case 'opponent':
        compareA = a.opponent ? a.opponent.toLowerCase() : '';
        compareB = b.opponent ? b.opponent.toLowerCase() : '';
        break;
      default:
        compareA = a.gameDateObj;
        compareB = b.gameDateObj;
    }
    
    // Handle sorting direction
    if (sortDirection === 'asc') {
      return compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
    } else {
      return compareA > compareB ? -1 : compareA < compareB ? 1 : 0;
    }
  });

  // Handle sort toggle
  const toggleSort = (field) => {
    if (sortBy === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortBy(field);
      setSortDirection('asc');
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Games</h1>
        {isAdmin && (
          <Link 
            to="/games/create" 
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Add New Game
          </Link>
        )}
      </div>

      {/* Search and filter controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search games by sport, opponent, or venue..."
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
      {loading && <p className="text-center py-8">Loading games...</p>}
      {error && <p className="text-center py-8 text-red-500">Error: {error}</p>}

      {/* Games list */}
      {!loading && !error && (
        <>
          {sortedGames.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-5 bg-gray-100 p-4 font-medium border-b">
                <div 
                  className="cursor-pointer flex items-center" 
                  onClick={() => toggleSort('date')}
                >
                  <span>Date & Time</span>
                  {sortBy === 'date' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
                <div 
                  className="cursor-pointer flex items-center" 
                  onClick={() => toggleSort('sport')}
                >
                  <span>Sport</span>
                  {sortBy === 'sport' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
                <div 
                  className="cursor-pointer flex items-center" 
                  onClick={() => toggleSort('opponent')}
                >
                  <span>Opponent</span>
                  {sortBy === 'opponent' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
                <div 
                  className="cursor-pointer flex items-center" 
                  onClick={() => toggleSort('venue')}
                >
                  <span>Venue</span>
                  {sortBy === 'venue' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
                <div>Actions</div>
              </div>

              {/* Table body */}
              {sortedGames.map(game => (
                <div key={game.id} className="grid grid-cols-5 p-4 border-b hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{formatDate(game.gameDate)}</p>
                    <p className="text-gray-600 text-sm">{formatTime(game.gameTime)}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                      {game.sport || 'N/A'}
                    </span>
                  </div>
                  <div>{game.opponent || 'N/A'}</div>
                  <div>{game.venue || 'N/A'}</div>
                  <div>
                    <Link 
                      to={`/games/${game.id}`}
                      className="text-primary hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">
                {searchTerm 
                  ? `No games found matching "${searchTerm}"`
                  : "No games are currently scheduled."}
              </p>
              {isAdmin && !searchTerm && (
                <Link 
                  to="/games/create" 
                  className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Add New Game
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Games; 