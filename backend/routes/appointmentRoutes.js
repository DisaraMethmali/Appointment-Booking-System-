const express = require('express');
const router = express.Router();
const {
  getSlots,
  bookAppointment,
  getAppointments,
  cancelAppointment
} = require('../controllers/appointmentController');

router.get('/slots', getSlots);
router.post('/appointments', bookAppointment);
router.get('/appointments', getAppointments);
router.delete('/appointments/:id', cancelAppointment);

module.exports = router;