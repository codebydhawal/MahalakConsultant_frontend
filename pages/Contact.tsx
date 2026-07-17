
import React, { useState } from 'react';
import { SiteConfig } from '../types';

export const Contact: React.FC<{ config: SiteConfig }> = ({ config }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Architecture Inquiry',
    message: ''
  });

  const isFormValid = formData.name.trim() !== '' && 
                      formData.email.includes('@') && 
                      formData.message.trim().length > 10;

  const handleWhatsAppInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const { name, email, subject, message } = formData;
    const waMessage = `*NEW STUDIO ENQUIRY*%0A%0A` +
      `*Name:* ${name}%0A` +
      `*Email:* ${email}%0A` +
      `*Interested In:* ${subject}%0A` +
      `*Message:* ${message}`;
    
    const cleanNumber = config.whatsappEnquiry.replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanNumber}?text=${waMessage}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <h1 className="text-6xl font-extrabold text-stone-900 mb-8 tracking-tighter">Let's Design.</h1>
            <p className="text-stone-500 text-xl mb-16 font-light max-w-md leading-relaxed">
              Connect with our principal consultants for a personalized session.
            </p>
            
            <div className="space-y-8 mb-16">
              <div className="flex gap-6 items-start p-8 bg-white rounded-[2.5rem] shadow-sm border border-stone-100">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-700 shrink-0"><i className="fa-solid fa-phone text-lg"></i></div>
                <div><h4 className="font-extrabold text-stone-900 text-[10px] uppercase tracking-widest mb-2">Direct Hotline</h4><p className="text-stone-600 text-lg font-bold">{config.contactPhone}</p></div>
              </div>
              <div className="flex gap-6 items-start p-8 bg-white rounded-[2.5rem] shadow-sm border border-stone-100">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-700 shrink-0"><i className="fa-solid fa-envelope text-lg"></i></div>
                <div><h4 className="font-extrabold text-stone-900 text-[10px] uppercase tracking-widest mb-2">Studio Email</h4><p className="text-stone-600 text-lg font-bold">{config.contactEmail}</p></div>
              </div>
            </div>

            {/* Map Card - Updated to Lalghati, Bhopal */}
            <div className="rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl aspect-[16/10] relative group">
              <iframe 
                title="Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3665.3435134762514!2d77.3697!3d23.2847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c67e914041d57%3A0x6d97c67e914041d57!2sLalghati%2C%20Bhopal%2C%20Madhya%20Pradesh%20462001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                className="grayscale group-hover:grayscale-0 transition-all duration-1000"
              ></iframe>
            </div>
          </div>

          <div className="bg-white p-12 lg:p-16 rounded-[4rem] shadow-2xl border-2 border-stone-50">
             <form className="space-y-8" onSubmit={handleWhatsAppInquiry}>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-stone-400 tracking-[0.3em] ml-2">Full Identity</label>
                  <input required className="w-full px-8 py-6 bg-stone-50 border-2 border-stone-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold" placeholder="E.g. Rahul Sharma" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-stone-400 tracking-[0.3em] ml-2">Communication Link</label>
                  <input required type="email" className="w-full px-8 py-6 bg-stone-50 border-2 border-stone-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-stone-400 tracking-[0.3em] ml-2">The Narrative</label>
                  <textarea required rows={5} className="w-full px-8 py-6 bg-stone-50 border-2 border-stone-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold" placeholder="Tell us about your space..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                </div>
                <button type="submit" disabled={!isFormValid} className={`w-full py-6 rounded-[2rem] font-extrabold text-xl flex items-center justify-center gap-4 transition-all ${isFormValid ? 'bg-stone-900 text-white hover:bg-[#25D366] shadow-2xl shadow-stone-200' : 'bg-stone-100 text-stone-300'}`}>
                  <i className="fa-brands fa-whatsapp text-2xl"></i> {isFormValid ? 'Connect on WhatsApp' : 'Complete Form First'}
                </button>
             </form>
          </div>
        </div>
      </section>
    </div>
  );
};
