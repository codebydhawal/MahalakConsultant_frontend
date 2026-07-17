
import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';

export const Blog: React.FC<{ blogs: BlogPost[] }> = ({ blogs }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-32 overflow-x-hidden">
      <div className="mb-24 text-center px-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700 mb-6">Our Journals</h2>
        <h1 className="text-5xl md:text-7xl font-bold text-stone-900 mb-4 tracking-tighter">Wisdom & Innovation</h1>
        <p className="text-stone-400 text-lg max-w-xl mx-auto font-light">Insights from leading architects, Vastu masters, and engineers.</p>
      </div>

      {/* Mobile Slider Grid */}
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-16 overflow-x-auto md:overflow-visible no-scrollbar -mx-4 px-8 pb-10 snap-x snap-mandatory">
        {blogs.map(post => (
          <Link to={`/blog/${post.id}`} key={post.id} className="group flex flex-col shrink-0 w-[320px] sm:w-[380px] md:w-auto snap-center">
            <div className="overflow-hidden rounded-[2.5rem] mb-10 aspect-[16/10] bg-stone-100 shadow-xl group-hover:shadow-amber-700/10 transition-all">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="flex items-center text-[10px] text-amber-700 font-bold uppercase tracking-widest mb-4 gap-4">
              <span>{post.date}</span>
              <span className="w-1 h-1 bg-amber-700 rounded-full"></span>
              <span>5 Min Read</span>
            </div>
            <h2 className="text-3xl font-bold text-stone-900 mb-4 group-hover:text-amber-700 transition-colors leading-tight">{post.title}</h2>
            <p className="text-stone-500 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">{post.excerpt}</p>
            <div className="mt-auto text-xs font-bold uppercase tracking-widest text-stone-900 flex items-center gap-3">
              Explore Story <i className="fa-solid fa-arrow-right-long transition-transform group-hover:translate-x-2"></i>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};