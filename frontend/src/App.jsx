import React from 'react'; // Add this import
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthWrapper, AdminWrapper } from './components/Shared/AuthWrapper';
import Navbar from './components/Shared/Navbar';
import AvailableSlots from './components/Appointments/AvailableSlots';
import BookAppointment from './components/Appointments/BookAppointment';
import AppointmentsList from './components/Appointments/AppointmentsList';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import AdminPanel from './components/Admin/AdminPanel';
import MyAppointments from './components/Appointments/MyAppointments';
function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<AvailableSlots />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Wrap protected routes in Route element */}
          <Route element={<AuthWrapper />}>
            <Route path="/book" element={<BookAppointment />} />
            <Route path="/appointments" element={<AppointmentsList />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminWrapper />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;