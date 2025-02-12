import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
export default function BookAppointment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    if (!state?.slot) navigate('/');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/appointments', {
        date: state.date,
        start_time: state.slot.start,
        end_time: state.slot.end,
        user_name: form.name,
        user_email: form.email
      });
      navigate('/appointments');
    } catch (err) {
      alert(err.response?.data?.error || 'Error booking');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Book Slot</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}