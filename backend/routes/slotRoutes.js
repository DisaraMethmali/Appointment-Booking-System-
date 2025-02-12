// routes/slotRoutes.js
const express = require('express');
const { createSlot, getSlotsByDate,getAllSlots } = require('../controllers/SlotController');
const router = express.Router();

// Create a new slot
router.post('/slots', createSlot);

// Get slots by date
router.get('/slots', getSlotsByDate);
// Get slots by date
router.get('/slotss', getAllSlots);
// Book an appointment


module.exports = router;
