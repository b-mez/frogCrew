import React from 'react';
import DashboardCard from '../components/DashboardCard';
import { useAuth } from '../contexts/AuthContext';

// Icons for dashboard cards
const GamesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SchedulesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CrewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const InviteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const AvailabilityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Dashboard = () => {
  const { isAdmin } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Games Card */}
        <DashboardCard 
          title="Games" 
          description="View a list of all games and their details."
          icon={<GamesIcon />}
          to="/games"
          isAdmin={isAdmin}
        />
        
        {/* Schedules Card */}
        <DashboardCard 
          title="Schedules" 
          description={isAdmin ? "Manage game schedules and crew assignments." : "View your scheduled games and assignments."}
          icon={<SchedulesIcon />}
          to="/schedules"
          isAdmin={isAdmin}
        />
        
        {/* Crew Directory Card */}
        <DashboardCard 
          title="Crew Directory" 
          description="View all crew members and their contact information."
          icon={<CrewIcon />}
          to="/crew-directory"
          isAdmin={isAdmin}
        />
        
        {/* Availability Card */}
        <DashboardCard 
          title="Availability" 
          description={isAdmin ? "View crew member availability for games." : "Submit your availability for upcoming games."}
          icon={<AvailabilityIcon />}
          to="/availability"
          isAdmin={isAdmin}
        />

        {/* Invite Crew Card - Admin Only */}
        <DashboardCard 
          title="Invite Crew" 
          description="Send invitations to new crew members to join the platform."
          icon={<InviteIcon />}
          to="/invite-crew"
          adminOnly={true}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
};

export default Dashboard; 