import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toastify

// Create a custom theme with a white background and blue headings for the table
const theme = createTheme({
  palette: {
    mode: "light", // Light mode for the general UI
    primary: {
      main: "#003366", // Dark blue color for primary elements like buttons
    },
    secondary: {
      main: "#FF7043", // Orange color for secondary elements (like cancel button)
    },
    background: {
      default: "#ffffff", // White background for the general layout
      paper: "#f5f5f5", // Slightly off-white for paper components
    },
    text: {
      primary: "#000000", // Black text for better readability
      secondary: "#757575", // Light grey for secondary text
    },
  },
});

const AdminPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // To control the dialog visibility

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/admin/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
      } catch (error) {
        toast.error("Error fetching appointments: " + (error.response?.data || error.message));
      }
    };
    fetchAppointments();
  }, []);

  const createSlot = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required"); // Error toast if no token found
        return;
      }
  
      const response = await axios.post(
        "http://localhost:5000/api/slots",
        { date, start_time: startTime, end_time: endTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      toast.success("Slot created successfully!"); // Success toast on successful slot creation
      setAppointments([...appointments, response.data]);
      setOpenDialog(false); // Close dialog after successful slot creation
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create slot."); // Error toast on failure
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <div>
        <h2>Admin Panel</h2>

        {/* Slot Creation Button with rounded corners and simple letters */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          sx={{
            borderRadius: "10px", // Rounded corners
            textTransform: "none", // No uppercase transformation
            padding: "8px 16px", // Adjust button padding
          }}
        >
          Create Slot
        </Button>

        {/* Slot Creation Popup */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Create a Slot</DialogTitle>
          <DialogContent>
            <TextField
              label="Date"
              type="date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              sx={{ mb: 2 }}
              InputLabelProps={{
                shrink: true, // Ensures the label stays on top of the input field
              }}
            />
            <TextField
              label="Start Time"
              type="time"
              fullWidth
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              sx={{ mb: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="End Time"
              type="time"
              fullWidth
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              sx={{ mb: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={createSlot} color="primary">
              Create Slot
            </Button>
          </DialogActions>
        </Dialog>

        {/* Table for Available Appointments */}
        <h3>Available Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments available.</p>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="appointments table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: "#003366", color: "#FFFFFF" }}>Date</TableCell>
                  <TableCell sx={{ backgroundColor: "#003366", color: "#FFFFFF" }}>Start Time</TableCell>
                  <TableCell sx={{ backgroundColor: "#003366", color: "#FFFFFF" }}>End Time</TableCell>
                  <TableCell sx={{ backgroundColor: "#003366", color: "#FFFFFF" }}>Customer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment, index) => (
                  <TableRow key={index}>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.start_time}</TableCell>
                    <TableCell>{appointment.end_time}</TableCell>
                    <TableCell>{appointment.user_name || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      {/* ToastContainer to display toast messages */}
      <ToastContainer />
    </ThemeProvider>
  );
};

export default AdminPanel;



