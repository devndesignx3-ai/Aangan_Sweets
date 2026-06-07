import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, Info, Plus, Sparkles, SlidersHorizontal, Heart, Shield } from 'lucide-react';
import { MENU_ITEMS } from '../data';
import { Sweet } from '../types';

interface MenuSectionProps {
  onAddSweet: (sweet: Sweet) => void;
}

export default function MenuSection({ onAddSweet }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'mithai' | 'chaat' | 'combos' | 'dishes' | 'drinks'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  // Gather all unique tags for sub-filtering
  const allTags = ['All', 'Best Seller', 'Pure Ghee', 'Saffron-Infused', 'Gluten-Free', 'Vegan-Friendly', 'Aromatic Spice'];

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.ingredients && item.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesTag = selectedTag === 'All' || item.tags.includes(selectedTag);
    return matchesCategory && matchesSearch && matchesTag;
  });

  const CATEGORY_ORDER: { key: 'mithai' | 'chaat' | 'dishes' | 'combos' | 'drinks'; label: string; icon: string; subtitle: string }[] = [
    { key: 'mithai', label: 'Mithai & Traditional Sweets', icon: '✨', subtitle: 'Handcrafted traditional sweets made with pure cow ghee' },
    { key: 'chaat', label: 'Appetizers & Savory Chaats', icon: '🌶️', subtitle: 'Vibrant, tangy, and crispy street food favorites' },
    { key: 'dishes', label: 'Traditional Hot Dishes', icon: '🍛', subtitle: 'Rich aromatic curries and slow-simmered delicacies' },
    { key: 'combos', label: 'Specials & Royal Combos', icon: '🍱', subtitle: 'Hearty, authentic North Indian feast platters' },
    { key: 'drinks', label: 'Refreshing Beverages', icon: '🥛', subtitle: 'Chilled lassis, homestyle chai, and seasonal shakes' }
  ];

  return (
    <section id="menu" className="py-24 bg-[#FAF7F2] text-[#1e1b18] relative">
      {/* Visual background overlay */}
      <div className="absolute inset-0 opacity-4 bg-jaali pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-amber-800 font-mono tracking-widest text-xs uppercase block">✧ Real Ghee Confections ✧</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-amber-950 mt-1">Our Royal Menu</h2>
          </div>
          
          {/* Quick Search bar */}
          <div className="mt-4 md:mt-0 relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search sweets, chaats, or spices..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm"
            />
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
          </div>
        </div>

        {/* Categories Tab Control */}
        <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-thin border-b border-stone-200 mb-8 select-none">
          {['all', 'mithai', 'chaat', 'combos', 'dishes', 'drinks'].map((category) => {
            const label = category === 'all' ? 'All Items' : 
                          category === 'mithai' ? 'Mithai (Sweets)' : 
                          category === 'chaat' ? 'Appetizers & Chaat' : 
                          category === 'combos' ? 'Specials & Combos' :
                          category === 'dishes' ? 'Traditional Dishes' : 'Beverages';
            
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                id={`menu_tab_${category}`}
                onClick={() => {
                  setSelectedCategory(category as any);
                  setSelectedTag('All'); // Reset tag filter on category swap
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-serif font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'bg-amber-950 text-amber-50 shadow-md shadow-amber-950/20' 
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Sub-Filters / Tags row */}
        <div className="flex flex-wrap gap-1.5 mb-8 items-center bg-stone-50 border border-stone-200/50 p-3 rounded-2xl">
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500 mr-2" />
          {allTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                id={`tag_filter_btn_${tag.replace(/[^a-zA-Z]/g, '')}`}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'bg-amber-100 text-amber-850 border border-amber-300 font-semibold' 
                    : 'bg-white border border-stone-200 text-stone-500 hover:border-stone-400'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Empty list search guard */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
            <span className="text-4xl">🍯</span>
            <h3 className="text-xl font-serif font-bold text-amber-950 mt-4">No sweet matches found</h3>
            <p className="text-stone-500 text-sm mt-1 max-w-sm mx-auto">
              We couldn't locate any products with those keywords. Try adjusting your category or tag settings!
            </p>
            <button 
              id="reset_search_btn"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setSelectedTag('All');
              }}
              className="mt-6 px-4 py-2 bg-amber-950 hover:bg-amber-900 text-white font-mono text-xs rounded-xl transition duration-300 shadow"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-20">
            {CATEGORY_ORDER.map((section) => {
              const sectionItems = filteredItems.filter(item => item.category === section.key);
              if (sectionItems.length === 0) return null;

              return (
                <div key={section.key} id={`menu_category_section_${section.key}`} className="scroll-mt-24 space-y-6">
                  {/* Category Header */}
                  <div className="border-b border-amber-900/10 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl filter drop-shadow-sm">{section.icon}</span>
                        <h3 className="text-2xl font-serif font-bold text-amber-950">
                          {section.label}
                        </h3>
                      </div>
                      <p className="text-stone-500 text-sm mt-1 font-serif italic text-amber-800/80">
                        {section.subtitle}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100/60 border border-amber-200/50 px-3.5 py-1 rounded-full w-fit">
                      {sectionItems.length} {sectionItems.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Cards Grid layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                      {sectionItems.map((sweet) => (
                        <motion.div
                          key={sweet.id}
                          id={`menu_card_${sweet.id}`}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          onMouseEnter={() => setHoveredItemId(sweet.id)}
                          onMouseLeave={() => setHoveredItemId(null)}
                          className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                        >
                          {/* Card Thumbnail Area */}
                          <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                            <img 
                              src={sweet.image} 
                              alt={sweet.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Dark gradient blur covering item name */}
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent"></div>

                            {/* Left overlay badge tag */}
                            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                              {sweet.tags.map(tag => (
                                <span 
                                  key={tag}
                                  className="bg-white/95 border border-stone-200/50 backdrop-blur-sm text-stone-900 text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 rounded font-bold shadow-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Numeric rating overlay badge */}
                            <div className="absolute top-4 right-4 bg-amber-500/95 border border-amber-600/30 text-stone-950 text-xs px-2.5 py-1 rounded-lg font-bold font-mono shadow flex items-center gap-1 z-10">
                              <Star className="w-3.5 h-3.5 fill-current text-current" />
                              <span>{sweet.rating}</span>
                            </div>

                            {/* Bottom Floating sweet details banner */}
                            <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-baseline text-white">
                              <span className="text-xs font-mono bg-amber-600/90 text-stone-950 font-bold px-2 py-0.5 rounded shadow">
                                {sweet.category === 'mithai' ? 'MITHAI' : 
                                 sweet.category === 'chaat' ? 'APPETIZER' : 
                                 sweet.category === 'drinks' ? 'BEVERAGE' : 
                                 sweet.category === 'combos' ? 'SPECIAL' : 'DISH'}
                              </span>
                            </div>
                          </div>

                          {/* Card content and description */}
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h3 className="text-xl font-serif font-bold text-amber-950 group-hover:text-amber-800 transition-colors line-clamp-grow">{sweet.name}</h3>
                                <span className="text-2xl">{sweet.emoji || '✨'}</span>
                              </div>
                              <p className="text-stone-500 text-xs mt-2 leading-relaxed line-clamp-3">
                                {sweet.description}
                              </p>

                              {/* Ingredients list pills */}
                              {sweet.ingredients && (
                                <div className="mt-3.5">
                                  <span className="text-[10px] font-mono text-stone-400 block mb-1.5">✦ Highlight ingredients:</span>
                                  <div className="flex flex-wrap gap-1 max-h-[50px] overflow-hidden">
                                    {sweet.ingredients.slice(0, 3).map((ing) => (
                                      <span key={ing} className="bg-stone-50 border border-stone-200 px-2 py-0.5 rounded text-[10px] text-stone-500">
                                        {ing}
                                      </span>
                                    ))}
                                    {sweet.ingredients.length > 3 && (
                                      <span className="text-[9px] font-mono text-stone-400 py-0.5 pl-1">
                                        +{sweet.ingredients.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Card Price & Button row */}
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-100">
                              <div>
                                <span className="text-[10px] text-stone-400 font-mono uppercase block">Estimated cost:</span>
                                <div className="flex items-baseline gap-1 mt-0.5">
                                  <span className="text-lg font-mono font-bold text-amber-800">${sweet.price}</span>
                                  <span className="text-[10px] text-stone-400">/ {sweet.weightText.replace('per ', '')}</span>
                                </div>
                              </div>

                              <button
                                id={`menu_add_btn_${sweet.id}`}
                                onClick={() => onAddSweet(sweet)}
                                className="flex items-center justify-center gap-1.5 px-4.5 py-2 rounded-xl bg-amber-950 hover:bg-amber-850 text-white font-serif font-bold text-xs transition duration-300 shadow active:scale-95 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Add Dish</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
