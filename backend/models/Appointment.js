// models/Appointment.js
const db = require('../config/db'); // Assume your database connection is configured here

const Appointment = {
  // Method to book an appointment
  bookAppointment: async (date, start_time, end_time, user_name, user_email) => {
    try {
      const query = 'INSERT INTO appointments (date, start_time, end_time, user_name, user_email) VALUES (?, ?, ?, ?, ?)';
      const [result] = await db.query(query, [date, start_time, end_time, user_name, user_email]);
      return result;
    } catch (error) {
      throw new Error('Error booking appointment');
    }
  },

  // Method to get all appointments by email
  getAppointmentsByUserEmail: async (user_email) => {
    try {
      const query = 'SELECT * FROM appointments WHERE user_email = ? ORDER BY date, start_time';
      const [appointments] = await db.query(query, [user_email]);
      return appointments;
    } catch (error) {
      throw new Error('Error fetching appointments');
    }
  }
};

module.exports = Appointment;
