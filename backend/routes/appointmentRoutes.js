const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/authMiddleware');
const { bookAppointment, getAppointments, cancelAppointment, updateAppointment } = require('../controllers/appointmentController');

// Route for booking, viewing, and canceling appointments
router.post('/appointment', auth, bookAppointment);
router.delete('/appointment/:id', auth, cancelAppointment);
router.get('/my-appointments', auth, getAppointments);
router.put('/appointment/:id', auth, updateAppointment);
module.exports = router;


