# FrogCrew Frontend

This is the frontend application for FrogCrew, a crew management system for TCU Athletics.

## Demo Deployment

This application uses Mock Service Worker (MSW) to simulate API responses for demonstration purposes. The application is configured to work with MSW in both development and production environments.

### Deployment to Netlify

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to [Netlify](https://www.netlify.com/)
3. Click "New site from Git"
4. Select your repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Click "Deploy site"

### Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Features

- User authentication and authorization
- Game management
- Crew member management
- Availability tracking
- Schedule management

## Technologies Used

- React
- React Router
- Mock Service Worker (MSW)
- Tailwind CSS 