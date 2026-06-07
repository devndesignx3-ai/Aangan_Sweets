import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, ChevronLeft, ChevronRight, Star, Heart, Flame, ShieldAlert, Sparkles, Plus } from 'lucide-react';
import { MENU_ITEMS } from '../data';
import { Sweet } from '../types';

interface ThreeDSweetShowcaseProps {
  onAddSweet: (sweet: Sweet) => void;
}

export default function ThreeDSweetShowcase({ onAddSweet }: ThreeDSweetShowcaseProps) {
  // Use our signature best-seller sweets for the 3D carousel (first 5 premium sweets)
  const featuredSweets = MENU_ITEMS.filter((item) => item.category === 'mithai' || item.category === 'chaat').slice(0, 5);
  
  const [rotationAngle, setRotationAngle] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  
  // Custom tilt coordinates for the central interactive card
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto rotate the display slowly every 6 seconds if not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      rotateCarousel(1);
    }, 6000);
    return () => clearInterval(interval);
  }, [rotationAngle, isHovered]);

  const rotateCarousel = (direction: number) => {
    const numItems = featuredSweets.length;
    const angleStep = 360 / numItems;
    const nextAngle = rotationAngle - (direction * angleStep);
    setRotationAngle(nextAngle);
    
    // Track active sweet index
    let nextIndex = (activeIndex + direction) % numItems;
    if (nextIndex < 0) nextIndex = numItems - 1;
    setActiveIndex(nextIndex);
  };

  // 3D Tilting movement for active detail card
  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt angle calculations (max 12deg tilt)
    const tX = ((y - centerY) / centerY) * -12;
    const tY = ((x - centerX) / centerX) * 12;
    
    setTiltX(tX);
    setTiltY(tY);
  };

  const resetTilt = () => {
    setTiltX(0);
    setTiltY(0);
  };

  const activeSweet = featuredSweets[activeIndex];

  return (
    <section id="showcase" className="relative py-24 bg-gradient-to-b from-[#16120e] to-[#251b15] text-[#FAF7F2] overflow-hidden">
      {/* Decorative Traditional Jaali Backdrop */}
      <div className="absolute inset-0 opacity-5 bg-jaali pointer-events-none"></div>
      
      {/* Absolute ambient light pools */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-amber-400 font-mono tracking-widest text-xs uppercase"
          >
            ✧ Interactive Royal Platter ✧
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif mt-2 font-bold tracking-tight text-amber-50 mb-4"
          >
            Aangan Sweet-Room Showcase
          </motion.h2>
          <p className="text-stone-400 max-w-2xl mx-auto text-sm md:text-base">
            Spin our virtual 3D clay-pot showcase to explore signature delicacies. Hover to tilt they in light, or click a dish to view its traditional recipes.
          </p>
        </div>

        {/* Outer 3D Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[550px] pt-10">
          
          {/* Column 1: The 3D Carousel Cylinder */}
          <div className="relative flex flex-col items-center justify-center h-[420px] md:h-[480px] perspective-2000">
            
            {/* Spinning Controls Indicator */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-stone-900/60 border border-amber-500/20 px-3 py-1.5 rounded-full backdrop-blur text-xs text-amber-400 font-mono pointer-events-none">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>Interactive 3D Carousel</span>
            </div>

            {/* Left & Right Circular Triggers */}
            <button 
              id="spin_prev_btn"
              onClick={() => rotateCarousel(-1)}
              className="absolute left-2 md:-left-4 z-40 p-3 rounded-full bg-stone-900/80 border border-amber-500/30 text-amber-50 hover:bg-amber-500 hover:text-stone-950 transition-all duration-300 shadow-lg shadow-black/50 group"
              aria-label="Previous Sweet"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button 
              id="spin_next_btn"
              onClick={() => rotateCarousel(1)}
              className="absolute right-2 md:-right-4 z-40 p-3 rounded-full bg-stone-900/80 border border-amber-500/30 text-amber-50 hover:bg-amber-500 hover:text-stone-950 transition-all duration-300 shadow-lg shadow-black/50 group"
              aria-label="Next Sweet"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 3D Gold Platter Ring Base */}
            <div className="absolute bottom-6 w-[280px] md:w-[380px] h-[30px] rounded-full bg-gradient-to-t from-amber-500/40 via-yellow-600/15 to-transparent border-t border-amber-500/30 shadow-2xl pointer-events-none transform -rotate-x-12 translate-y-16"></div>

            {/* Cylinder Stage */}
            <div 
              className="w-full h-full relative preserve-3d transition-transform duration-1000 ease-out flex items-center justify-center transform -rotate-x-12"
              style={{ transform: `rotateX(-10deg) rotateY(${rotationAngle}deg)` }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {featuredSweets.map((sweet, idx) => {
                const totalSweets = featuredSweets.length;
                const angleStep = 360 / totalSweets;
                const angle = idx * angleStep;
                // Responsive translation radius (approx. 180px for mobile, 220px for desktop)
                const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 150 : 210;
                
                const isSelected = idx === activeIndex;

                return (
                  <div
                    key={sweet.id}
                    id={`sweet_carous_item_${sweet.id}`}
                    className="absolute w-44 h-56 md:w-52 md:h-64 cursor-pointer preserve-3d transition-all duration-300"
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                      transformStyle: 'preserve-3d',
                    }}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSweet(sweet);
                      } else {
                        // Calculate shortest rotation path
                        let diff = idx - activeIndex;
                        if (diff > totalSweets / 2) diff -= totalSweets;
                        if (diff < -totalSweets / 2) diff += totalSweets;
                        rotateCarousel(diff);
                      }
                    }}
                  >
                    {/* Sweet Platter Card */}
                    <div className={`w-full h-full rounded-2xl p-4 flex flex-col justify-between transition-all duration-500 overflow-hidden ${
                      isSelected 
                        ? 'bg-gradient-to-br from-amber-500/20 to-red-500/20 border-2 border-amber-400/80 shadow-2xl scale-105 shadow-amber-500/20' 
                        : 'bg-stone-900/80 border border-stone-800 opacity-60 hover:opacity-90 hover:border-amber-500/30 shadow-lg'
                    }`}>
                      {/* Decorative corner embellishments */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-amber-500/30 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-amber-500/30 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-amber-500/30 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-amber-500/30 rounded-br-lg"></div>

                      <div className="flex justify-between items-start">
                        <span className="text-2xl">{sweet.emoji || '✨'}</span>
                        <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-400">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          <span>{sweet.rating}</span>
                        </div>
                      </div>

                      {/* Sweet realistic circular platter avatar */}
                      <div className="my-auto relative flex justify-center items-center h-28">
                        <div className="absolute w-24 h-24 rounded-full bg-stone-950 flex justify-center items-center border border-amber-500/10 shadow-inner group-hover:border-amber-500/20"></div>
                        <img 
                          src={sweet.image} 
                          alt={sweet.name}
                          className="w-20 col-span-1 h-20 rounded-full object-cover shadow-md border-2 border-amber-500/40 relative z-10 transition-transform duration-500 hover:rotate-45"
                          referrerPolicy="no-referrer"
                        />
                        {/* 3D shade disk */}
                        <div className="absolute bottom-1 w-20 h-2 bg-black/60 blur-sm rounded-full"></div>
                      </div>

                      <div className="text-center relative z-10">
                        <h3 className="text-sm font-serif font-semibold text-amber-50 line-clamp-1">{sweet.name}</h3>
                        <p className="text-xs text-amber-400/85 mt-0.5 font-mono">${sweet.price}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: The Interactive 3D Zoomed Detail Panel */}
          <div className="flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
                className="w-full max-w-lg bg-stone-900/60 border border-stone-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl backdrop-blur-md active:cursor-grabbing hover:shadow-amber-500/5 transition-shadow duration-500"
                style={{
                  transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Visual Jaali background */}
                <div className="absolute inset-0 opacity-5 bg-jaali pointer-events-none"></div>

                {/* Saffron side badge */}
                <div className="absolute top-6 right-6 flex gap-2">
                  <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-mono font-medium">
                    {activeSweet.tags[0]}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-3xl bg-amber-500/10 p-2.5 rounded-2xl border border-amber-500/20">{activeSweet.emoji || '✨'}</span>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-amber-50">{activeSweet.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < Math.floor(activeSweet.rating) ? 'fill-amber-400' : ''}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-stone-400 font-mono">({activeSweet.rating} rating)</span>
                    </div>
                  </div>
                </div>

                <p className="text-stone-300 text-sm leading-relaxed mt-6">
                  {activeSweet.description}
                </p>

                {/* Ingredients tag elements */}
                {activeSweet.ingredients && (
                  <div className="mt-6 border-t border-stone-800 pt-5">
                    <span className="text-xs font-mono text-amber-400/80 block mb-2">✦ Traditional Key Ingredients:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeSweet.ingredients.map((ing) => (
                        <span 
                          key={ing} 
                          className="bg-stone-950/80 border border-stone-800 px-2.5 py-1 rounded text-xs text-stone-300"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-8 pt-5 border-t border-stone-800">
                  <div>
                    <span className="text-xs text-stone-400 font-mono block">Price & Packaging</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-mono text-amber-400 font-bold">${activeSweet.price}</span>
                      <span className="text-xs text-stone-400">/ {activeSweet.weightText}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      id={`inspect_sweet_btn_${activeSweet.id}`}
                      onClick={() => setSelectedSweet(activeSweet)}
                      className="px-4 py-2.5 rounded-xl border border-stone-700 hover:border-amber-500/40 hover:bg-stone-850/50 text-stone-200 text-xs font-mono transition-all"
                    >
                      Recipe Details
                    </button>
                    <button
                      id={`add_sweet_showcase_btn_${activeSweet.id}`}
                      onClick={() => onAddSweet(activeSweet)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold shadow-lg shadow-amber-900/20 active:scale-95 transition-all"
                    >
                      <Plus className="w-4 h-4 text-stone-95
                      0 font-bold" />
                      Add to Platter
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Recipe / Secret Ingredients Detailed Modal */}
      <AnimatePresence>
        {selectedSweet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSweet(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Container */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-stone-900 border border-amber-500/30 rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl text-[#FAF7F2]"
            >
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none"></div>
              
              {/* Jaali background overlay */}
              <div className="absolute inset-0 opacity-5 bg-jaali pointer-events-none"></div>

              {/* Close Cross */}
              <button 
                id="close_modal_cross"
                onClick={() => setSelectedSweet(null)}
                className="absolute top-5 right-5 text-stone-400 hover:text-white border border-stone-800 hover:border-amber-500/50 p-2 rounded-full transition-all"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* 3D Tilt container inside modal */}
                <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-amber-500/40 group">
                  <img 
                    src={selectedSweet.image} 
                    alt={selectedSweet.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-amber-500 text-stone-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                      {selectedSweet.category.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{selectedSweet.emoji || '✨'}</span>
                      <h4 className="text-2xl font-serif font-bold text-amber-50">{selectedSweet.name}</h4>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-yellow-400 text-sm font-mono font-medium">{selectedSweet.rating} Excellent customer rating</span>
                    </div>

                    <p className="text-stone-300 text-sm mt-4 leading-relaxed">
                      {selectedSweet.description}
                    </p>

                    <div className="mt-4">
                      <h5 className="text-[#FAF7F2] font-semibold text-sm">Traditional Method:</h5>
                      <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                        Slowly prepared by our third-generation confectioners using pristine milk solids, hand-crushed cardamom, and organic saffron threads simmered overnight to capture the authentic, complex street flavor.
                      </p>
                    </div>

                    {selectedSweet.ingredients && (
                      <div className="mt-4">
                        <h5 className="text-[#FAF7F2] font-semibold text-sm">Purity Ingredients List:</h5>
                        <p className="text-[#FBBF24] font-mono text-xs mt-1">
                          {selectedSweet.ingredients.join(' ✦ ')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-4 border-t border-stone-850 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 font-mono uppercase block">Estimated cost:</span>
                      <span className="text-xl font-mono text-amber-400 font-bold">${selectedSweet.price} <span className="text-xs text-stone-400">/ {selectedSweet.weightText}</span></span>
                    </div>
                    <button
                      id={`modal_add_btn_${selectedSweet.id}`}
                      onClick={() => {
                        onAddSweet(selectedSweet);
                        setSelectedSweet(null);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 font-bold text-sm shadow-md"
                    >
                      Add to Platter
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
