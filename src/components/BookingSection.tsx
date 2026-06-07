import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Phone, Mail, Clock, MessageSquare, GlassWater, ShieldCheck, Sparkles } from 'lucide-react';
import { BookingDetails } from '../types';

export default function BookingSection() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<BookingDetails>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '18:00',
    guests: 2,
    requestType: 'table',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value, 10) || 2 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <section id="bookings" className="py-24 bg-gradient-to-b from-[#FAF7F2] to-[#EFECE5] text-[#1e1b18] relative">
      <div className="absolute inset-0 opacity-4 bg-jaali pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Column 1 (col-span-5): Contact Information and Placeholder */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full lg:sticky lg:top-10">
            <div>
              <span className="text-amber-800 font-mono tracking-widest text-xs uppercase block">✧ Traditional Hospitality ✧</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-amber-950 mt-1 mb-6">Connect with Aangan</h2>
              
              <p className="text-stone-600 text-sm md:text-base leading-relaxed mb-8">
                Whether you are organizing a majestic wedding catering feast, planning a massive sweet box corporate gift, or simply securing a dining table for a Sunday family chat lunch, our team is at your command.
              </p>

              {/* High-visibility official order hotline and catering coordinates */}
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 mb-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-950 p-2.5 rounded-xl text-amber-100">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-amber-950 text-base">Direct Hotline & Catering</h4>
                    <p className="text-xs text-stone-600 leading-relaxed mt-1">
                      Call us to customize bulk sweet gift boxes, inquire about live catering services, or arrange custom pickups at Hamilton, OH.
                    </p>
                    <div className="mt-4 flex flex-col gap-2.5">
                      <a href="tel:5138078703" className="inline-flex items-center gap-2.5 bg-white px-4 py-2 rounded-xl border border-stone-200 text-xs font-mono text-amber-950 font-bold hover:border-amber-600 transition shadow-xs">
                        <span className="text-amber-700">📞 Phone:</span>
                        <span>(513) 807-8703</span>
                      </a>
                      <a href="mailto:orders@aangan-sweets.com" className="inline-flex items-center gap-2.5 bg-white px-4 py-2 rounded-xl border border-stone-200 text-xs font-mono text-amber-950 hover:border-amber-600 transition shadow-xs">
                        <span className="text-amber-700">✉ Email:</span>
                        <span className="font-medium">orders@aangan-sweets.com</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm">
                <h4 className="font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-800" />
                  <span>Store Hours (Hamilton, OH)</span>
                </h4>
                <div className="flex flex-col gap-2.5 text-xs text-stone-600 font-mono">
                  <div className="flex justify-between border-b border-stone-100 pb-2">
                    <span>Tuesday - Sunday</span>
                    <span className="font-semibold text-stone-800">11:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monday</span>
                    <span className="font-semibold text-amber-800">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 (col-span-7): The Interactive Reservation-Preorder Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-10 rounded-3xl border border-stone-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none"></div>

            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form
                  key="booking-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="border-b border-stone-150 pb-4 mb-4">
                    <h3 className="text-2xl font-serif font-bold text-amber-950">Inquire or Plan Event</h3>
                    <p className="text-xs text-stone-500 font-mono mt-1">✦ Choose table reservation or customized outdoor catering request</p>
                  </div>

                  {/* Booking type tabs */}
                  <div>
                    <label className="text-xs font-mono text-stone-400 block mb-2">✦ SELECT REQUEST CATEGORY</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'table', label: 'Book Table' },
                        { id: 'catering', label: 'Catering Feasts' },
                        { id: 'bulk_sweet_box', label: 'Bulk Gift Boxes' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          id={`booking_type_${item.id}`}
                          onClick={() => setFormData(prev => ({ ...prev, requestType: item.id as any }))}
                          className={`py-3 rounded-xl text-center text-xs font-serif font-semibold transition border cursor-pointer ${
                            formData.requestType === item.id 
                              ? 'bg-amber-950 text-amber-50 border-amber-950 shadow-md' 
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-400'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Grid fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-mono text-stone-500 block mb-1.5">FULL NAME *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Priyesh Patel"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-stone-500 block mb-1.5">EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="yourname@gmail.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-stone-500 block mb-1.5">CONTACT PHONE NUMBER *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+1 (555) 489-3011"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-stone-500 block mb-1.5">
                        {formData.requestType === 'table' ? 'NUMBER OF DINERS' : 
                         formData.requestType === 'catering' ? 'ESTIMATED GUESTS' : 'TOTAL SWEET BOXES REQUIRED'}
                      </label>
                      <input
                        type="number"
                        name="guests"
                        min="1"
                        max="1000"
                        value={formData.guests}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-stone-500 block mb-1.5">PREFERRED DATE *</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-stone-500 block mb-1.5">SUITABLE TIME</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm"
                      />
                    </div>
                  </div>

                  {/* Notes / Textarea */}
                  <div>
                    <label className="text-xs font-mono text-stone-500 block mb-1.5">SPECIAL MEAL INSTRUCTIONS / OUTDOOR CATERING REQUEST DETAILS</label>
                    <textarea
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="e.g. Vegetarian preferred, request gluten-free dessert assortments, high-spice standard for samosa chaats, corporate logo tag details..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      id="submit_booking_form_btn"
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3 bg-amber-950 hover:bg-amber-900 text-amber-50 font-serif font-semibold text-sm rounded-xl shadow-md transition duration-300 cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>
                        {formData.requestType === 'table' ? 'Secure Table Reservation' : 
                         formData.requestType === 'catering' ? 'Send Catering Proposal Inquiry' : 'Proceed with Bulk Custom Request'}
                      </span>
                    </button>
                    <p className="text-[10px] text-stone-400 text-center font-mono mt-3">
                      🔒 No credit cards taken. All pre-order and reservation confirmations are validated via SMS/Email within 15 minutes.
                    </p>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="booking-success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="text-center py-16 space-y-6"
                >
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-200 mx-auto">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-green-700 font-mono text-xs uppercase font-bold tracking-wider">✧ Request Dispatched ✧</span>
                    <h3 className="text-3xl font-serif font-bold text-amber-950 mt-1">Namaste, {formData.name}!</h3>
                    <p className="text-stone-500 text-sm max-w-sm mx-auto mt-2 leading-relaxed">
                      Your inquiry of <strong>{formData.requestType.toUpperCase()}</strong> for {formData.guests} guests on {formData.date} has been routed to our Aangan sweets kitchen desk.
                    </p>
                  </div>

                  {/* Summary of submitted request */}
                  <div className="bg-stone-50 border border-stone-200 max-w-sm mx-auto p-4 rounded-xl text-left text-xs font-mono text-stone-600 space-y-2">
                    <div className="flex justify-between border-b border-stone-150 pb-1.5">
                      <span>Inquiry Style:</span>
                      <span className="font-bold text-stone-800 uppercase">{formData.requestType}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-150 pb-1.5">
                      <span>Verification SMS to:</span>
                      <span className="font-bold text-stone-800">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Slot timing:</span>
                      <span className="font-bold text-amber-800">{formData.date} @ {formData.time}</span>
                    </div>
                  </div>

                  <button
                    id="new_booking_request_btn"
                    onClick={() => {
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        date: '',
                        time: '18:00',
                        guests: 2,
                        requestType: 'table',
                        notes: ''
                      });
                      setFormSubmitted(false);
                    }}
                    className="px-6 py-2.5 bg-stone-900 hover:bg-stone-850 text-white font-mono text-xs rounded-xl transition shadow"
                  >
                    Edit / Book Another Service
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
