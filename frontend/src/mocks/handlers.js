import { http, HttpResponse } from 'msw'
import { 
  crewMembers, 
  games, 
  schedules, 
  availability, 
  inviteRequests, 
  inviteResponses, 
  inviteValidations, 
  getNextId 
} from './mockData'

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json()
    
    // Find the user by email and password
    const user = crewMembers.find(member => 
      member.email === email && member.password === password
    )
    
    if (!user) {
      return new HttpResponse(null, { status: 401 })
    }
    
    return HttpResponse.json({
      id: user.crewMemberID,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      token: 'fake-jwt-token'
    })
  }),

  // Crew Member endpoints
  http.get('/api/crew-members', () => {
    // Return all crew members but omit passwords
    const sanitizedCrewMembers = crewMembers.map(({ password, ...member }) => member)
    return HttpResponse.json(sanitizedCrewMembers)
  }),

  http.get('/api/crew-members/:id', ({ params }) => {
    const { id } = params
    const crewMember = crewMembers.find(member => member.crewMemberID === parseInt(id))
    
    if (!crewMember) {
      return new HttpResponse(null, { status: 404 })
    }
    
    // Return member without password
    const { password, ...sanitizedMember } = crewMember
    return HttpResponse.json(sanitizedMember)
  }),

  // Delete a crew member
  http.delete('/api/crew-members/:id', ({ params }) => {
    const { id } = params
    const crewId = parseInt(id)
    
    // Find the crew member
    const crewMemberIndex = crewMembers.findIndex(member => member.crewMemberID === crewId)
    
    if (crewMemberIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    // Remove the crew member from the array
    crewMembers.splice(crewMemberIndex, 1)
    
    // Remove the crew member from all games they're assigned to
    games.forEach(game => {
      if (game.crewListIDs.includes(crewId)) {
        game.crewListIDs = game.crewListIDs.filter(id => id !== crewId)
      }
    })
    
    // Remove the crew member from all schedules
    schedules.forEach(schedule => {
      // If the schedule has a crewListIDs property, remove the crew member
      if (schedule.crewListIDs && schedule.crewListIDs.includes(crewId)) {
        schedule.crewListIDs = schedule.crewListIDs.filter(id => id !== crewId)
      }
    })
    
    // Remove availability records for the crew member
    const availabilityIndex = availability.findIndex(a => a.crewMemberID === crewId)
    if (availabilityIndex !== -1) {
      availability.splice(availabilityIndex, 1)
    }
    
    // Remove any invite requests for this crew member
    const inviteIndex = inviteRequests.findIndex(invite => invite.email === crewMembers[crewMemberIndex]?.email)
    if (inviteIndex !== -1) {
      inviteRequests.splice(inviteIndex, 1)
    }
    
    return new HttpResponse(null, { status: 200 })
  }),

  http.post('/api/crew-members/invite', async ({ request }) => {
    const data = await request.json()
    
    // Add to invite requests
    inviteRequests.push(data)
    
    // Add to sent invites
    inviteResponses.sent.push(data.email)
    
    return HttpResponse.json({
      message: 'Invitation sent successfully'
    })
  }),

  // Game schedule endpoints
  http.get('/api/games', () => {
    // Format game dates for the frontend
    const formattedGames = games.map(game => ({
      id: game.gameID,
      opponent: game.opponent,
      gameDate: `${game.gameDate}T${game.gameTime}:00Z`,
      gameTime: `${game.gameDate}T${game.gameTime}:00Z`,
      venue: game.venue,
      scheduleID: game.scheduleID,
      crewListIDs: game.crewListIDs
    }))
    
    return HttpResponse.json(formattedGames)
  }),

  http.get('/api/games/:id', ({ params }) => {
    const { id } = params
    const game = games.find(g => g.gameID === parseInt(id))
    
    if (!game) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json({
      id: game.gameID,
      opponent: game.opponent,
      gameDate: `${game.gameDate}T${game.gameTime}:00Z`,
      gameTime: `${game.gameDate}T${game.gameTime}:00Z`,
      venue: game.venue,
      scheduleID: game.scheduleID,
      crewListIDs: game.crewListIDs
    })
  }),

  // Patch a game to update its scheduleID
  http.patch('/api/games/:id', async ({ request, params }) => {
    const { id } = params
    const gameId = parseInt(id)
    const game = games.find(g => g.gameID === gameId)
    
    if (!game) {
      return new HttpResponse(null, { status: 404 })
    }
    
    const updates = await request.json()
    
    // Update the game with the new data
    if (updates.scheduleID !== undefined) {
      // Remove the game from its previous schedule's gameListIDs if it had one
      if (game.scheduleID !== null && game.scheduleID !== undefined) {
        const oldSchedule = schedules.find(s => s.scheduleID === game.scheduleID)
        if (oldSchedule) {
          oldSchedule.gameListIDs = oldSchedule.gameListIDs.filter(id => id !== gameId)
        }
      }
      
      // Update the game's scheduleID
      game.scheduleID = updates.scheduleID
      
      // Add the game to the new schedule's gameListIDs
      if (updates.scheduleID !== null && updates.scheduleID !== undefined) {
        const newSchedule = schedules.find(s => s.scheduleID === updates.scheduleID)
        if (newSchedule && !newSchedule.gameListIDs.includes(gameId)) {
          newSchedule.gameListIDs.push(gameId)
        }
      }
    }
    
    return HttpResponse.json({
      id: game.gameID,
      opponent: game.opponent,
      gameDate: `${game.gameDate}T${game.gameTime}:00Z`,
      gameTime: `${game.gameDate}T${game.gameTime}:00Z`,
      venue: game.venue,
      scheduleID: game.scheduleID,
      crewListIDs: game.crewListIDs
    })
  }),

  // Post a new game
  http.post('/api/games', async ({ request }) => {
    const gameData = await request.json()
    const newId = getNextId(games)
    
    const newGame = {
      gameID: newId,
      scheduleID: gameData.scheduleID,
      gameDate: gameData.gameDate,
      gameTime: gameData.gameTime,
      venue: gameData.venue,
      opponent: gameData.opponent,
      crewListIDs: []
    }
    
    games.push(newGame)
    
    // Update the schedule's game list if needed
    const schedule = schedules.find(s => s.scheduleID === gameData.scheduleID)
    if (schedule) {
      schedule.gameListIDs.push(newId)
    }
    
    return HttpResponse.json({
      id: newId,
      ...gameData
    })
  }),

  // Crew assignments
  http.get('/api/crew-assignments', () => {
    // Create assignments based on the game crew lists
    const assignments = []
    
    games.forEach(game => {
      game.crewListIDs.forEach(crewId => {
        const crewMember = crewMembers.find(cm => cm.crewMemberID === crewId)
        if (crewMember) {
          assignments.push({
            id: assignments.length + 1,
            gameId: game.gameID,
            crewMemberId: crewId,
            position: `Assigned Position ${assignments.length + 1}`, // Generic position
            reportTime: `${game.gameDate}T${game.gameTime}:00Z`.replace(/:\d{2}/, ':00'),
            reportLocation: game.venue === 'Amon G. Carter Stadium' ? 'Media Entrance' : 'Control Room'
          })
        }
      })
    })
    
    return HttpResponse.json(assignments)
  }),

  http.get('/api/crew-assignments/user/:userId', ({ params }) => {
    const { userId } = params
    const userIdInt = parseInt(userId)
    
    // Find assignments for this user
    const userAssignments = []
    
    games.forEach(game => {
      if (game.crewListIDs.includes(userIdInt)) {
        const crewMember = crewMembers.find(cm => cm.crewMemberID === userIdInt)
        if (crewMember) {
          const schedule = schedules.find(s => s.scheduleID === game.scheduleID)
          
          userAssignments.push({
            id: userAssignments.length + 1,
            gameId: game.gameID,
            crewMemberId: userIdInt,
            position: `Assigned Position ${userAssignments.length + 1}`, // Generic position
            reportTime: `${game.gameDate}T${game.gameTime}:00Z`.replace(/:\d{2}/, ':00'),
            reportLocation: game.venue === 'Amon G. Carter Stadium' ? 'Media Entrance' : 'Control Room',
            game: {
              id: game.gameID,
              opponent: game.opponent,
              gameDate: `${game.gameDate}T${game.gameTime}:00Z`,
              gameTime: `${game.gameDate}T${game.gameTime}:00Z`,
              venue: game.venue,
              scheduleID: game.scheduleID,
              crewListIDs: game.crewListIDs
            }
          })
        }
      }
    })
    
    return HttpResponse.json(userAssignments)
  }),

  // Availability endpoints
  http.post('/api/availability', async ({ request }) => {
    const data = await request.json()
    
    const newAvailability = {
      crewMemberID: data.crewMemberID,
      comment: data.comment || ''
    }
    
    availability.push(newAvailability)
    
    return HttpResponse.json(newAvailability)
  }),

  http.get('/api/availability/game/:gameId', ({ params }) => {
    const { gameId } = params
    const gameIdInt = parseInt(gameId)
    
    // Find all availability entries for this game
    const gameAvailability = availability
      .map(a => {
        const crewMember = crewMembers.find(cm => cm.crewMemberID === a.crewMemberID)
        if (crewMember) {
          const { password, ...sanitizedMember } = crewMember
          return {
            ...a,
            crewMember: {
              id: sanitizedMember.crewMemberID,
              firstName: sanitizedMember.firstName,
              lastName: sanitizedMember.lastName,
              email: sanitizedMember.email,
              phoneNumber: sanitizedMember.phoneNumber
            }
          }
        }
        return a
      })
    
    return HttpResponse.json(gameAvailability)
  }),

  // Schedule endpoints
  http.post('/api/schedules', async ({ request }) => {
    const data = await request.json()
    
    // Create a new schedule exactly matching the API schema
    const newSchedule = {
      scheduleID: parseInt(data.scheduleID), // Ensure it's an integer
      sport: data.sport, // Use sport directly from the form data
      season: data.season,
      gameListIDs: data.gameIds || [] // Map gameIds to gameListIDs as per YAML schema
    }
    
    // Add the new schedule to the schedules array
    schedules.push(newSchedule)
    
    // Update the scheduleID for all selected games
    if (data.gameIds && data.gameIds.length > 0) {
      data.gameIds.forEach(gameId => {
        const game = games.find(g => g.gameID === gameId)
        if (game) {
          game.scheduleID = newSchedule.scheduleID
        }
      })
    }
    
    return HttpResponse.json(newSchedule)
  }),

  http.get('/api/schedules', () => {
    return HttpResponse.json(schedules)
  }),

  http.get('/api/schedules/:id', ({ params }) => {
    const { id } = params
    const schedule = schedules.find(s => s.scheduleID === parseInt(id))
    
    if (!schedule) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(schedule)
  }),

  // Invitation validation
  http.get('/api/invites/validate/:token', ({ params }) => {
    const { token } = params
    const invite = inviteValidations.find(i => i.token === token)
    
    if (!invite || !invite.valid) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json({
      valid: true,
      message: 'Invitation is valid'
    })
  }),

  // Crew Schedule endpoints
  http.get('/api/crewSchedule/:gameID', ({ params }) => {
    const { gameID } = params
    const gameIdInt = parseInt(gameID)
    
    const game = games.find(g => g.gameID === gameIdInt)
    if (!game) {
      return new HttpResponse(null, { status: 404 })
    }
    
    // Get crew members for this game
    const crewList = game.crewListIDs.map(crewId => {
      const crewMember = crewMembers.find(cm => cm.crewMemberID === crewId)
      if (crewMember) {
        const { password, ...sanitizedMember } = crewMember
        return sanitizedMember
      }
      return null
    }).filter(Boolean)
    
    return HttpResponse.json(crewList)
  }),

  http.put('/api/crewSchedule/:gameID', async ({ request, params }) => {
    const { gameID } = params
    const gameIdInt = parseInt(gameID)
    
    const game = games.find(g => g.gameID === gameIdInt)
    if (!game) {
      return new HttpResponse(null, { status: 404 })
    }
    
    const crewList = await request.json()
    
    // Update the game's crew list with the new crew member IDs
    game.crewListIDs = crewList.map(crew => crew.crewMemberID)
    
    return new HttpResponse(null, { status: 200 })
  })
] 