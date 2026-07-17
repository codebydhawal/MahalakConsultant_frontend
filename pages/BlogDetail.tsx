
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BlogPost } from '../types';

export const BlogDetail: React.FC<{ blogs: BlogPost[] }> = ({ blogs }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogs.find(b => b.id === Number(id));

  if (!blog) return (
    <div className="py-20 text-center">
      <h2 className="text-2xl font-bold">Article not found</h2>
      <button onClick={() => navigate('/blog')} className="mt-4 text-amber-700 underline font-bold">Back to Articles</button>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-24 animate-in fade-in duration-700">
      <div className="relative h-[65vh] bg-stone-900 overflow-hidden">
        <img src={blog.image} className="w-full h-full object-cover opacity-60 scale-105" alt={blog.title} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-950/90"></div>
        <div className="absolute inset-0 flex items-end justify-center pb-20 px-4">
          <div className="max-w-4xl text-center">
             <div className="flex justify-center gap-3 mb-8">
                <span className="px-5 py-1.5 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Article</span>
                <span className="px-5 py-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20">{blog.readingTime}</span>
             </div>
             <h1 className="text-4xl md:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tighter">{blog.title}</h1>
             <div className="flex justify-center items-center gap-8 text-stone-400 text-[11px] font-bold uppercase tracking-[0.3em]">
               <span>{new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
               <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
               <span>By {blog.author}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-20">
        <div className="mb-16">
          <Link to="/blog" className="text-[10px] font-bold uppercase text-stone-400 hover:text-amber-700 flex items-center gap-3 transition-colors">
            <i className="fa-solid fa-arrow-left-long"></i> Return to journals
          </Link>
        </div>
        
        <div className="prose-container">
          <div className="text-2xl text-stone-600 leading-relaxed font-light mb-16 italic border-l-[6px] border-amber-600 pl-10 py-4 bg-stone-50 rounded-r-3xl">
            {blog.excerpt}
          </div>
          
          <div 
            className="rich-text-content text-stone-800 leading-[1.8] text-lg space-y-8"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          ></div>
        </div>

        <div className="mt-24 pt-16 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-10 bg-stone-50 p-10 rounded-[3rem]">
           <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-full bg-stone-200 flex items-center justify-center text-4xl text-stone-400 overflow-hidden shadow-lg border-4 border-white">
                 {blog.authorImage ? (
                   <img src={blog.authorImage} alt={blog.author} className="w-full h-full object-cover" />
                 ) : (
                   <i className="fa-solid fa-user-tie"></i>
                 )}
              </div>
              <div>
                <p className="text-amber-700 text-[10px] uppercase font-bold tracking-[0.3em] mb-2">Editor's Choice</p>
                <p className="font-bold text-2xl text-stone-900">{blog.author}</p>
                <p className="text-stone-400 text-xs font-medium">Principal Design Consultant</p>
              </div>
           </div>
           <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all shadow-sm"><i className="fa-brands fa-facebook-f"></i></button>
              <button className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all shadow-sm"><i className="fa-brands fa-twitter"></i></button>
              <button className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all shadow-sm"><i className="fa-solid fa-share-nodes"></i></button>
           </div>
        </div>
      </div>

      <style>{`
        .rich-text-content h1, .rich-text-content h2, .rich-text-content h3 {
          font-weight: 800;
          color: #1c1917;
          margin-top: 2em;
          margin-bottom: 0.5em;
        }
        .rich-text-content a {
          color: #b45309;
          text-decoration: underline;
          font-weight: 700;
          transition: all 0.3s ease;
        }
        .rich-text-content a:hover {
          color: #78350f;
          opacity: 0.8;
        }
        .rich-text-content img {
          border-radius: 2rem;
          margin: 2.5rem 0;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }
        .rich-text-content table {
          width: 100%;
          border-radius: 1rem;
          overflow: hidden;
          margin: 2rem 0;
        }
        .rich-text-content p {
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
};
