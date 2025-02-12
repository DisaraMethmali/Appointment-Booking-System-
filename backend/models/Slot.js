// models/Slot.js
const db = require('../config/db'); // Assume your database connection is configured here

const Slot = {
  // Method to create a slot
  createSlot: async (date, start_time, end_time) => {
    try {
      const query = 'INSERT INTO slots (date, start_time, end_time) VALUES (?, ?, ?)';
      const [result] = await db.query(query, [date, start_time, end_time]);
      return result;
    } catch (error) {
      throw new Error('Error creating slot');
    }
  },

  // Method to get all slots for a particular date
  getSlotsByDate: async (date) => {
    try {
      const query = 'SELECT * FROM slots WHERE date = ?';
      const [slots] = await db.query(query, [date]);
      return slots;
    } catch (error) {
      throw new Error('Error fetching slots');
    }
  }
};

module.exports = Slot;
