import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  TextField,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AvailableSlots.css"; // Custom styles

export default function AvailableSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:5000/api/slotss");
        const formattedSlots = response.data.map((slot) => ({
          ...slot,
          booked: slot.booked === 1,
        }));
        setSlots(formattedSlots);
      } catch (error) {
        setError(error.response?.data?.error || "Failed to load slots");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const bookSlot = async () => {
    if (!name || !email) {
      toast.error("Please enter your name and email");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/appointment",
        {
          date: selectedSlot.date.split("T")[0],
          start_time: selectedSlot.start_time,
          end_time: selectedSlot.end_time,
          user_name: name,
          user_email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot.id === selectedSlot.id ? { ...slot, booked: true } : slot
        )
      );

      setSuccessMessage("Booking successful!");
      setShowForm(false);
      toast.success("Appointment booked successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Booking failed");
    }
  };

  return (
    <Box className="container">
      <Typography variant="h4" className="header-title">
        Available Appointments
      </Typography>

      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}

      {slots.length > 0 ? (
        <Box sx={{ overflowX: "auto", mt: 4 }}>
          <table className="appointment-table">
            <thead>
              <tr>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot.id} className={slot.booked ? "booked-slot" : ""}>
                  <td>{slot.start_time}</td>
                  <td>{slot.end_time}</td>
                  <td>{new Date(slot.date).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="contained"
                      disabled={slot.booked}
                      className={slot.booked ? "booked-btn" : "book-btn"}
                      onClick={() => {
                        if (!slot.booked) {
                          setSelectedSlot(slot);
                          setShowForm(true);
                        } else {
                          toast.error("This slot is already booked!");
                        }
                      }}
                    >
                      {slot.booked ? "Booked" : "Book Slot"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      ) : (
        !loading && <p className="no-slots">No available slots</p>
      )}

      {showForm && selectedSlot && (
        <Dialog open={showForm} onClose={() => setShowForm(false)}>
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
            Book Appointment
          </DialogTitle>
          <DialogContent sx={{ width: 450 }}>
            <Typography sx={{ mb: 1 }}>Name</Typography>
            <TextField
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="medium"
              sx={{ mb: 2 }}
            />
            <Typography sx={{ mb: 1 }}>Email</Typography>
            <TextField
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="medium"
              sx={{ mb: 2 }}
            />
            <Typography sx={{ mb: 1 }}>Start Time</Typography>
            <TextField fullWidth value={selectedSlot.start_time} disabled size="medium" sx={{ mb: 2 }} />
            <Typography sx={{ mb: 1 }}>End Time</Typography>
            <TextField fullWidth value={selectedSlot.end_time} disabled size="medium" sx={{ mb: 2 }} />
            <Typography sx={{ mb: 1 }}>Date</Typography>
            <TextField fullWidth value={selectedSlot.date} disabled size="medium" sx={{ mb: 2 }} />
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
            <Button onClick={() => setShowForm(false)} sx={{ bgcolor: "red", color: "white", textTransform: "none" }}>
              Cancel
            </Button>
            <Button onClick={bookSlot} sx={{ bgcolor: "green", color: "white", textTransform: "none" }}>
              Confirm Booking
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <ToastContainer />
    </Box>
  );
}

