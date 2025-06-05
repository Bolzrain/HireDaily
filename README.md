# HireDaily - Worker Hiring Platform

A full-stack MERN application that connects users with skilled service workers for various jobs including construction, electrical work, plumbing, carpentry, gardening, and more.

## Features

### For Users (Customers)
- Browse and search workers by skill, location, and rating
- Filter workers by hourly rate and experience
- Book workers for specific services
- View booking history and status
- Rate and review completed services
- User dashboard for managing bookings

### For Workers (Service Providers)
- Register with skills, experience, and hourly rates
- Manage availability and profile information
- View and manage incoming bookings
- Update booking status (confirmed, in-progress, completed)
- Worker dashboard for managing services

### General Features
- JWT-based authentication
- Mobile-responsive design with Bootstrap
- Input validation and error handling
- Real-time booking status updates
- Rating and review system

## Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Bootstrap 5** & **React Bootstrap** for UI
- **Axios** for API calls
- **React Hook Form** for form handling

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS** for cross-origin requests

## Project Structure

```
HireDaily/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── workerController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Worker.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── workers.js
│   │   └── bookings.js
│   ├── server.js
│   ├── package.json
│   └── config.env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Workers.jsx
│   │   │   ├── WorkerDetail.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── WorkerDashboard.jsx
│   │   │   └── BookWorker.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp config.env.example .env
```

4. Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/hiredaily?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

5. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

5. Start the frontend development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register-user` - Register a new user
- `POST /api/auth/register-worker` - Register a new worker
- `POST /api/auth/login` - Login user/worker
- `GET /api/auth/profile` - Get current user profile

### Workers
- `GET /api/workers` - Get all workers (with filtering)
- `GET /api/workers/:id` - Get worker by ID
- `GET /api/workers/skills` - Get available skills
- `PUT /api/workers/profile` - Update worker profile (worker only)
- `GET /api/workers/bookings` - Get worker's bookings (worker only)
- `PUT /api/workers/bookings/:id/status` - Update booking status (worker only)

### Users
- `GET /api/users/profile` - Get user profile (user only)
- `PUT /api/users/profile` - Update user profile (user only)

### Bookings
- `POST /api/bookings` - Create new booking (user only)
- `GET /api/bookings` - Get user's bookings (user only)
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/cancel` - Cancel booking (user only)
- `PUT /api/bookings/:id/rate` - Rate completed booking (user only)

## Database Schema

### User Model
- name, email, password, phone
- location (city, state, zipCode)
- userType: 'user'

### Worker Model
- name, email, password, phone
- skills (array of predefined skills)
- location (city, state, zipCode)
- hourlyRate, experience, description
- availability (isAvailable, availableDays, availableHours)
- rating (average, count)
- userType: 'worker'

### Booking Model
- user (ref to User), worker (ref to Worker)
- serviceType, description
- scheduledDate, scheduledTime, estimatedHours
- hourlyRate, totalCost
- address (street, city, state, zipCode)
- status (pending, confirmed, in-progress, completed, cancelled)
- rating (score, review, reviewDate)
- paymentStatus

## Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard

### Frontend (Vercel)
1. Install Vercel CLI: `npm i -g vercel`
2. In frontend directory: `vercel`
3. Follow the prompts to deploy
4. Set environment variables in Vercel dashboard

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Get connection string and add to backend environment variables

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email sudipta8534@gmail.com or create an issue in the GitHub repository. 
