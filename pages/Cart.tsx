
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartItem, SiteConfig } from '../types';

interface CartProps {
  cart: CartItem[];
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  config: SiteConfig;
  // Added user prop to match App.tsx usage and fix TS assignability error
  user: any;
}

export const Cart: React.FC<CartProps> = ({ cart, removeFromCart, updateQuantity, config, clearCart, user }) => {
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleCheckout = () => {
    const newId = `AV-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(newId);
    setOrderConfirmed(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finalizeOnWhatsApp = () => {
    const itemsList = cart.map(item => `- ${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`).join('%0A');
    const message = `*NEW SECURE ORDER CONFIRMED*%0A%0A` +
      `*Order ID:* ${orderId}%0A` +
      `*Total Amount:* ₹${total.toLocaleString()}%0A%0A` +
      `*Items:*%0A${itemsList}%0A%0A` +
      `Please provide my delivery details and payment link.`;
    
    const waUrl = `https://wa.me/${config.whatsappShopping.replace(/\D/g, '')}?text=${message}`;
    window.open(waUrl, '_blank');
    clearCart();
  };

  if (orderConfirmed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center animate-in zoom-in-95 duration-500">
         <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10 text-4xl shadow-lg">
           <i className="fa-solid fa-check-double"></i>
         </div>
         <h1 className="text-5xl font-extrabold text-stone-900 mb-6 tracking-tight">Order Confirmed!</h1>
         <p className="text-stone-500 text-xl mb-12 font-light">Your secure order ID is: <span className="font-bold text-stone-900">{orderId}</span></p>
         
         <div className="bg-stone-50 p-10 rounded-[3rem] border-2 border-stone-100 mb-12 text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6">What's Next?</h4>
            <ul className="space-y-4">
              <li className="flex gap-4 items-start">
                <div className="w-6 h-6 bg-amber-700 text-white rounded-full flex items-center justify-center text-[10px] shrink-0 mt-1">1</div>
                <p className="text-stone-700">Click the button below to connect with our <b>Secure Shopping Channel</b> on WhatsApp.</p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-6 h-6 bg-amber-700 text-white rounded-full flex items-center justify-center text-[10px] shrink-0 mt-1">2</div>
                <p className="text-stone-700">Share your delivery address and preferred payment method (UPI/Card).</p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-6 h-6 bg-amber-700 text-white rounded-full flex items-center justify-center text-[10px] shrink-0 mt-1">3</div>
                <p className="text-stone-700">Receive tracking details once your energy-aligned artifacts are dispatched.</p>
              </li>
            </ul>
         </div>

         <button 
           onClick={finalizeOnWhatsApp}
           className="w-full py-6 bg-stone-900 text-white rounded-[2rem] font-extrabold text-xl hover:bg-[#25D366] transition-all flex items-center justify-center gap-4 shadow-2xl"
         >
           <i className="fa-brands fa-whatsapp text-2xl"></i> Finalize Payment on WhatsApp
         </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-basket-shopping text-3xl text-stone-300"></i>
        </div>
        <h2 className="text-3xl font-bold text-stone-900 mb-4">Your bag is empty</h2>
        <p className="text-stone-500 mb-10">Look like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="px-8 py-4 bg-amber-700 text-white rounded-xl font-bold hover:bg-amber-800 transition-all" style={{ backgroundColor: config.accentColor }}>
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-16">
        <h1 className="text-5xl font-extrabold tracking-tighter">Your Bag.</h1>
        <p className="text-stone-400 font-bold uppercase text-[10px] tracking-[0.3em]">No Cookies • Encrypted Connection</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {cart.map(item => (
            <div key={item.id} className="flex gap-8 p-8 bg-white border-2 border-stone-50 rounded-[2.5rem] group hover:border-amber-100 transition-all">
              <div className="w-32 h-32 bg-stone-50 rounded-[1.5rem] overflow-hidden shrink-0 shadow-inner">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-grow flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-2xl text-stone-900 mb-1">{item.name}</h3>
                  <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-6">{item.category}</p>
                  <div className="flex items-center gap-6 bg-stone-50 self-start px-4 py-2 rounded-2xl border border-stone-100">
                    <button onClick={() => updateQuantity(item.id, -1)} className="text-stone-400 hover:text-stone-900 transition-colors"><i className="fa-solid fa-minus text-xs"></i></button>
                    <span className="text-base font-extrabold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="text-stone-400 hover:text-stone-900 transition-colors"><i className="fa-solid fa-plus text-xs"></i></button>
                  </div>
                </div>
                <div className="mt-6 md:mt-0 text-right">
                  <p className="font-extrabold text-2xl text-stone-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline mt-4">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-12 rounded-[3.5rem] border-2 border-stone-50 h-fit space-y-8 sticky top-32 shadow-2xl shadow-stone-100">
          <h2 className="text-2xl font-extrabold tracking-tight">Summary</h2>
          <div className="space-y-6 text-sm">
            <div className="flex justify-between text-stone-500 font-medium">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-500 font-medium">
              <span>GST (18%)</span>
              <span className="font-bold text-stone-900">₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500 font-medium">Delivery</span>
              <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-bold uppercase rounded-lg">Complimentary</span>
            </div>
            <div className="pt-6 border-t-2 border-stone-50 flex justify-between text-3xl font-extrabold text-stone-900">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-8 space-y-6">
            <button 
              onClick={handleCheckout}
              className="w-full py-6 bg-stone-900 text-white font-extrabold rounded-[2rem] hover:bg-black transition-all shadow-xl shadow-stone-200"
            >
              Verify & Confirm Order
            </button>
            <div className="flex flex-col items-center gap-4 pt-4">
               <p className="text-[9px] font-extrabold text-stone-300 uppercase tracking-[0.3em]">We Accept</p>
               <div className="flex gap-4 opacity-40 grayscale">
                 <i className="fa-brands fa-cc-visa text-2xl"></i>
                 <i className="fa-brands fa-cc-mastercard text-2xl"></i>
                 <i className="fa-solid fa-qrcode text-2xl"></i>
               </div>
            </div>
            <p className="text-[9px] text-center text-stone-400 font-medium leading-relaxed">
              <i className="fa-solid fa-shield-halved mr-1 text-amber-700"></i> No banking data is stored on this server. Your privacy is our priority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
