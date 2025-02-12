import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, CircularProgress, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AvailableSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [bookedSlots, setBookedSlots] = useState(() => JSON.parse(localStorage.getItem('bookedSlots')) || []);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('http://localhost:5000/api/slotss');
        const formattedSlots = response.data.map(slot => ({
          ...slot,
          booked: slot.booked === 1, // Convert 1 to true, 0 to false
        }));
        setSlots(formattedSlots);
      } catch (error) {
        console.error('Error fetching slots:', error);
        setError(error.response?.data?.error || 'Failed to load slots');
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const bookSlot = async () => {
    if (!name || !email) {
      alert('Please fill in your name and email');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Call the backend to book the appointment
      const response = await axios.post(
        'http://localhost:5000/api/appointment',
        {
          date: selectedSlot.date.split('T')[0],
          start_time: selectedSlot.start_time,
          end_time: selectedSlot.end_time,
          user_name: name,
          user_email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setBookedSlots(prev => {
        const updatedSlots = [...prev, selectedSlot.id];
        localStorage.setItem('bookedSlots', JSON.stringify(updatedSlots));
        return updatedSlots;
      });

      // After booking, update the slot status in the state
      setSlots(prevSlots =>
        prevSlots.map(slot =>
          slot.id === selectedSlot.id ? { ...slot, booked: true } : slot
        )
      );

      setSuccessMessage('Booking successful!');
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Booking failed');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ backgroundColor: '#1A237E', p: 1, borderRadius: 2, boxShadow: 3 }}>
        <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>Available Appointments</h2>
      </Box>

      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}

      {slots.length > 0 ? (
        <Box sx={{ overflowX: 'auto', mt: 4 }}>
          <table style={{ width: '100%', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#1A237E', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Start Time</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>End Time</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot.id} style={{ borderTop: '1px solid #ddd', backgroundColor: slot.booked ? '#C8E6C9' : '' }}>
                  <td style={{ padding: '12px', color: '#333' }}>{slot.start_time}</td>
                  <td style={{ padding: '12px', color: '#333' }}>{slot.end_time}</td>
                  <td style={{ padding: '12px', color: '#333' }}>{new Date(slot.date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px', color: '#333' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={slot.booked}
                      sx={{
                        backgroundColor: slot.booked ? '#388E3C' : '#1976d2',
                        '&:hover': {
                          backgroundColor: slot.booked ? '#2c6f3e' : '#1565c0',
                        },
                      }}
                      onClick={() => {
                        if (!slot.booked) {
                          setSelectedSlot(slot);
                          setShowForm(true);
                        } else {
                          toast.error('This slot is already booked!');
                        }
                      }}
                    >
                      {slot.booked ? 'Booked' : 'Book Slot'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      ) : (
        !loading && <p style={{ textAlign: 'center', color: '#555' }}>No available slots</p>
      )}

      {showForm && selectedSlot && (
        <Dialog open={showForm} onClose={() => setShowForm(false)}>
          <DialogTitle sx={{ backgroundColor: '#1A237E', color: 'white' }}>Book Slot</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Start Time"
              fullWidth
              variant="outlined"
              value={selectedSlot.start_time}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              label="End Time"
              fullWidth
              variant="outlined"
              value={selectedSlot.end_time}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              label="Date"
              fullWidth
              variant="outlined"
              value={selectedSlot.date}
              disabled
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowForm(false)} color="secondary">Cancel</Button>
            <Button onClick={bookSlot} color="primary">Confirm Booking</Button>
          </DialogActions>
        </Dialog>
      )}

      <ToastContainer />
    </Box>
  );
}
