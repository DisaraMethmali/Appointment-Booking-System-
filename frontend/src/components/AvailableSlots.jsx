import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AvailableSlots() {
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const navigate = useNavigate();

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/slots?date=${date}`);
      setSlots(res.data);
    } catch (err) {
      alert('Error fetching slots');
    }
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchSlots}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {slots.map((slot, i) => (
          <button
            key={i}
            onClick={() => navigate('/book', { state: { slot, date } })}
            className="bg-green-100 p-4 rounded hover:bg-green-200"
          >
            {slot.start} - {slot.end}
          </button>
        ))}
      </div>
    </div>
  );
}