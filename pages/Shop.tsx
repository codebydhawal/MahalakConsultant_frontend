
import React, { useState } from 'react';
import { Product } from '../types';

interface ShopProps {
  products: Product[];
  addToCart: (product: Product) => void;
  user: any;
}

export const Shop: React.FC<ShopProps> = ({ products, addToCart, user }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Vastu' | 'Interior' | 'Decor'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700 overflow-x-hidden">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 px-4">
        <div>
          <h1 className="text-5xl font-bold text-stone-900 tracking-tight">ArchiVastu Shop</h1>
          <p className="text-stone-500 mt-3 text-lg font-light">Energy-aligned artifacts for your space.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"></i>
            <input 
              type="text" 
              placeholder="Find artifacts..."
              className="pl-12 pr-6 py-4 bg-white border border-stone-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-amber-500 outline-none w-full min-w-[280px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Mobile Tab Slider */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {(['All', 'Vastu', 'Interior', 'Decor'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest rounded-2xl transition-all shrink-0 ${activeCategory === cat ? 'bg-amber-700 text-white shadow-xl' : 'bg-white border border-stone-100 text-stone-500 hover:bg-stone-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Slider Grid */}
      <div className="flex lg:grid lg:grid-cols-4 gap-10 overflow-x-auto lg:overflow-visible no-scrollbar -mx-4 px-8 pb-10 snap-x snap-mandatory">
        {filtered.map(product => (
          <div 
            key={product.id} 
            className="bg-white border border-stone-50 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all group flex flex-col relative shrink-0 w-[280px] sm:w-[320px] lg:w-auto snap-center"
          >
            <div 
              className="relative aspect-square bg-stone-50 overflow-hidden cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              {!product.inStock && (
                <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="px-5 py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Sold Out</span>
                </div>
              )}
            </div>
            <div className="p-8 flex-grow flex flex-col">
              <span className="text-[9px] font-bold uppercase text-stone-400 tracking-[0.2em] mb-2">{product.category}</span>
              <h3 className="font-bold text-stone-800 text-xl mb-4 group-hover:text-amber-700 transition-colors">{product.name}</h3>
              
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${product.inStock ? 'text-emerald-600' : 'text-red-600'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-50">
                <span className="text-xl font-bold text-stone-900">₹{product.price.toLocaleString()}</span>
                <button 
                  disabled={!product.inStock}
                  onClick={() => addToCart(product)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${product.inStock ? 'bg-stone-900 text-white hover:bg-amber-700' : 'bg-stone-100 text-stone-400 cursor-not-allowed'}`}
                >
                  {user ? 'Add to Bag' : 'Login to Buy'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FIXED Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10 bg-stone-950/90 backdrop-blur-xl animate-in zoom-in-95 duration-300">
           <div className="bg-white max-w-5xl w-full max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-6 right-6 w-12 h-12 bg-stone-100/80 backdrop-blur-sm rounded-full flex items-center justify-center z-50 hover:bg-stone-200 transition-colors shadow-lg"
              >
                <i className="fa-solid fa-xmark text-stone-900"></i>
              </button>
              
              <div className="md:w-1/2 shrink-0 h-64 md:h-auto overflow-hidden">
                <img src={selectedProduct.image} className="w-full h-full object-cover" />
              </div>
              
              <div className="md:w-1/2 p-8 md:p-16 overflow-y-auto bg-white flex flex-col">
                <button onClick={() => setSelectedProduct(null)} className="text-[10px] font-bold uppercase text-stone-400 mb-6 hover:text-amber-700 flex items-center gap-2">
                  <i className="fa-solid fa-arrow-left"></i> Back to shop
                </button>
                <span className="text-amber-700 text-xs font-bold uppercase tracking-widest mb-3">{selectedProduct.category}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">{selectedProduct.name}</h2>
                <div className="flex items-center gap-3 mb-6">
                  <p className="text-2xl font-bold text-stone-900">₹{selectedProduct.price.toLocaleString()}</p>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${selectedProduct.inStock ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {selectedProduct.inStock ? 'Available' : 'Sold Out'}
                  </span>
                </div>
                
                <div 
                  className="rich-text-content prose prose-stone text-stone-600 mb-8" 
                  dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                ></div>

                <div className="mt-auto pt-8 border-t border-stone-100">
                  <button 
                    disabled={!selectedProduct.inStock}
                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-lg transition-all ${selectedProduct.inStock ? 'bg-stone-900 text-white hover:bg-amber-700 shadow-xl' : 'bg-stone-100 text-stone-400 cursor-not-allowed'}`}
                  >
                    {!user ? 'Please Login to Purchase' : (selectedProduct.inStock ? 'Add to Shopping Bag' : 'Out of Stock')}
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
