const db = require('../config/db');

function generateTimeSlots(date) {
  const slots = [];
  const startHour = 9;
  const endHour = 17;
  const interval = 30;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const startTime = new Date(date);
      startTime.setHours(hour, minute, 0);
      const endTime = new Date(startTime.getTime() + interval * 60000);
      slots.push({
        start: startTime.toTimeString().slice(0, 5),
        end: endTime.toTimeString().slice(0, 5)
      });
    }
  }
  return slots;
}

const getSlots = async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Date required' });

  try {
    const allSlots = generateTimeSlots(date);
    const [bookedSlots] = await db.query(
      'SELECT start_time, end_time FROM appointments WHERE date = ?',
      [date]
    );

    const booked = bookedSlots.map(slot => ({
      start: slot.start_time.toString().slice(0, 5),
      end: slot.end_time.toString().slice(0, 5)
    }));

    const availableSlots = allSlots.filter(slot => 
      !booked.some(b => b.start === slot.start && b.end === slot.end)
    );

    res.json(availableSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const bookAppointment = async (req, res) => {
  const { date, start_time, end_time, user_name, user_email } = req.body;
  if (!date || !start_time || !end_time || !user_name || !user_email) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user_email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO appointments SET ?',
      { date, start_time, end_time, user_name, user_email }
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Slot booked' });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAppointments = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const [appointments] = await db.query(
      'SELECT * FROM appointments WHERE user_email = ? ORDER BY date, start_time',
      [email]
    );
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const cancelAppointment = async (req, res) => {
  const { id } = req.params;
  const { email } = req.query;

  try {
    const [appointment] = await db.query(
      'SELECT * FROM appointments WHERE id = ? AND user_email = ?',
      [id, email]
    );

    if (appointment.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await db.query('DELETE FROM appointments WHERE id = ?', [id]);
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getSlots,
  bookAppointment,
  getAppointments,
  cancelAppointment
};