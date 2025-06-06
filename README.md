
# 🏗️ HireDaily - Worker Hiring Platform

> **A modern full-stack MERN application that seamlessly connects customers with skilled service workers for various jobs including construction, electrical work, plumbing, carpentry, gardening, and more.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19.1-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/atlas)

## 🌟 Features

### 👨‍💼 For Customers
- 🔍 **Smart Search & Filter** - Browse workers by skill, location, rating, and hourly rate
- 📅 **Easy Booking** - Book workers for specific services with flexible scheduling
- 📊 **Dashboard Management** - View booking history, status tracking, and manage appointments
- ⭐ **Rating & Reviews** - Rate and review completed services to help other users
- 🔒 **Secure Authentication** - JWT-based secure login and registration
- 📱 **Mobile Responsive** - Beautiful UI that works on all devices

### 👷‍♂️ For Workers (Service Providers)
- 🛠️ **Profile Management** - Register with skills, experience, hourly rates, and availability
- 📋 **Booking Management** - View and manage incoming bookings with status updates
- 🎯 **Service Tracking** - Update booking status (confirmed, in-progress, completed)
- 💰 **Earnings Overview** - Track completed jobs and earnings
- ⚡ **Real-time Updates** - Instant notifications for new bookings and status changes

### 🚀 General Features
- 🔐 **JWT Authentication** with secure password hashing
- 🎨 **Modern UI/UX** with Bootstrap 5 and responsive design
- ✅ **Input Validation** and comprehensive error handling
- 🔄 **Real-time Updates** for booking status changes
- 💳 **Payment Integration** with Stripe support
- 📱 **Progressive Web App** capabilities

## 🛠️ Tech Stack

### Frontend
- **⚛️ React 19** with Vite for lightning-fast development
- **🧭 React Router 7.6** for seamless navigation
- **🎨 Bootstrap 5** & **React Bootstrap 2.10** for beautiful UI
- **📡 Axios 1.9** for efficient API communication
- **📝 React Hook Form 7.56** for optimized form handling
- **🎨 Styled-jsx 5.1** for component-level styling

### Backend
- **🟢 Node.js** with **Express.js 5.1** for robust server architecture
- **🍃 MongoDB** with **Mongoose 8.15** ODM for data management
- **🔐 JWT 9.0** for secure authentication
- **🔒 bcryptjs 3.0** for password security
- **✅ express-validator 7.2** for input validation
- **🌐 CORS 2.8** for cross-origin resource sharing
- **💳 Stripe 18.2** for payment processing

## 📁 Project Structure

```
HireDaily/
├── 🎯 backend/                    # Server-side application
│   ├── 📁 config/
│   │   └── database.js           # MongoDB connection setup
│   ├── 📁 controllers/           # Business logic handlers
│   │   ├── authController.js     # Authentication operations
│   │   ├── userController.js     # User management
│   │   ├── workerController.js   # Worker operations
│   │   └── bookingController.js  # Booking management
│   ├── 📁 middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── 📁 models/               # MongoDB schemas
│   │   ├── User.js              # Customer data model
│   │   ├── Worker.js            # Service provider model
│   │   └── Booking.js           # Booking relationship model
│   ├── 📁 routes/               # API endpoint definitions
│   │   ├── auth.js              # Authentication routes
│   │   ├── users.js             # User routes
│   │   ├── workers.js           # Worker routes
│   │   └── bookings.js          # Booking routes
│   ├── server.js                # Express server entry point
│   └── package.json             # Backend dependencies
├── 🎨 frontend/                  # Client-side application
│   ├── 📁 public/
│   │   ├── Favicon.png          # Application favicon
│   │   └── index.html           # Main HTML template
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI components
│   │   │   ├── Navbar.jsx       # Navigation component
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── 📁 context/          # React Context providers
│   │   │   └── AuthContext.jsx  # Authentication state
│   │   ├── 📁 pages/            # Application pages/views
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Login.jsx        # User login
│   │   │   ├── Register.jsx     # User registration
│   │   │   ├── Workers.jsx      # Worker directory
│   │   │   ├── WorkerDetail.jsx # Worker profile view
│   │   │   ├── UserDashboard.jsx # Customer dashboard
│   │   │   ├── WorkerDashboard.jsx # Worker dashboard
│   │   │   └── BookWorker.jsx   # Booking interface
│   │   ├── 📁 services/         # API service functions
│   │   │   └── api.js           # API client configuration
│   │   ├── 📁 utils/            # Utility functions
│   │   │   └── helpers.js       # Common helper functions
│   │   ├── App.jsx              # Main application component
│   │   ├── App.css              # Global styles
│   │   ├── index.css            # Base styles
│   │   └── main.jsx             # React entry point
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js           # Vite configuration
├── README.md                     # This documentation file
└── .gitignore                   # Git ignore rules
```

