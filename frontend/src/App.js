import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Games from './pages/Games';
import GameDetails from './pages/GameDetails';
import CreateGame from './pages/CreateGame';
import Schedules from './pages/Schedules';
import CrewDirectory from './pages/CrewDirectory';
import CrewProfile from './pages/CrewProfile';
import InviteCrew from './pages/InviteCrew';
import Availability from './pages/Availability';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="games" element={<Games />} />
          <Route path="games/create" element={
            <ProtectedRoute requireAdmin={true}>
              <CreateGame />
            </ProtectedRoute>
          } />
          <Route path="games/:id" element={<GameDetails />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="schedules/:scheduleId" element={<Schedules />} />
          <Route path="crew-directory" element={<CrewDirectory />} />
          <Route path="crew-directory/:id" element={<CrewProfile />} />
          <Route path="availability" element={<Availability />} />
          <Route 
            path="invite-crew" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <InviteCrew />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App; 