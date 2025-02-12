const db = require('../config/db');


const getAllAppointments = async (req, res) => {
  try {
    // Check if the user is an admin (based on JWT token or role)
    const isAdmin = req.user?.role === 'admin'; // Assuming `role` is part of the JWT payload

    

    // Query to fetch all appointments
    const [appointments] = await db.query(
      'SELECT id, date, start_time, end_time, user_name, user_email, created_at FROM appointments ORDER BY date, start_time'
    );

    // Check if there are appointments
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
const blockSlot = async (req, res) => {
  const { date, start_time, end_time } = req.body;

  try {
    await db.query(
      'INSERT INTO blocked_slots (date, start_time, end_time) VALUES (?, ?, ?)',
      [date, start_time, end_time]
    );
    res.status(201).json({ message: 'Slot blocked successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Slot already blocked' });
  }
};

module.exports = { getAllAppointments, blockSlot };
