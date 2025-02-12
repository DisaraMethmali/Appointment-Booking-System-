const Slot = require('../models/slot');
const Appointment = require('../models/Appointment');
const db = require('../config/db'); // Assuming you're using a database connection module like mysql2 or pg

// Create a new slot
const createSlot = async (req, res) => {
  const { date, start_time, end_time } = req.body;

  if (!date || !start_time || !end_time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await Slot.createSlot(date, start_time, end_time);
    res.status(201).json({ message: 'Slot created successfully', slotId: result.insertId });
  } catch (error) {
    console.error('Error creating slot:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
// Get all available slots (no date filter required)
const getAllSlots = async (req, res) => {
    try {
      const [availableSlots] = await db.query(`
        SELECT * 
        FROM slots 
      `);
  
      if (availableSlots.length === 0) {
        return res.status(404).json({ error: 'No available slots' });
      }
  
      res.status(200).json(availableSlots);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Server error: Failed to fetch slots', details: error.message });
    }
  };
  
// Get slots by date
// Get slots by date
const getSlotsByDate = async (req, res) => {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    try {
      console.log('Fetching available slots for date:', date); // Debugging log
      
      const [availableSlots] = await db.query(`
        SELECT s.* 
        FROM slots s
        LEFT JOIN appointments a 
          ON s.date = a.date 
          AND s.start_time = a.start_time 
          AND s.end_time = a.end_time
        WHERE s.date = ? 
          AND a.id IS NULL
      `, [date]);

      if (availableSlots.length === 0) {
        console.log('No available slots for date:', date); // Log when no slots are found
        return res.status(404).json({ error: 'No available slots for this date' });
      }

      console.log('Available slots found:', availableSlots); // Log the available slots
      res.status(200).json(availableSlots);
      
    } catch (error) {
      console.error('Database error:', error); // Log the error for debugging

      // Return a more specific error message for debugging (don't expose sensitive info)
      res.status(500).json({ 
        error: 'Server error: Failed to fetch slots',
        details: error.message || 'An unknown error occurred'
      });
    }
};


  



module.exports = { createSlot, getSlotsByDate,getAllSlots};


