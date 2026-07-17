
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project, BlogPost, MediaItem, SiteConfig, Testimonial } from '../types';

export const Home: React.FC<{ projects: Project[], blogs: BlogPost[], media: MediaItem[], testimonials: Testimonial[], config: SiteConfig }> = ({ projects, blogs, media, testimonials, config }) => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  const services = [
    { title: 'Vastu Consultancy', icon: 'fa-compass', desc: 'Alignment of energy for prosperity.', fullDesc: 'Our Vastu experts use scientific tools to map energy fields and suggest corrections that bring peace and professional growth.', color: 'bg-amber-50', isVastu: true },
    { title: 'Interior Design', icon: 'fa-couch', desc: 'Bespoke spaces for luxury living.', fullDesc: 'Creating interiors that reflect your personality while maintaining maximum functionality and aesthetic appeal.', color: 'bg-stone-50' },
    { title: 'Architecture', icon: 'fa-city', desc: 'Modern structures with classic roots.', fullDesc: 'Sustainable architectural planning that stands the test of time, blending modern tech with timeless principles.', color: 'bg-stone-100' },
    { title: 'Civil Engineering', icon: 'fa-trowel-bricks', desc: 'Precision and safety in every beam.', fullDesc: 'Expert structural engineering ensuring safety, durability, and cost-effective construction for your projects.', color: 'bg-stone-200' },
    { title: 'Sustainable Design', icon: 'fa-leaf', desc: 'Eco-friendly and green building solutions.', fullDesc: 'Implementing solar, water recycling, and natural ventilation to create homes that are kind to the earth.', color: 'bg-emerald-50' },
  ];

  const nextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  useEffect(() => {
    const timer = setInterval(nextProject, 5000);
    return () => clearInterval(timer);
  }, [projects.length]);

  return (
    <div className="animate-in fade-in duration-1000 overflow-x-hidden">
      <section className="relative h-screen flex items-center overflow-hidden bg-stone-900 pt-24 md:pt-0">
        <div className="absolute inset-0 z-0">
          {config.heroMediaType === 'video' ? (
            <video 
              src={config.heroMediaUrl} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-40"
            />
          ) : (
            <img 
              src={config.heroMediaUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"} 
              alt="Hero" 
              className="w-full h-full object-cover opacity-40" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-4xl">
            <h1 className={`${config.headingFontSize} text-white mb-8 font-bold leading-tight`}>A balance of  <br/><span className="italic font-light text-stone-400">sustainability, beauty & positive energy</span></h1>
            <Link to="/portfolio" className="inline-block px-10 py-4 bg-amber-700 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-xl" style={{ backgroundColor: config.accentColor }}>Explore Portfolio</Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700 mb-6" style={{ color: config.accentColor }}>Legacy & Philosophy</h2>
              <h3 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-6 leading-tight">{config.aboutTitle}</h3>
              <p className="text-stone-500 text-lg leading-relaxed mb-12" dangerouslySetInnerHTML={{ __html: config.shortIntro }}></p>
              
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                <div className="p-6 md:p-8 bg-stone-50 rounded-3xl border border-stone-100 hover:shadow-lg transition-shadow">
                  <p className="text-3xl md:text-4xl font-bold text-amber-700 mb-1" style={{ color: config.accentColor }}>{config.statYearsExp}</p>
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Years of Leadership</p>
                </div>
                <div className="p-6 md:p-8 bg-stone-50 rounded-3xl border border-stone-100 hover:shadow-lg transition-shadow">
                  <p className="text-3xl md:text-4xl font-bold text-stone-900 mb-1">{config.statProjectsDone}</p>
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Total Projects</p>
                </div>
                <div className="p-6 md:p-8 bg-stone-50 rounded-3xl border border-stone-100 hover:shadow-lg transition-shadow">
                  <p className="text-3xl md:text-4xl font-bold text-amber-700 mb-1" style={{ color: config.accentColor }}>{config.statVastuExp}</p>
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Years Vastu Expertise</p>
                </div>
                <div className="p-6 md:p-8 bg-stone-50 rounded-3xl border border-stone-100 hover:shadow-lg transition-shadow">
                  <p className="text-3xl md:text-4xl font-bold text-stone-900 mb-1">{config.statVastuAudits}</p>
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Vastu Audits</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="relative aspect-[4/5] w-full rounded-[3rem] overflow-hidden shadow-2xl">
                <img src={config.legacyImage} className="w-full h-full object-cover" alt="Legacy" />
                <div className="absolute inset-0 border-[12px] border-white/10 rounded-[3rem] pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-stone-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-bold text-stone-900">Comprehensive Design Solutions</h3>
            <div className="w-20 h-1 bg-amber-700 mx-auto mt-6" style={{ backgroundColor: config.accentColor }}></div>
          </div>
          <div className="flex lg:grid lg:grid-cols-5 gap-6 overflow-x-auto lg:overflow-visible no-scrollbar pb-10 -mx-4 px-4 snap-x snap-mandatory">
            {services.map((s, idx) => (
              <div 
                key={idx} 
                className={`${s.color} p-10 rounded-[2.5rem] border border-white hover:-translate-y-2 transition-all cursor-pointer group flex flex-col items-center text-center shrink-0 w-[280px] sm:w-[320px] lg:w-auto snap-center`}
                onClick={() => {
                   if (s.isVastu) {
                     window.open(config.vastuRedirectUrl, '_blank');
                   } else {
                     setSelectedService(s);
                   }
                }}
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl text-amber-700 mb-8 group-hover:bg-amber-700 group-hover:text-white transition-all shadow-sm">
                  <i className={`fa-solid ${s.icon}`}></i>
                </div>
                <h4 className="font-bold text-xl mb-4 text-stone-900">{s.title}</h4>
                <p className="text-stone-500 text-xs leading-relaxed mb-6">{s.desc}</p>
                <span className="mt-auto text-[10px] font-bold uppercase tracking-widest text-amber-700 group-hover:underline" style={{ color: config.accentColor }}>
                  {s.isVastu ? 'Go to Consultation →' : 'Know More +'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="text-left">
                <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700 mb-4" style={{ color: config.accentColor }}>Project Showcase</h2>
                <h3 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-none">Curation of <br/><span className="italic font-light text-stone-400">Masterpieces.</span></h3>
              </div>
              <div className="flex gap-4">
                <button onClick={prevProject} className="w-16 h-16 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-900 hover:text-white transition-all">
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <button onClick={nextProject} className="w-16 h-16 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-900 hover:text-white transition-all">
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>

            <div className="relative aspect-[16/7] md:aspect-[21/9] rounded-[3.5rem] overflow-hidden shadow-2xl group">
              {projects.map((project, index) => (
                <div 
                  key={project.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentProjectIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-12 md:p-20">
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-[0.3em] mb-4">{project.category}</span>
                    <h4 className="text-white text-3xl md:text-5xl font-bold mb-6 tracking-tight">{project.title}</h4>
                    <Link to="/portfolio" className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:translate-x-2 transition-transform">
                      View Project Details <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              ))}
              
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {projects.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentProjectIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${idx === currentProjectIndex ? 'w-12 bg-white' : 'w-3 bg-white/30 hover:bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {selectedService && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white max-w-lg w-full rounded-[2.5rem] p-12 relative shadow-2xl animate-in zoom-in-95 duration-300">
              <button onClick={() => setSelectedService(null)} className="absolute top-6 right-6 w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-2xl text-amber-700 mb-8">
                <i className={`fa-solid ${selectedService.icon}`}></i>
              </div>
              <h3 className="text-3xl font-bold mb-6">{selectedService.title}</h3>
              <p className="text-stone-500 text-lg leading-relaxed mb-8">{selectedService.fullDesc}</p>
              <Link to="/contact" className="block w-full py-4 bg-stone-900 text-white text-center rounded-xl font-bold hover:bg-stone-800 transition-all">Enquire Now</Link>
           </div>
        </div>
      )}

      <section className="py-24 bg-white border-t border-stone-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-16">Insights from the Studio</h3>
          <div className="flex md:grid md:grid-cols-3 gap-10 overflow-x-auto md:overflow-visible no-scrollbar -mx-4 px-4 snap-x snap-mandatory">
            {media.map(item => (
              <a href={item.link} target="_blank" rel="noopener noreferrer" key={item.id} className="group shrink-0 w-[300px] md:w-auto snap-center">
                <div className="relative aspect-video rounded-3xl overflow-hidden mb-8 shadow-lg">
                  <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/40 transition-all flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                      <i className={`fa-solid ${item.type === 'video' ? 'fa-play' : 'fa-microphone'} text-xl`}></i>
                    </div>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-stone-900 group-hover:text-amber-700 transition-colors">{item.title}</h4>
                <p className="text-stone-400 text-xs uppercase font-bold tracking-widest mt-3">{item.type}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="py-24 bg-stone-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700 mb-6" style={{ color: config.accentColor }}>Client Stories</h2>
              <h3 className="text-4xl font-bold">Trusted by Visionaries</h3>
            </div>
            <div className="flex lg:grid lg:grid-cols-3 gap-8 overflow-x-auto lg:overflow-visible no-scrollbar -mx-4 px-4 pb-10 snap-x snap-mandatory">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-stone-100 shrink-0 w-[320px] md:w-auto snap-center flex flex-col">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-stone-50 shrink-0 shadow-sm">
                      <img src={t.clientImage} alt={t.clientName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900">{t.clientName}</h4>
                      <p className="text-[10px] uppercase font-bold text-amber-700 tracking-widest" style={{ color: config.accentColor }}>{t.clientCity}</p>
                    </div>
                  </div>
                  <div className="rich-text-content text-stone-500 italic text-sm leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.message }}></div>
                  <div className="mt-auto flex gap-1 text-amber-400 text-[10px]">
                    {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto bg-stone-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
           <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tighter">Ready to Build Your Legacy?</h2>
           <Link to="/contact" className="inline-block px-12 py-5 bg-amber-700 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg" style={{ backgroundColor: config.accentColor }}>Book a Session Today</Link>
        </div>
      </section>
    </div>
  );
};
