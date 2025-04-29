// In-memory mock data for MSW handlers
export const authUser = {
  userId: 1,
  role: 'ADMIN',
  token: 'fake-jwt-token',
  expiresAt: null
}

export const crewMembers = [
  {
    crewMemberID: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    phoneNumber: '123-456-7890',
    password: 'pass123',
    role: 'USER'
  },
  {
    crewMemberID: 2,
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@example.com',
    phoneNumber: '987-654-3210',
    password: 'pass456',
    role: 'USER'
  },
  {
    crewMemberID: 3,
    firstName: 'Jack',
    lastName: 'Admn',
    email: 'admin@example.com',
    phoneNumber: '555-123-4567',
    password: 'adminpass',
    role: 'ADMIN'
  }
]

export const games = [
  {
    gameID: 1,
    scheduleID: 1,
    gameDate: '2024-11-15',
    gameTime: '18:00',
    venue: 'Amon G. Carter Stadium',
    opponent: 'Baylor',
    crewListIDs: [1, 2]
  },
  {
    gameID: 2,
    scheduleID: 1,
    gameDate: '2024-12-05',
    gameTime: '19:30',
    venue: 'Schollmaier Arena',
    opponent: 'Texas',
    crewListIDs: [1]
  },
  {
    gameID: 3,
    scheduleID: 2,
    gameDate: '2025-02-20',
    gameTime: '13:00',
    venue: 'Lupton Stadium',
    opponent: 'Oklahoma State',
    crewListIDs: []
  }
  ,
  {
    gameID: 4,
    scheduleID: null,
    gameDate: '2025-04-10',
    gameTime: '19:00',
    venue: 'BLUU Stadium',
    opponent: 'Tarleton University',
    crewListIDs: []
  }
]

export const schedules = [
  {
    scheduleID: 1,
    sport: 'Football',
    season: 'Fall 2024',
    gameListIDs: [1, 2]
  },
  {
    scheduleID: 2,
    sport: 'Baseball',
    season: 'Spring 2025',
    gameListIDs: [3]
  }
]

export const availability = [
  {
    crewMemberID: 1,
    comment: 'Available all day'
  },
  {
    crewMemberID: 2,
    comment: 'Not available'
  }
]

export const inviteRequests = [
  {
    email: 'newcrew@example.com',
    role: 'USER'
  }
]

export const inviteResponses = {
  sent: ['newcrew@example.com']
}

export const inviteValidations = [
  {
    token: 'invite-token-123',
    valid: true
  }
]

// Helper function to generate a new ID for a collection
export const getNextId = (collection) => {
  return Math.max(0, ...collection.map(item => 
    item.id || item.crewMemberID || item.gameID || item.scheduleID || 0
  )) + 1;
} 