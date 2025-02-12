import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Modal, TextField } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // for the default styling


export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const userEmailFromToken = user?.email;

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/my-appointments', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError(error.response?.data?.error || 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    if (userEmailFromToken) fetchAppointments();
  }, [userEmailFromToken]);

  const handleOpen = (apptId, email) => {
    setAppointmentId(apptId);
    setUserEmail(email);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleUpdateUserName = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/appointment/${appointmentId}`,
        { user_name: userEmail }, // Update only the user_name
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('User name updated successfully!');
      setOpen(false);
      setUserEmail(''); // Clear input after update
      setAppointmentId(null); // Reset appointment ID
      fetchAppointments(); // Refetch appointments after update
    } catch (error) {
      
      setError(error.response?.data?.error );
    }
  };
  

  const cancelAppointment = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/appointment/${id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Appointment canceled successfully!');
      // Remove the canceled appointment from the state directly
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.id !== id)
      );
    } catch (error) {
      toast.error('Error canceling appointment');
      console.error('Error cancelling appointment:', error);
      setError(error.response?.data?.error || 'Failed to cancel appointment');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ backgroundColor: '#1A237E', p: 2, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
          My Appointments
        </Typography>
      </Box>

      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {appointments.length > 0 ? (
        <TableContainer sx={{ mt: 4, backgroundColor: 'white', borderRadius: 2, boxShadow: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1A237E' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Start Time</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>End Time</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell>{new Date(appt.date).toLocaleDateString()}</TableCell>
                  <TableCell>{appt.start_time}</TableCell>
                  <TableCell>{appt.end_time}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpen(appt.id, appt.user_email)} color="primary">
                      Update 
                    </Button>
                    <Button onClick={() => cancelAppointment(appt.id)} color="secondary">
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        !loading && <Typography variant="body1" sx={{ mt: 2, color: '#555' }}>No booked appointments</Typography>
      )}

      {/* Modal for updating email */}
      <Modal open={open} onClose={handleClose}>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: 3,
    borderRadius: 2,
    boxShadow: 3
  }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Update Appointment</Typography>

    {/* Display date and time as non-editable */}
    <TextField
      label="Date"
      value={new Date(appointments.find(appt => appt.id === appointmentId)?.date).toLocaleDateString()}
      fullWidth
      disabled
      sx={{ mb: 2 }}
    />
    <TextField
      label="Start Time"
      value={appointments.find(appt => appt.id === appointmentId)?.start_time}
      fullWidth
      disabled
      sx={{ mb: 2 }}
    />
    <TextField
      label="End Time"
      value={appointments.find(appt => appt.id === appointmentId)?.end_time}
      fullWidth
      disabled
      sx={{ mb: 2 }}
    />

    {/* Editable user_name field */}
    <TextField
      label="User Name"
      value={userEmail} // Bind to userEmail for updating user name
      onChange={(e) => setUserEmail(e.target.value)} // Update userEmail state
      fullWidth
      sx={{ mb: 2 }}
    />

    {/* Display user_email field as non-editable */}
    <TextField
      label="Email"
      value={appointments.find(appt => appt.id === appointmentId)?.user_email} // Default to the existing email
      fullWidth
      disabled
      sx={{ mb: 2 }}
    />

    <Button onClick={handleUpdateUserName} variant="contained" color="primary" fullWidth>
      Update Appointment
    </Button>
  </Box>
</Modal>




      {/* Toast container */}
      <ToastContainer />
    </Box>
  );
}

