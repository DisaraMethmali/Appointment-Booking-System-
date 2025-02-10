import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AvailableSlots from './components/AvailableSlots';
import BookAppointment from './components/BookAppointment';
import AppointmentsList from './components/AppointmentsList';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<AvailableSlots />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/appointments" element={<AppointmentsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;