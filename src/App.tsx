import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Sparkles, X, Menu, Phone, Heart, Star, MapPin, Check, 
  Trash2, Mail, Clock, ShieldCheck, ChevronRight, Info, Coffee 
} from 'lucide-react';

import { HERO_IMAGE, MENU_ITEMS, TESTIMONIALS } from './data';
import { Sweet, CartItem, CustomBoxSize } from './types';

// Importing custom designed modules
import ThreeDSweetShowcase from './components/ThreeDSweetShowcase';
import BuildABox from './components/BuildABox';
import MenuSection from './components/MenuSection';
import BookingSection from './components/BookingSection';

export default function App() {
  // Navigation & Shopping Cart Drawer States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  // Quick addition of sweets from sections
  const handleAddSweet = (sweet: Sweet) => {
    setCart((prev) => {
      // Check if standard sweet is already in cart
      const existing = prev.find((item) => item.sweetId === sweet.id && !item.isCustomBox);
      if (existing) {
        return prev.map((item) => 
          item.sweetId === sweet.id && !item.isCustomBox
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Otherwise insert new cart item
      const newItem: CartItem = {
        id: `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        sweetId: sweet.id,
        name: sweet.name,
        price: sweet.price,
        quantity: 1,
        isCustomBox: false
      };
      return [...prev, newItem];
    });

    // Animate a brief cart bounce or alert to let them know it has succeeded
    setIsCartOpen(true);
  };

  // Add customized packed sweet gift boxes to cart
  const handleAddCustomBox = (size: CustomBoxSize, contents: { [key: number]: Sweet }) => {
    const boxContentsCopy = { ...contents };
    const newItem: CartItem = {
      id: `cart_item_box_${Date.now()}`,
      sweetId: `box_${size.id}`,
      name: `Customized ${size.name}`,
      price: size.price,
      quantity: 1,
      isCustomBox: true,
      boxSize: size.id,
      boxContents: boxContentsCopy
    };
    
    setCart((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  // Remove specific items or boxes from cart
  const handleRemoveCartItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Edit quantity of standard item
  const handleQuantityChange = (itemId: string, direction: number) => {
    setCart((prev) => 
      prev.map((item) => {
        if (item.id === itemId && !item.isCustomBox) {
          const nextQty = item.quantity + direction;
          return { ...item, quantity: nextQty < 1 ? 1 : nextQty };
        }
        return item;
      })
    );
  };

  // Calculate cart sum totals
  const totalCartCount = cart.reduce((accum, item) => accum + item.quantity, 0);
  const cartSubtotal = cart.reduce((accum, item) => accum + (item.price * item.quantity), 0);
  const gstTax = cartSubtotal * 0.05; // 5% GST sweet levy
  const orderTotal = cartSubtotal + gstTax;

  const handleTriggerCheckout = () => {
    setIsCheckoutSuccess(true);
    setCart([]);
    setTimeout(() => {
      setIsCheckoutSuccess(false);
      setIsCartOpen(false);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1e1b18] antialiased">
      
      {/* 1. LUXURY HEADER NAVIGATION BAR */}
      <nav id="navbar" className="sticky top-0 z-40 bg-[#FAF7F2]/80 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand with Royal Typography styling */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-stone-950 text-xl shadow-md border border-amber-300">
              📿
            </div>
            <div>
              <span className="text-xl md:text-2xl font-serif font-bold text-amber-950 tracking-tight group-hover:text-amber-800 transition-colors block leading-none">
                Aangan
              </span>
              <span className="text-[10px] font-mono tracking-widest text-amber-700 uppercase">
                ✦ Mithai Court ✦
              </span>
            </div>
          </a>

          {/* Desktop Navigation links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-serif font-semibold text-[#1e1b18]/85">
            <a href="#showcase" className="hover:text-amber-800 transition duration-200">3D Showroom</a>
            <a href="#build-box" className="hover:text-amber-800 transition duration-200 flex items-center gap-1">
              <span>Build-A-Box</span>
              <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded-full font-mono uppercase tracking-wider scale-90">Sim</span>
            </a>
            <a href="#menu" className="hover:text-amber-800 transition duration-200">Royal Menu</a>
            <a href="#bookings" className="hover:text-amber-800 transition duration-200">Table Bookings</a>
          </div>

          {/* Shopping Cart Trigger Icon with numeric bubble */}
          <div className="flex items-center gap-3">
            <button
              id="shopping_cart_trigger_btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl border border-stone-250 bg-white text-stone-800 hover:border-amber-500 hover:text-amber-800 transition duration-300 shadow-sm cursor-pointer"
              aria-label="Toggle Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-current" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-600 text-stone-950 text-[10px] font-bold font-mono flex items-center justify-center shadow">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Nav Drawer toggle */}
            <button
              id="mobile_nav_btn"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-2.5 rounded-xl border border-stone-250 bg-white text-stone-800 cursor-pointer"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav drawer menu */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-stone-200 overflow-hidden"
          >
            <div className="px-5 py-6 flex flex-col gap-4 font-serif text-base font-semibold text-stone-800">
              <a href="#showcase" onClick={() => setIsMobileNavOpen(false)} className="hover:text-amber-800 transition">3D Showcase</a>
              <a href="#build-box" onClick={() => setIsMobileNavOpen(false)} className="hover:text-amber-800 transition">Build-A-Box Simulator</a>
              <a href="#menu" onClick={() => setIsMobileNavOpen(false)} className="hover:text-amber-800 transition">Royal Menu</a>
              <a href="#bookings" onClick={() => setIsMobileNavOpen(false)} className="hover:text-amber-800 transition">Table Bookings & Contact</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO SPOTLIGHT BANNER */}
      <header className="relative bg-gradient-to-b from-[#FAF7F2] to-[#EFECE5] overflow-hidden pt-12 pb-24 md:py-32">
        {/* Subtle jaali backdrop overlay */}
        <div className="absolute inset-0 opacity-4 bg-jaali pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Column 1: Copywriting */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Purity Ghee & Royal Cardamom</span>
              </span>

              <h1 className="text-4xl md:text-6xl font-serif font-black text-amber-950 leading-tight tracking-tight">
                Traditional Indian Confections, Refined.
              </h1>

              <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                Welcome to <strong>Aangan Sweets</strong>. In Hindi, <em>Aangan</em> signifies the comforting warmth of a family courtyard. We weave that exact heart-built lineage into our rich Kesar Mithai, handmade pure ghee Ladoos, and double-cooked savories (Chaat).
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
                <a
                  href="#build-box"
                  className="w-full sm:w-auto text-center px-8 py-3.5 bg-amber-950 hover:bg-amber-900 text-amber-50 font-serif font-bold rounded-xl shadow-lg shadow-amber-950/20 active:scale-95 transition"
                >
                  Design Custom Sweet Box
                </a>
                <a
                  href="#menu"
                  className="w-full sm:w-auto text-center px-8 py-3.5 bg-white hover:bg-stone-50 text-stone-850 font-serif font-bold rounded-xl border border-stone-300 transition"
                >
                  Browse Saffron Menu
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <span className="text-xl md:text-2xl font-serif font-bold text-amber-900 block leading-none">100%</span>
                  <span className="text-[10px] font-mono text-stone-500 uppercase">Pure Ghee</span>
                </div>
                <div className="text-center lg:text-left border-x border-stone-200">
                  <span className="text-xl md:text-2xl font-serif font-bold text-amber-900 block leading-none">No</span>
                  <span className="text-[10px] font-mono text-stone-500 uppercase">Preservative</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="text-xl md:text-2xl font-serif font-bold text-amber-900 block leading-none">Fresh</span>
                  <span className="text-[10px] font-mono text-stone-500 uppercase">Dough Daily</span>
                </div>
              </div>
            </div>

            {/* Column 2: Gorgeous generated hero collage */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg aspect-16/10 rounded-3xl overflow-hidden border-4 border-amber-600/10 shadow-2xl skew-x-3 hover:skew-x-0 transition-transform duration-700 group">
                <img 
                  src={HERO_IMAGE} 
                  alt="Aangan Premium Sweets Platter"
                  className="w-full h-full object-cover relative z-10 transition duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Micro reflection banner details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between text-white">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">Featured Dish</span>
                    <span className="font-serif text-lg font-bold">The Imperial Aangan Mithai Platter</span>
                  </div>
                  <span className="bg-amber-500/20 text-yellow-400 font-mono text-xs px-2.5 py-1 rounded bg-black/50 border border-amber-500/30">
                    ✧ Royal Signature
                  </span>
                </div>
              </div>

              {/* Floating absolute badges */}
              <div className="absolute -top-6 -left-4 z-25 bg-white border border-stone-200 p-3 rounded-2xl shadow-lg flex items-center gap-2.5 max-w-[140px]">
                <span className="text-2xl">🍯</span>
                <div className="leading-tight">
                  <span className="text-[9px] font-mono text-stone-400 block font-bold">Saffron Sweets</span>
                  <span className="text-xs font-serif font-bold text-[#1e1b18]">Handcrafted</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-4 z-25 bg-[#1e1b18] text-white border border-stone-850 p-3 rounded-2xl shadow-lg flex items-center gap-2.5 max-w-[140px]">
                <span className="text-2xl animate-spin">✴</span>
                <div className="leading-tight">
                  <span className="text-[9px] font-mono text-amber-400 block">Imperial Platter</span>
                  <span className="text-xs font-serif font-bold text-amber-50">3D Showroom</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 3. INTERACTIVE 3D PLAYGROUND SHOWCASE */}
      <ThreeDSweetShowcase onAddSweet={handleAddSweet} />

      {/* 4. CHIEF DEVISE MODULE: BUILD A BOX EXERCISE */}
      <BuildABox onAddCustomBox={handleAddCustomBox} />

      {/* 5. SECTIONS BAR MENU: DYNAMIC PRINTS AND CARD STYLES */}
      <MenuSection onAddSweet={handleAddSweet} />

      {/* 6. INDIVIDUAL FEEDBACK: EXPERT REVIEWS */}
      <section className="py-24 bg-gradient-to-b from-[#1e1b18] to-[#120f0c] text-white relative">
        <div className="absolute inset-0 opacity-3 bg-jaali pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-mono tracking-widest text-xs uppercase">✧ Patron Diaries ✧</span>
            <h2 className="text-3xl md:text-5xl font-serif mt-2 font-bold tracking-tight text-amber-50 mb-4">Reviews of Pure Joy</h2>
            <p className="text-stone-400 max-w-xl mx-auto text-sm">
              We take pride in cooking happiness. Here are the authentic stories and statements from our loving local community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((review) => (
              <div 
                key={review.id}
                id={`review_card_${review.id}`}
                className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Rating stars */}
                  <div className="flex text-amber-400 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current mr-0.5" />
                    ))}
                  </div>

                  <p className="text-stone-300 text-sm leading-relaxed italic">
                    "{review.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-stone-800/10">
                  <img 
                    src={review.avatar} 
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/20"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-serif font-semibold text-stone-100">{review.name}</h4>
                    <span className="text-[10px] font-mono text-stone-400">{review.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOOKINGS SYSTEM FORM */}
      <BookingSection />

      {/* 8. MAJESTIC FOOTER */}
      <footer className="bg-stone-950 text-stone-400 pt-16 pb-12 border-t border-stone-900 relative">
        <div className="absolute inset-0 opacity-2 bg-jaali pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📿</span>
              <span className="text-xl font-serif font-bold text-amber-50 tracking-tight">Aangan Sweets</span>
            </div>
            <p className="text-xs leading-relaxed text-stone-400">
              Third-generation confectionery specialists preparing premium Indian sweets, street chaats, and clay-pot refreshments using traditional pure cow ghee.
            </p>
          </div>

          <div>
            <h4 className="text-amber-400 font-mono text-xs uppercase tracking-widest font-semibold mb-4">✦ Quick Navigation</h4>
            <div className="flex flex-col gap-2.5 text-xs text-stone-400 font-serif">
              <a href="#showcase" className="hover:text-amber-300 transition">3D Sweets Showroom</a>
              <a href="#build-box" className="hover:text-amber-300 transition">Gift Sweet-Box Configurator</a>
              <a href="#menu" className="hover:text-amber-300 transition">Saffron Food Menu</a>
              <a href="#bookings" className="hover:text-amber-300 transition">Table Reservations</a>
            </div>
          </div>

          <div>
            <h4 className="text-amber-400 font-mono text-xs uppercase tracking-widest font-semibold mb-4">✦ Neighborhood Spot</h4>
            <div className="space-y-3 text-xs leading-relaxed text-stone-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>9020 Sutton Pl, Hamilton, OH 45011</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>(513) 807-8703</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>orders@aangan-sweets.com</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-amber-400 font-mono text-xs uppercase tracking-widest font-semibold mb-4">✦ Pure Mithai Guarantee</h4>
            <div className="bg-stone-900/60 border border-stone-850 p-4 rounded-xl">
              <p className="text-[11px] leading-relaxed text-stone-400">
                ⭐ Every single parcel of Aangan Sweets uses premium local organic dairy, hand-split cardamoms, and real edible silver leaf. Crafted fresh, packed with royal dignity.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-stone-900 text-center text-xs text-stone-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Aangan Sweets Inc. All traditional copyrights reserved.</p>
          <div className="flex gap-4 font-mono text-[10px]">
            <a href="#" className="hover:text-amber-400 transition">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-amber-400 transition">FSSAI Certified</a>
            <span>•</span>
            <a href="#" className="hover:text-amber-400 transition">HACCP Authenticated</a>
          </div>
        </div>
      </footer>

      {/* 9. SLIDE-OUT SHOPPING CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop cover overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
            ></motion.div>

            {/* Slider container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-[#FAF7F2] text-stone-900 flex flex-col shadow-2xl justify-between border-l border-stone-200"
            >
              {/* Internal Velvet Lining accent */}
              <div className="p-6 border-b border-stone-250 flex justify-between items-center bg-white shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-xl text-amber-950">
                    <ShoppingBag className="w-5 h-5 text-current" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-amber-950">Your Mithai Platter</h3>
                    <p className="text-[10px] font-mono text-stone-400 uppercase">Pre-order checkout cart</p>
                  </div>
                </div>
                
                <button
                  id="close_cart_drawer_btn"
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-stone-100 rounded-full text-stone-450 hover:text-stone-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Middle Cart Contents List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence mode="popLayout">
                  {isCheckoutSuccess ? (
                    <motion.div
                      key="success-checkout-state"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-12 space-y-4"
                    >
                      <span className="text-5xl block animate-bounce">🍲</span>
                      <h4 className="font-serif font-bold text-2xl text-amber-950">Pre-Order Dispatched!</h4>
                      <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                        Namaste! Your delicious sweet box pre-order request has been generated. Our chefs are on stand-by to call and confirm.
                      </p>
                      <div className="inline-flex text-[11px] font-mono text-green-700 bg-green-50 border border-green-200 p-2 rounded-xl mt-3">
                        ✓ Voucher code: AANGAN-MITHAI-2026
                      </div>
                    </motion.div>
                  ) : cart.length === 0 ? (
                    <motion.div
                      key="empty-cart-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20 text-stone-400 space-y-3"
                    >
                      <span className="text-4xl block">🥣</span>
                      <h4 className="font-serif font-bold text-stone-800">Your platter is clean</h4>
                      <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                        Add delicacies from our 3D Showroom or design your own customized Sweet Box to begin pre-ordering!
                      </p>
                    </motion.div>
                  ) : (
                    cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm flex items-start gap-3 justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-serif font-bold text-amber-950 leading-snug">{item.name}</h4>
                            <span className="font-mono text-xs font-semibold text-amber-900">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>

                          {/* Render custom box contents summary if present */}
                          {item.isCustomBox && item.boxContents && (
                            <div className="mt-2 text-[10px] font-mono text-stone-500 flex flex-wrap gap-1">
                              {(Object.values(item.boxContents) as Sweet[]).map((sw, innerIdx) => (
                                <span key={innerIdx} className="bg-amber-100/50 text-amber-950 px-1.5 py-0.5 rounded border border-amber-200/30">
                                  {sw.emoji} {sw.name.replace('Royal ', '')}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Quantity selection widgets (Only for standard sweets, not customized hampers) */}
                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-100">
                            {!item.isCustomBox ? (
                              <div className="flex items-center gap-2">
                                <button
                                  id={`dec_qty_btn_${item.id}`}
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 transition flex items-center justify-center font-bold text-sm cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="text-xs font-mono font-bold text-stone-800">{item.quantity}</span>
                                <button
                                  id={`inc_qty_btn_${item.id}`}
                                  onClick={() => handleQuantityChange(item.id, +1)}
                                  className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 transition flex items-center justify-center font-bold text-sm cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <div className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200/50">
                                ✦ Royal Bespoke Box hampering
                              </div>
                            )}

                            <button
                              id={`remove_cart_item_${item.id}`}
                              onClick={() => handleRemoveCartItem(item.id)}
                              className="text-stone-400 hover:text-red-600 transition flex items-center text-xs gap-1 cursor-pointer font-mono font-medium"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Totals panel Checkout actions */}
              {!isCheckoutSuccess && cart.length > 0 && (
                <div className="p-6 bg-white border-t border-stone-250 space-y-4">
                  <div className="space-y-2 text-xs text-stone-500 font-mono">
                    <div className="flex justify-between">
                      <span>Platter subtotal:</span>
                      <span className="font-semibold text-stone-800">${cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sweet GST tax (5.0%):</span>
                      <span className="font-semibold text-stone-800">${gstTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-stone-900 border-t border-dashed border-stone-200 pt-2.5">
                      <span className="font-serif">Estimated Grand Total:</span>
                      <span className="font-mono text-amber-800 font-bold">${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    id="submit_cart_preorder_btn"
                    onClick={handleTriggerCheckout}
                    className="w-full py-3 bg-amber-950 hover:bg-amber-900 text-amber-50 font-serif font-bold text-sm rounded-xl shadow-md transition duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Inquire & Despatch Pre-Order</span>
                  </button>
                  <p className="text-[9px] text-stone-400 text-center font-mono leading-relaxed">
                    By confirming this preorder request, our sweet specialists will contact you at your submitted booking telephone number to schedule fresh confectionery delivery details or pick ups.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
