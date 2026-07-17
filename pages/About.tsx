
import React from 'react';
import { SiteConfig, TeamMember } from '../types';

export const About: React.FC<{ config: SiteConfig, team: TeamMember[] }> = ({ config, team }) => {
  // Sort team members by 'order' property. Members without 'order' appear last.
  const sortedTeam = [...team].sort((a, b) => (a.order || 999) - (b.order || 999));

  return (
    <div className="animate-in fade-in duration-700">
      <section className="relative h-[50vh] bg-stone-900 flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 text-center px-4">
           <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">Our Mission.</h1>
           <p className="text-stone-400 text-lg font-light tracking-[0.2em] uppercase">Designing with purpose</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-8">{config.aboutTitle}</h2>
            <div className="w-20 h-1 bg-amber-700 mx-auto mb-10" style={{ backgroundColor: config.accentColor }}></div>
          </div>
          <div className="rich-text-content text-stone-600 leading-relaxed text-lg text-center" dangerouslySetInnerHTML={{ __html: config.aboutDescription }}></div>
        </div>
      </section>

      <section className="py-24 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700 mb-6" style={{ color: config.accentColor }}>Core Team</h2>
            <h3 className="text-4xl font-bold">The Visionaries</h3>
          </div>
          
          <div className="flex flex-col gap-12">
            {sortedTeam.map((member) => (
              <div key={member.id} className="group bg-white p-10 md:p-16 rounded-[3rem] md:rounded-[4rem] shadow-sm hover:shadow-xl transition-all border border-stone-100 flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16">
                <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full overflow-hidden border-8 border-stone-50 transition-transform duration-700 group-hover:scale-105 shadow-inner">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-bold text-stone-900">{member.name}</h3>
                  <p className="text-amber-700 font-bold text-sm uppercase tracking-widest mt-2 mb-8" style={{ color: config.accentColor }}>{member.role}</p>
                  <div className="text-stone-500 text-lg leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: member.bio || 'Architectural expert focused on sustainable and balanced design solutions.' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
