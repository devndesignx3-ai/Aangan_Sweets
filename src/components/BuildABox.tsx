import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trash2, Box, ShoppingBag, Eye, Star, Info, Wand2 } from 'lucide-react';
import { CUSTOM_BOX_SIZES, MENU_ITEMS } from '../data';
import { Sweet, CustomBoxSize } from '../types';

interface BuildABoxProps {
  onAddCustomBox: (size: CustomBoxSize, contents: { [key: number]: Sweet }) => void;
}

export default function BuildABox({ onAddCustomBox }: BuildABoxProps) {
  const [selectedSize, setSelectedSize] = useState<CustomBoxSize>(CUSTOM_BOX_SIZES[1]); // Default to Medium (9 slots)
  const [boxContents, setBoxContents] = useState<{ [key: number]: Sweet }>({});
  const [activeSlot, setActiveSlot] = useState<number | null>(0); // Target slot
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [boxTiltX, setBoxTiltX] = useState(0);
  const [boxTiltY, setBoxTiltY] = useState(0);

  // Take only traditional sweets category for packing
  const pakableSweets = MENU_ITEMS.filter((item) => item.category === 'mithai');

  const handleSelectSweetToPack = (sweet: Sweet) => {
    if (activeSlot === null) return;
    
    // Set the sweet at our targeted active slot
    const updatedContents = { ...boxContents, [activeSlot]: sweet };
    setBoxContents(updatedContents);

    // Auto-advance active slot to the next empty one, or wrap around
    const totalSlots = selectedSize.slots;
    let nextSlot = (activeSlot + 1) % totalSlots;
    
    // Try to find the next actually empty slot
    let foundEmpty = false;
    for (let i = 0; i < totalSlots; i++) {
      const inspectSlot = (activeSlot + 1 + i) % totalSlots;
      if (!updatedContents[inspectSlot]) {
        nextSlot = inspectSlot;
        foundEmpty = true;
        break;
      }
    }
    
    if (foundEmpty) {
      setActiveSlot(nextSlot);
    } else {
      setActiveSlot(null); // All slots are filled!
    }
  };

  const handleClearSlot = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedContents = { ...boxContents };
    delete updatedContents[slotIndex];
    setBoxContents(updatedContents);
    setActiveSlot(slotIndex);
  };

  const handleAutofillPicks = () => {
    const autofilled: { [key: number]: Sweet } = {};
    for (let i = 0; i < selectedSize.slots; i++) {
      // Pick a semi-random sweet from our sweets list
      const randomSweet = pakableSweets[i % pakableSweets.length];
      autofilled[i] = randomSweet;
    }
    setBoxContents(autofilled);
    setActiveSlot(null); // Box completed
  };

  const handleClearAll = () => {
    setBoxContents({});
    setActiveSlot(0);
    setIsAddedToCart(false);
  };

  // Change box size and wipe contents to be safe
  const handleSizeChange = (size: CustomBoxSize) => {
    setSelectedSize(size);
    setBoxContents({});
    setActiveSlot(0);
    setIsAddedToCart(false);
  };

  // 3D Tilt for the physical box layout
  const handleBoxMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget;
    const rect = box.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt angle max 10 degrees shadow
    const tX = ((y - centerY) / centerY) * -8;
    const tY = ((x - centerX) / centerX) * 8;
    
    setBoxTiltX(tX);
    setBoxTiltY(tY);
  };

  const resetBoxTilt = () => {
    setBoxTiltX(0);
    setBoxTiltY(0);
  };

  const handleAddToCart = () => {
    onAddCustomBox(selectedSize, boxContents);
    setIsAddedToCart(true);
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 3000);
  };

  // Calculate percentage of box packed
  const packedCount = Object.keys(boxContents).length;
  const isBoxCompleted = packedCount === selectedSize.slots;
  const fillPercentage = Math.round((packedCount / selectedSize.slots) * 100);

  return (
    <section id="build-box" className="py-24 bg-gradient-to-b from-[#FAF7F2] to-[#EFECE5] text-[#1e1b18] relative overflow-hidden">
      {/* Delicate background pattern */}
      <div className="absolute inset-0 opacity-3 bg-jaali pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-amber-700 font-mono tracking-widest text-xs uppercase block"
          >
            ✧ Pure Churn Ghee Gift Boxes ✧
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif mt-2 font-bold tracking-tight text-amber-950 mb-4"
          >
            Design Your Imperial Sweet Box
          </motion.h2>
          <p className="text-stone-600 max-w-2xl mx-auto text-sm md:text-base">
            Create a bespoke assortment box for your celebrations. Hand-pick your favorites and watch them bundle beautifully inside our custom 3D gift-box.
          </p>
        </div>

        {/* Step Tabs Grid for sizes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {CUSTOM_BOX_SIZES.map((size) => {
            const isSelected = size.id === selectedSize.id;
            return (
              <button
                key={size.id}
                id={`box_size_btn_${size.id}`}
                onClick={() => handleSizeChange(size)}
                className={`flex flex-col p-5 rounded-2xl text-left transition-all duration-300 relative overflow-hidden ${
                  isSelected 
                    ? 'bg-amber-950 text-amber-50 shadow-xl shadow-amber-950/10 border-2 border-amber-600' 
                    : 'bg-white border border-stone-200 hover:border-amber-700/30'
                }`}
              >
                {/* Decorative golden corner */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 rotate-45 flex items-end justify-center pb-1">
                    <Sparkles className="w-3 h-3 text-stone-950" />
                  </div>
                )}
                <span className={`text-stone-400 font-mono text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-amber-400' : ''}`}>
                  Gift Tier: {size.slots} Delicacies
                </span>
                <span className="text-lg font-serif font-bold mt-1 block">{size.name}</span>
                <span className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                  {size.description}
                </span>
                <div className="flex items-center justify-between border-t border-dashed border-stone-200/20 mt-4 pt-3 w-full">
                  <span className="text-xs font-mono">{size.weightText}</span>
                  <span className={`text-sm font-semibold font-mono ${isSelected ? 'text-amber-400' : 'text-amber-700'}`}>
                    ${size.price}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-6">
          
          {/* Column 1 (lg:col-span-8): The Interactive 3D Box Arena */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Packing Status bar */}
            <div className="w-full max-w-md bg-stone-100 hover:bg-stone-50 border border-stone-200/80 rounded-2xl px-5 py-4 flex items-center justify-between mb-8 shadow-inner">
              <div className="flex items-center gap-3">
                <Box className="w-5 h-5 text-amber-700" />
                <div>
                  <span className="text-xs text-stone-500 block font-mono">Box Filling Progress</span>
                  <span className="text-sm font-bold font-serif">{packedCount} of {selectedSize.slots} sweets packed</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-600 transition-all duration-500"
                    style={{ width: `${fillPercentage}%` }}
                  ></div>
                </div>
                <span className="text-xs font-mono font-bold">{fillPercentage}%</span>
              </div>
            </div>

            {/* Simulated 3D Gold Sweets Box Container */}
            <div 
              onMouseMove={handleBoxMouseMove}
              onMouseLeave={resetBoxTilt}
              className="relative w-full max-w-md aspect-square bg-gradient-to-br from-[#2c1d11] to-[#150a04] p-8 md:p-10 rounded-[32px] border-[5px] md:border-[8px] border-amber-600/95 shadow-2xl transition-all duration-300 pointer-events-auto perspective-1000"
              style={{
                transform: `rotateX(${-10 + boxTiltX}deg) rotateY(${15 + boxTiltY}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Internal Velvet Lining overlay */}
              <div className="absolute inset-2 bg-gradient-to-tr from-[#6b1111] via-[#380404] to-[#1a0101] rounded-[24px] border-2 border-amber-500/30 overflow-hidden shadow-inner flex flex-col justify-between">
                
                {/* Traditional geometric gold pattern backdrop inside the velvet box */}
                <div className="absolute inset-0 opacity-10 bg-jaali pointer-events-none"></div>

                {/* Grid container with variable slots based on box size */}
                <div className="p-4 md:p-5 w-full h-full flex items-center justify-center relative z-10">
                  <div className={`grid gap-3 md:gap-4 w-full aspect-square ${
                    selectedSize.slots === 4 ? 'grid-cols-2' : selectedSize.slots === 9 ? 'grid-cols-3' : 'grid-cols-4'
                  }`}>
                    {[...Array(selectedSize.slots)].map((_, index) => {
                      const sweetInSlot = boxContents[index];
                      const isActive = activeSlot === index;

                      return (
                        <div
                          key={index}
                          onClick={() => setActiveSlot(index)}
                          className={`relative aspect-square rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer border group ${
                            isActive 
                              ? 'bg-[#ffe28e]/10 border-amber-400 scale-[1.03] shadow-lg shadow-amber-400/25 ring-2 ring-amber-400/20' 
                              : sweetInSlot 
                                ? 'bg-amber-950/20 border-amber-600/30' 
                                : 'bg-[#1a0101]/60 border-amber-800/25 hover:bg-[#3d0303]/40'
                          }`}
                        >
                          {/* Inside Slot Number coordinate indicator */}
                          <div className="absolute bottom-1 right-1.5 text-[8px] font-mono text-amber-500/40 pointer-events-none">
                            {index + 1}
                          </div>

                          <AnimatePresence mode="wait">
                            {sweetInSlot ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 45 }}
                                className="relative flex flex-col items-center justify-center w-full h-full p-2"
                              >
                                {/* 3D Sphere Sweet Representation with matching rich CSS gradients */}
                                <div 
                                  className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg relative flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform"
                                  style={{
                                    background: `radial-gradient(circle at 35% 35%, ${sweetInSlot.color}dd, ${sweetInSlot.color}ff 30%, #000000 100%)`
                                  }}
                                >
                                  {/* Silver foil or Pistachio spot textures on sphere */}
                                  <div className="absolute top-2 left-2.5 w-1.5 h-1 px-1 bg-amber-200/50 rounded-full blur-[0.5px]"></div>
                                  <div className="absolute top-1 right-2.5 w-2 h-1 px-1 bg-white/75 rotate-12 rounded-full blur-[0.2px]"></div>

                                  {/* Sweet small emoji inside */}
                                  <span className="text-sm md:text-base relative z-10">{sweetInSlot.emoji || '✨'}</span>
                                </div>

                                {/* Mini Sweet label overlay */}
                                <span className="text-[8px] md:text-[9px] text-amber-200/80 font-mono mt-1 text-center font-medium line-clamp-1 truncate max-w-full px-1">
                                  {sweetInSlot.name.replace('Royal ', '')}
                                </span>

                                {/* Floating Hover Trash can */}
                                <button
                                  id={`clear_slot_btn_${index}`}
                                  onClick={(e) => handleClearSlot(index, e)}
                                  className="absolute top-0 right-0 p-1 rounded-full bg-red-900/90 hover:bg-red-700 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg border border-red-500/20"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </motion.div>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-center opacity-40 group-hover:opacity-75 transition-opacity">
                                <span className="text-lg md:text-xl text-amber-500/60 font-mono">+</span>
                                <span className="text-[8px] font-mono tracking-wider text-amber-600 uppercase">Empty</span>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Helper guidelines */}
            <p className="text-xs text-stone-500 max-w-sm text-center font-mono mt-6">
              💡 Select any box compartment, then click a delicacy in the dispenser below to pack it.
            </p>
          </div>

          {/* Column 2 (lg:col-span-4): Sweet Pack Dispenser, Chef Tools, and Checkout */}
          <div className="lg:col-span-5 flex flex-col justify-center border-l-0 lg:border-l lg:border-stone-200/80 lg:pl-10 h-full">
            
            {/* Chef Smart Packing Tools */}
            <h3 className="text-xl font-serif font-bold text-amber-950 mb-3 flex items-center gap-2">
              <Box className="w-5 h-5 text-amber-800" />
              <span>Sweet Box Configurator</span>
            </h3>

            <div className="flex items-center gap-2 mb-6">
              <button
                id="auto_pack_btn"
                onClick={handleAutofillPicks}
                className="flex items-center gap-1.5 px-3 py-2 border border-amber-800/30 rounded-xl bg-white text-stone-800 hover:bg-amber-50 hover:text-amber-900 transition-all text-xs font-mono shadow-sm font-medium"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Autofill Chef's Choice</span>
              </button>
              <button
                id="clear_pack_box_btn"
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-2 border border-red-800/10 rounded-xl bg-white text-red-700 hover:bg-red-50 transition-all text-xs font-mono shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Box</span>
              </button>
            </div>

            {/* Sweet Selection Tray */}
            <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm mb-6">
              <span className="text-xs text-amber-800 font-mono font-semibold uppercase block mb-3">✦ Delicacy Dispenser Board</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {pakableSweets.map((sweet) => (
                  <button
                    key={sweet.id}
                    id={`pack_sweet_button_${sweet.id}`}
                    onClick={() => handleSelectSweetToPack(sweet)}
                    className="flex flex-col items-center p-2.5 rounded-xl border border-stone-100 hover:border-amber-500/40 hover:bg-amber-50/40 text-center transition-all bg-stone-50/50"
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm font-bold text-white mb-1"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${sweet.color}aa, ${sweet.color}ff 100%)`
                      }}
                    >
                      {sweet.emoji || '✨'}
                    </div>
                    <span className="text-[10px] font-sans font-bold text-stone-800 tracking-tight leading-tight line-clamp-1">{sweet.name.replace('Royal ', '')}</span>
                    <span className="text-[8px] font-mono text-stone-500 mt-0.5">${sweet.price} / slot</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Summation panel */}
            <div className="bg-amber-950 text-amber-50 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 text-xs font-mono text-amber-300">
                  <span>Selected Box:</span>
                  <span>{selectedSize.name}</span>
                </div>
                <div className="flex items-center justify-between font-serif text-lg font-bold mb-2">
                  <span>Estimated Total:</span>
                  <span className="text-amber-400 font-mono">${selectedSize.price}</span>
                </div>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Price wraps all sweets packed in your custom size box, beautifully enclosed in gold filigree wrapping and dynamic gift-tag envelopes.
                </p>
              </div>

              <div className="mt-6">
                <button
                  id="checkout_custom_box_btn"
                  onClick={handleAddToCart}
                  disabled={!isBoxCompleted}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold font-serif shadow-md transition-all ${
                    isBoxCompleted 
                      ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 active:scale-95 cursor-pointer' 
                      : 'bg-stone-800 text-stone-500 border border-stone-700/50 cursor-not-allowed'
                  }`}
                >
                  {isAddedToCart ? (
                    <span className="flex items-center gap-2">
                      🎉 Sweet Box Saved to Cart!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-stone-950" />
                      <span>{isBoxCompleted ? 'Add Box to Shopping Cart' : `Pack ${selectedSize.slots - packedCount} more sweets to save`}</span>
                    </span>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
