# Planner Application

A full-stack task management application with React frontend and Node.js/Express backend.

## Features
- User authentication
- Task management
- Responsive design

## Deployment

### Backend (Render)
1. Push this repository to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New" and select "Web Service"
4. Connect your GitHub repository
5. Select the repository
6. Configure the service:
   - Name: `planner-backend`
   - Region: Choose the one closest to you
   - Branch: `main`
   - Build Command: `cd planner-app/server && npm install`
   - Start Command: `cd planner-app/server && npm start`
7. Add environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `JWT_SECRET`: Generate a secure random string
8. Click "Create Web Service"

### Frontend (Netlify)
1. Go to [Netlify](https://www.netlify.com/)
2. Click "Add new site" > "Import an existing project"
3. Connect to your GitHub repository
4. Configure the build settings:
   - Base directory: `planner-app/client`
   - Build command: `npm run build`
   - Publish directory: `planner-app/client/build`
5. Add environment variable:
   - `REACT_APP_API_URL`: Your Render backend URL (e.g., `https://planner-backend.onrender.com`)
6. Click "Deploy site"

## Local Development

### Backend
1. Navigate to `planner-app/server`
2. Run `npm install`
3. Create a `.env` file with:
   ```
   PORT=5000
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```
4. Run `npm run dev`

### Frontend
1. Navigate to `planner-app/client`
2. Run `npm install`
3. Create a `.env` file with:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
4. Run `npm start`

## Environment Variables

### Backend
- `PORT`: Port to run the server on (default: 5000)
- `JWT_SECRET`: Secret key for JWT token signing
- `NODE_ENV`: Environment (development/production)

### Frontend
- `REACT_APP_API_URL`: URL of the backend API
