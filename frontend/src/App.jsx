import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Workers from './pages/Workers';
import WorkerDetail from './pages/WorkerDetail';
import UserDashboard from './pages/UserDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import BookWorker from './pages/BookWorker';
import PaymentSuccess from './pages/PaymentSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <main className="container-fluid px-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/workers/:id" element={<WorkerDetail />} />
            <Route path="/book/:workerId" element={
              <ProtectedRoute userType="user">
                <BookWorker />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute userType="user">
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/payment/success" element={
              <ProtectedRoute userType="user">
                <PaymentSuccess />
              </ProtectedRoute>
            } />
            <Route path="/worker-dashboard" element={
              <ProtectedRoute userType="worker">
                <WorkerDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
