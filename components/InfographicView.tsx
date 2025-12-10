import React, { useRef } from 'react';
import { InfographicData } from '../types';
import IconMapper from './IconMapper';
import { ArrowRight } from 'lucide-react';

interface InfographicViewProps {
  data: InfographicData;
  backgroundImageUrl: string | null;
}

const InfographicView: React.FC<InfographicViewProps> = ({ data, backgroundImageUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    points = [],
    topic = "",
    subtitle = "",
    summary = "",
    layoutStyle = 'GRID_CARDS',
  } = data;

  // ---- FIX MÀU: colorPalette là string[] → chuyển thành object
  const defaultColors = ["#4f46e5", "#6366f1", "#ffffff", "#1f2937", "#fbbf24"];

  const safePalette = [...defaultColors];
  data.colorPalette?.forEach((c, i) => {
    if (c && typeof c === "string") safePalette[i] = c;
  });

  const [primary, secondary, background, text, accent] = safePalette;

  // ---- HEADER ----
  const Header = () => (
    <header className="relative z-10 w-full p-10 pb-4 text-center">
      <div className="flex justify-between items-start absolute top-8 left-8 right-8">
        <div 
          className="px-6 py-2 rounded-lg font-bold text-sm tracking-widest uppercase shadow-lg bg-white/90 backdrop-blur border-l-4" 
          style={{ color: primary, borderColor: accent }}
        >
          Designed by: THAYHUY - DANANG
        </div>
      </div>
      
      <div className="mt-8 max-w-5xl mx-auto">
        <h1 
          className="text-6xl md:text-7xl font-heading font-extrabold mb-4 uppercase drop-shadow-md leading-tight tracking-tight" 
          style={{ 
            color: primary,
            textShadow: '2px 2px 0px #ffffff'
          }}
        >
          {topic}
        </h1>

        <div className="h-1.5 w-48 mx-auto rounded-full mb-4 opacity-80" 
             style={{ backgroundColor: accent }}
        />

        {subtitle && (
          <p className="text-2xl md:text-3xl font-medium italic" style={{ color: text }}>
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );

  // ---- FOOTER ----
  const Footer = () => (
    <footer className="relative z-10 w-full p-8 pt-0 pb-10 flex justify-center">
      <div 
        className="rounded-full px-8 py-4 shadow-xl border-2 backdrop-blur-xl bg-white/80 flex items-center gap-4 max-w-4xl"
        style={{ borderColor: accent }}
      >
        <div className="p-2 rounded-full bg-yellow-100 flex-shrink-0">
          <IconMapper iconName="lightbulb" className="w-8 h-8 text-yellow-600" />
        </div>
        {summary && (
          <p className="text-xl font-semibold text-slate-800 italic">"{summary}"</p>
        )}
      </div>
    </footer>
  );

  // ---- GRID LAYOUT ----
  const renderGridCards = () => {
    const gridClasses = points.length <= 3 ? 'grid-cols-3' : 'grid-cols-2';
    return (
      <main className={`relative z-10 flex-grow px-16 py-8 grid ${gridClasses} gap-x-12 gap-y-10`}>
        {points.map((point, index) => (
          <div key={index} className="relative h-full flex flex-col group">

            <div className="flex-grow flex flex-col rounded-3xl overflow-hidden shadow-xl border-2 transition-all duration-300 hover:scale-[1.02] bg-white">
              
              {/* Header */}
              <div 
                className="p-5 flex items-center gap-4 relative"
                style={{ background: `linear-gradient(90deg, ${index % 2 === 0 ? primary : secondary} 0%, ${accent} 150%)` }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <span className="font-bold text-2xl">{index + 1}</span>
                </div>

                <h3 className="text-2xl font-bold text-white uppercase tracking-wide flex-grow">
                  {point.title}
                </h3>

                <IconMapper iconName={point.icon ?? ""} className="w-9 h-9 text-white" />
              </div>

              {/* Body */}
              <div className="p-8 bg-white/95">
                <p className="text-xl text-slate-700">{point.content}</p>
              </div>
            </div>

            {/* Arrow */}
            {index < points.length - 1 && (
              <div className="absolute -right-9 top-1/2 hidden lg:block opacity-40">
                 <ArrowRight size={32} color={text} />
              </div>
            )}
          </div>
        ))}
      </main>
    );
  };

  // ---- CONNECTED FLOW ----
  const renderConnectedFlow = () => (
    <main className="relative z-10 flex-grow px-12 py-8">
      <div className="flex flex-wrap justify-center gap-8">
        {points.map((point, index) => (
          <div key={index} className="flex items-center gap-4">
            
            <div className="w-80 text-center">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl mb-6 border-4 border-white"
                style={{ backgroundColor: index % 2 === 0 ? primary : secondary }}
              >
                <IconMapper iconName={point.icon ?? ""} className="w-12 h-12 text-white" />
              </div>

              <div className="bg-white/90 p-6 rounded-2xl shadow-lg border-b-4"
                  style={{ borderColor: accent }}>
                <h3 className="text-xl font-bold mb-3 uppercase" style={{ color: primary }}>
                  {point.title}
                </h3>
                <p className="text-lg text-slate-600">{point.content}</p>
              </div>
            </div>

            {index < points.length - 1 && (
              <ArrowRight size={48} color={accent} className="hidden xl:block opacity-60" />
            )}

          </div>
        ))}
      </div>
    </main>
  );

  // ---- ZIGZAG ----
  const renderZigZagTimeline = () => (
    <main className="relative z-10 flex-grow px-20 py-8">
      <div className="relative">
        <div className="absolute left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 rounded-full opacity-30"
             style={{ backgroundColor: text }} />

        <div className="flex flex-col gap-8">
          {points.map((point, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div key={index} className={`flex items-center gap-12 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                
                {/* Box */}
                <div className="flex-1">
                   <div className="inline-block p-6 rounded-3xl bg-white/95 shadow-xl border-t-4 max-w-2xl"
                        style={{ borderColor: primary }}>
                      <h3 className="text-2xl font-bold mb-2 uppercase" style={{ color: secondary }}>
                        {point.title}
                      </h3>
                      <p className="text-xl text-slate-700">{point.content}</p>
                   </div>
                </div>

                {/* Node */}
                <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl"
                     style={{ backgroundColor: accent }}>
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="flex-1">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/30 border-2 border-white/50">
                     <IconMapper iconName={point.icon ?? ""} className="w-12 h-12" color={text} />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </main>
  );

  return (
    <div className="w-full flex justify-center items-center p-4 bg-gray-200 overflow-auto">
      <div 
        ref={containerRef}
        className="relative aspect-video w-full max-w-[1920px] overflow-hidden flex flex-col shadow-2xl"
        style={{ backgroundColor: background }}
      >

        {/* Background */}
        {backgroundImageUrl ? (
          <div className="absolute inset-0 bg-cover bg-center opacity-40"
               style={{ backgroundImage: `url(${backgroundImageUrl})` }} />
        ) : (
          <div className="absolute inset-0 opacity-30"
               style={{
                 background: `
                   radial-gradient(circle at 10% 20%, ${primary}22 0%, transparent 40%),
                   radial-gradient(circle at 90% 80%, ${secondary}22 0%, transparent 40%)
                 `
               }} />
        )}

        <Header />

        {layoutStyle === "GRID_CARDS" && renderGridCards()}
        {layoutStyle === "CONNECTED_FLOW" && renderConnectedFlow()}
        {layoutStyle === "ZIGZAG_TIMELINE" && renderZigZagTimeline()}

        <Footer />

      </div>
    </div>
  );
};

export default InfographicView;