## 🚀 Quick Start

### 📋 Prerequisites
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB Atlas** account or local MongoDB - [Sign up](https://www.mongodb.com/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Stripe** account for payments - [Sign up](https://stripe.com/)

### 🔧 Installation & Setup

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/hiredaily.git
cd hiredaily
```

#### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure your `.env` file:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/hiredaily?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

```bash
# Start the backend server
npm run dev          # Development mode with nodemon
# or
npm start           # Production mode
```

✅ **Backend running on:** `http://localhost:5000`

#### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure your frontend `.env` file:**
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

```bash
# Start the frontend development server
npm run dev
```

✅ **Frontend running on:** `http://localhost:5173`

## 🌐 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/api/auth/register-user` | Register new customer | Public |
| `POST` | `/api/auth/register-worker` | Register new worker | Public |
| `POST` | `/api/auth/login` | Login user/worker | Public |
| `GET` | `/api/auth/profile` | Get current user profile | Private |

### 👷‍♂️ Workers
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/api/workers` | Get all workers (with filters) | Public |
| `GET` | `/api/workers/:id` | Get worker details | Public |
| `GET` | `/api/workers/skills` | Get available skills | Public |
| `PUT` | `/api/workers/profile` | Update worker profile | Worker Only |
| `GET` | `/api/workers/bookings` | Get worker's bookings | Worker Only |
| `PUT` | `/api/workers/bookings/:id/status` | Update booking status | Worker Only |

### 👨‍💼 Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/api/users/profile` | Get user profile | User Only |
| `PUT` | `/api/users/profile` | Update user profile | User Only |

### 📅 Bookings
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/api/bookings` | Create new booking | User Only |
| `GET` | `/api/bookings` | Get user's bookings | User Only |
| `GET` | `/api/bookings/:id` | Get booking details | Owner Only |
| `PUT` | `/api/bookings/:id/cancel` | Cancel booking | User Only |
| `PUT` | `/api/bookings/:id/rate` | Rate completed service | User Only |

## 🗄️ Database Schema

### 👤 User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  location: {
    city: String,
    state: String,
    zipCode: String
  },
  userType: 'user',
  createdAt: Date,
  updatedAt: Date
}
```

### 👷 Worker Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  skills: [String],
  location: {
    city: String,
    state: String,
    zipCode: String
  },
  hourlyRate: Number,
  experience: Number,
  description: String,
  availability: {
    isAvailable: Boolean,
    availableDays: [String],
    availableHours: String
  },
  rating: {
    average: Number,
    count: Number
  },
  userType: 'worker',
  createdAt: Date,
  updatedAt: Date
}
```

### 📋 Booking Model
```javascript
{
  user: ObjectId (ref: User),
  worker: ObjectId (ref: Worker),
  serviceType: String,
  description: String,
  scheduledDate: Date,
  scheduledTime: String,
  estimatedHours: Number,
  hourlyRate: Number,
  totalCost: Number,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  status: String (pending/confirmed/in-progress/completed/cancelled),
  rating: {
    score: Number,
    review: String,
    reviewDate: Date
  },
  paymentStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### 🌐 Backend Deployment (Render)

1. **Create a Render Account**: [render.com](https://render.com)
2. **Create Web Service**:
   - Connect your GitHub repository
   - Select backend directory
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. **Environment Variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   STRIPE_SECRET_KEY=your_production_stripe_key
   ```

### 🎨 Frontend Deployment (Vercel)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel
   ```

3. **Environment Variables** (Vercel Dashboard):
   ```
   VITE_API_URL=https://your-backend-url.com
   VITE_STRIPE_PUBLISHABLE_KEY=your_production_stripe_publishable_key
   ```

### 🍃 Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**: [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**: Choose free tier for development
3. **Database Access**: Create user with read/write permissions
4. **Network Access**: Add IP addresses (0.0.0.0/0 for development)
5. **Get Connection String**: Replace in your environment variables

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### 📝 Contribution Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📸 Screenshots

> Add screenshots of your application here to showcase the UI/UX

## 🆘 Support

- 📧 **Email**: support@hiredaily.com
- 💬 **Discord**: [Join our community](https://discord.gg/hiredaily)
- 📋 **Issues**: [GitHub Issues](https://github.com/yourusername/hiredaily/issues)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- **React Team** for the amazing framework
- **MongoDB** for the robust database solution
- **Bootstrap** for the beautiful UI components
- **Stripe** for secure payment processing
- **All Contributors** who helped build this platform

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by the HireDaily Team

[🌐 Website](https://hiredaily.com) • [📧 Contact](mailto:contact@hiredaily.com) • [🐦 Twitter](https://twitter.com/hiredaily)

</div>
