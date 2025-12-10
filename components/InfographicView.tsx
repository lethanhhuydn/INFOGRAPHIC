import React, { useRef } from 'react';
import { InfographicData, LayoutStyle } from '../types';
import IconMapper from './IconMapper';
import { ArrowRight, ArrowDown } from 'lucide-react';

interface InfographicViewProps {
  data: InfographicData;
  backgroundImageUrl: string | null;
}

const InfographicView: React.FC<InfographicViewProps> = ({ data, backgroundImageUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { colorPalette, points, topic, subtitle, summary, layoutStyle = 'GRID_CARDS' } = data;

  // Common Header Component
  const Header = ({ className = "" }: { className?: string }) => (
    <header className={`relative z-10 w-full p-10 pb-4 text-center ${className}`}>
      <div className="flex justify-between items-start absolute top-8 left-8 right-8">
        <div 
          className="px-6 py-2 rounded-lg font-bold text-sm tracking-widest uppercase shadow-lg bg-white/90 backdrop-blur border-l-4" 
          style={{ color: colorPalette.primary, borderColor: colorPalette.accent }}
        >
          Designed by: THAYHUY - DANANG
        </div>
      </div>
      
      <div className="mt-8 max-w-5xl mx-auto">
        <h1 
          className="text-6xl md:text-7xl font-heading font-extrabold mb-4 uppercase drop-shadow-md leading-tight tracking-tight" 
          style={{ 
            color: colorPalette.primary,
            textShadow: '2px 2px 0px #ffffff'
          }}
        >
          {topic}
        </h1>
        <div className="h-1.5 w-48 mx-auto rounded-full mb-4 opacity-80" style={{ backgroundColor: colorPalette.accent }}></div>
        <p className="text-2xl md:text-3xl font-medium italic" style={{ color: colorPalette.text }}>
          {subtitle}
        </p>
      </div>
    </header>
  );

  // Common Footer Component
  const Footer = () => (
    <footer className="relative z-10 w-full p-8 pt-0 pb-10 flex justify-center">
      <div 
        className="rounded-full px-8 py-4 shadow-xl border-2 backdrop-blur-xl bg-white/80 flex items-center gap-4 max-w-4xl"
        style={{ borderColor: colorPalette.accent }}
      >
        <div className="p-2 rounded-full bg-yellow-100 flex-shrink-0">
          <IconMapper iconName="lightbulb" className="w-8 h-8 text-yellow-600" />
        </div>
        <p className="text-xl font-semibold text-slate-800 italic">
          "{summary}"
        </p>
      </div>
    </footer>
  );

  // --- LAYOUT 1: GRID CARDS (Classic, Structured) ---
  const renderGridCards = () => {
    const gridClasses = points.length <= 3 ? 'grid-cols-3' : 'grid-cols-2';
    return (
      <main className={`relative z-10 flex-grow px-16 py-8 grid ${gridClasses} gap-x-12 gap-y-10 items-stretch`}>
        {points.map((point, index) => (
          <div key={index} className="relative h-full flex flex-col group">
            <div className="flex-grow flex flex-col rounded-3xl overflow-hidden shadow-xl border-2 transition-all duration-300 hover:scale-[1.02] bg-white">
              {/* Header Bar */}
              <div 
                className="p-5 flex items-center gap-4 relative overflow-hidden"
                style={{ background: `linear-gradient(90deg, ${index % 2 === 0 ? colorPalette.primary : colorPalette.secondary} 0%, ${colorPalette.accent} 150%)` }}
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md border border-white/30 shadow-inner">
                  <span className="font-bold text-2xl font-heading">{index + 1}</span>
                </div>
                <h3 className="text-2xl font-bold text-white uppercase tracking-wide flex-grow leading-tight drop-shadow-sm">
                  {point.title}
                </h3>
                <IconMapper iconName={point.icon} className="w-9 h-9 text-white/90" />
              </div>
              {/* Body */}
              <div className="p-8 flex-grow flex flex-col justify-center bg-white/95">
                <p className="text-xl leading-relaxed font-medium text-slate-700">
                  {point.content}
                </p>
              </div>
            </div>
            {/* Connector arrow just for decoration */}
            {index < points.length - 1 && (
              <div className="absolute -right-9 top-1/2 hidden lg:block opacity-40">
                 <ArrowRight size={32} color={colorPalette.text} />
              </div>
            )}
          </div>
        ))}
      </main>
    );
  };

  // --- LAYOUT 2: CONNECTED FLOW (Horizontal Process) ---
  const renderConnectedFlow = () => {
    return (
      <main className="relative z-10 flex-grow px-12 py-8 flex flex-col justify-center">
        <div className="flex flex-wrap justify-center gap-8 items-start">
          {points.map((point, index) => (
            <div key={index} className="flex items-center gap-4">
               {/* The Node */}
               <div className="w-80 flex flex-col items-center text-center">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl mb-6 relative z-10 border-4 border-white transition-transform hover:rotate-12"
                    style={{ backgroundColor: index % 2 === 0 ? colorPalette.primary : colorPalette.secondary }}
                  >
                     <IconMapper iconName={point.icon} className="w-12 h-12 text-white" />
                     <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center font-bold border-2 border-white">
                        {index + 1}
                     </div>
                  </div>
                  
                  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-b-4 w-full" style={{ borderColor: colorPalette.accent }}>
                     <h3 className="text-xl font-bold mb-3 uppercase" style={{ color: colorPalette.primary }}>
                        {point.title}
                     </h3>
                     <p className="text-lg leading-snug text-slate-600 font-medium">
                        {point.content}
                     </p>
                  </div>
               </div>

               {/* The Arrow (except last) */}
               {index < points.length - 1 && (
                  <div className="hidden xl:block pt-8 opacity-60">
                     <ArrowRight size={48} color={colorPalette.accent} strokeWidth={3} />
                  </div>
               )}
            </div>
          ))}
        </div>
      </main>
    );
  };

  // --- LAYOUT 3: ZIGZAG TIMELINE (Narrative feel) ---
  const renderZigZagTimeline = () => {
    return (
      <main className="relative z-10 flex-grow px-20 py-8">
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 rounded-full opacity-30" style={{ backgroundColor: colorPalette.text }}></div>
          
          <div className="flex flex-col gap-8">
            {points.map((point, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div key={index} className={`flex items-center gap-12 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                  
                  {/* Content Box */}
                  <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'}`}>
                     <div 
                        className="inline-block p-6 rounded-3xl bg-white/95 shadow-xl border-t-4 max-w-2xl transform transition-transform hover:scale-105"
                        style={{ borderColor: colorPalette.primary }}
                     >
                        <h3 className="text-2xl font-bold mb-2 uppercase tracking-wide" style={{ color: colorPalette.secondary }}>
                           {point.title}
                        </h3>
                        <p className="text-xl font-medium text-slate-700">
                           {point.content}
                        </p>
                     </div>
                  </div>

                  {/* Center Node */}
                  <div className="relative z-10 flex-shrink-0">
                     <div 
                        className="w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-2xl"
                        style={{ backgroundColor: colorPalette.accent }}
                     >
                        {index + 1}
                     </div>
                  </div>

                  {/* Icon/Visual Side */}
                  <div className={`flex-1 ${isLeft ? 'text-left' : 'text-right'}`}>
                      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/30 backdrop-blur-sm border-2 border-white/50 shadow-sm ${isLeft ? '' : 'ml-auto'}`}>
                         <IconMapper iconName={point.icon} className="w-12 h-12" color={colorPalette.text} />
                      </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    );
  };

  return (
    <div className="w-full flex justify-center items-center p-4 bg-gray-200 overflow-auto">
      <div 
        ref={containerRef}
        className="relative aspect-video w-full max-w-[1920px] shadow-2xl overflow-hidden flex flex-col font-sans"
        style={{
          backgroundColor: backgroundImageUrl ? 'transparent' : colorPalette.background,
        }}
      >
        {/* Dynamic Backgrounds */}
        {backgroundImageUrl ? (
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center opacity-40 transition-opacity duration-1000"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          />
        ) : (
          <div 
            className="absolute inset-0 z-0 opacity-40"
            style={{
               background: `
                  radial-gradient(circle at 10% 20%, ${colorPalette.primary}22 0%, transparent 40%),
                  radial-gradient(circle at 90% 80%, ${colorPalette.secondary}22 0%, transparent 40%)
               `
            }}
          />
        )}
        
        {/* Subtle Texture Overlay */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: 'radial-gradient(#00000011 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        <Header />

        {layoutStyle === 'GRID_CARDS' && renderGridCards()}
        {layoutStyle === 'CONNECTED_FLOW' && renderConnectedFlow()}
        {layoutStyle === 'ZIGZAG_TIMELINE' && renderZigZagTimeline()}

        <Footer />
      </div>
    </div>
  );
};

export default InfographicView;
