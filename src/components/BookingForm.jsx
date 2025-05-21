import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingForm({ onClose, title }) {
  const [form, setForm] = useState({
    name: '',
    pax: '',
    time: '',
    phone: '',
    email: '',
    request: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_CUSTOMER_API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, restaurant: title }),
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to send booking');
      }
    } catch (error) {
      alert('Failed to send booking');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-xl shadow-xl max-w-lg mx-auto border border-gray-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#826845] tracking-wide">Book a Table</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border border-gray-300 rounded-md p-3 font-light text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a28e68] placeholder-gray-400" required />
          <input name="pax" value={form.pax} onChange={handleChange} placeholder="Number of Guests" type="number" className="w-full border border-gray-300 rounded-md p-3 font-light text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a28e68] placeholder-gray-400" required />
          <input name="time" type="time" value={form.time} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 font-light text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a28e68] placeholder-gray-400" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="w-full border border-gray-300 rounded-md p-3 font-light text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a28e68] placeholder-gray-400" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="w-full border border-gray-300 rounded-md p-3 font-light text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a28e68] placeholder-gray-400" required />
          <textarea name="request" value={form.request} onChange={handleChange} placeholder="Specific Request" className="w-full border border-gray-300 rounded-md p-3 font-light text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a28e68] placeholder-gray-400" rows="3" />
          <div className="flex justify-between items-center mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-400 text-gray-600 hover:bg-gray-100 rounded">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-[#826845] text-white rounded hover:bg-[#6f5f39] disabled:opacity-50 transition" disabled={loading}>
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </form>
        {success && (
          <p className="text-green-600 text-center mt-6 text-sm">Booking sent successfully!</p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}