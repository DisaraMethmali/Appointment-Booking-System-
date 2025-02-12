const db = require('../config/db'); // Assuming you're using some database module

// Assuming you're using some database module

const bookAppointment = async (req, res) => {
  try {
    const { date, start_time, end_time, user_name, user_email } = req.body;

    if (!date || !start_time || !end_time || !user_name || !user_email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const formattedDate = new Date(date).toISOString().split('T')[0];

    // Check if the appointment already exists in the appointments table (slot is booked)
    const [existingAppointment] = await db.query(
      'SELECT * FROM appointments WHERE date = ? AND start_time = ? AND end_time = ?',
      [formattedDate, start_time, end_time]
    );

    if (existingAppointment.length > 0) {
      return res.status(400).json({ error: 'Slot already booked' });
    }

    // Insert the appointment into the appointments table
    const [result] = await db.query(
      'INSERT INTO appointments (date, start_time, end_time, user_name, user_email) VALUES (?, ?, ?, ?, ?)',
      [formattedDate, start_time, end_time, user_name, user_email]
    );

    res.status(200).json({ message: 'Appointment booked successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Assuming you have a controller like this
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { user_email, user_name } = req.body;  // Now both user_email and user_name can be updated

  try {
    const userEmail = req.user.email; // User email from JWT

    const result = await db.query(
      'UPDATE appointments SET user_email = ?, user_name = ? WHERE id = ? AND user_email = ?',
      [user_email, user_name, id, userEmail]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found or unauthorized' });
    }

    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};


// Get all appointments for the user


// Cancel an appointment
const cancelAppointment = async (req, res) => {
  const { id } = req.params;
  const userEmail = req.user.email; // Assuming JWT authentication

  try {
    await db.query('DELETE FROM appointments WHERE id = ? AND user_email = ?', [id, userEmail]);
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
const getAppointments = async (req, res) => {
  const userEmail = req.user.email; // Extract user email from token (JWT authentication)

  try {
    // Query to fetch the appointments for the user
    const [appointments] = await db.query(
      'SELECT id, date, start_time, end_time FROM appointments WHERE user_email = ? ORDER BY date, start_time',
      [userEmail]
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


module.exports = { bookAppointment, getAppointments, cancelAppointment ,updateAppointment};
