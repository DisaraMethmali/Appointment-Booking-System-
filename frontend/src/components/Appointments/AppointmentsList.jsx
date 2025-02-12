import React, { useState } from 'react';
import axios from 'axios';

export default function AppointmentsList() {
  const [email, setEmail] = useState('');
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/appointments?email=${email}`);
      setAppointments(res.data);
    } catch (err) {
      alert('Error fetching appointments');
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}?email=${email}`);
      setAppointments(appointments.filter((appt) => appt.id !== id));
    } catch (err) {
      alert('Error cancelling appointment');
    }
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button onClick={fetchAppointments} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Search
        </button>
      </div>
      <div className="space-y-4">
        {appointments.map((appt) => (
          <div key={appt.id} className="bg-gray-100 p-4 rounded">
            <p>Date: {appt.date}</p>
            <p>Time: {appt.start_time} - {appt.end_time}</p>
            <button
              onClick={() => cancelAppointment(appt.id)}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
