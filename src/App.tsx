import React, { useState } from 'react';
import Hero from './Hero';
import ConstellationEntry from './ConstellationEntry';
import TwoBenchesTimeline from './TwoBenchesTimeline';
import CinemaOfUs from './CinemaOfUs';
import CatSanctuary from './CatSanctuary';
import FlowerGenerator from './FlowerGenerator';
import SweetCorner from './SweetCorner';
import CipherVault from './CipherVault';

const SafeBadge = () => (
  <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 flex flex-col items-center justify-center z-50 opacity-60 hover:opacity-100 transition-opacity duration-700 pointer-events-auto cursor-default">
     <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border border-[#E8DCC4]/20 flex items-center justify-center relative shadow-[0_0_20px_rgba(0,0,0,0.8)] bg-[#330000]/60 backdrop-blur-md">
       <svg viewBox="0 0 120 120" className="w-full h-full absolute inset-0 animate-[spin_20s_linear_infinite]">
         <path id="sealPath" d="M 60 15 A 45 45 0 1 1 59.9 15" fill="none" />
         <text className="text-[10px] uppercase tracking-[0.25em] fill-[#E8DCC4] font-sans font-light">
           <textPath href="#sealPath" startOffset="0%" textLength="280" lengthAdjust="spacing">
             SAFEGUARDED • NO INSECTS ALLOWED • 
           </textPath>
         </text>
       </svg>
       {/* Inner minimal shield icon */}
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8DCC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
       </svg>
     </div>
  </div>
);

function App() {
  const [isConstellationSolved, setIsConstellationSolved] = useState(false);

  return (
    <div className="bg-[#111] min-h-screen">
      {!isConstellationSolved && (
        <ConstellationEntry onComplete={() => setIsConstellationSolved(true)} />
      )}

      {isConstellationSolved && (
        <div className="flex flex-col w-full h-full">
        <section className="h-screen relative">
          <Hero />
        </section>
        
        <section className="h-screen relative border-t border-[#330000]">
          <TwoBenchesTimeline />
        </section>

        <section className="h-screen relative border-t border-[#330000]">
          <CinemaOfUs />
        </section>

        <section className="h-screen relative border-t border-[#330000]">
          <CatSanctuary />
        </section>

        <section className="h-screen relative border-t border-[#330000]">
          <FlowerGenerator />
        </section>

        <section className="h-screen relative border-t border-[#330000]">
          <SweetCorner />
        </section>

        <section className="h-screen relative border-t border-[#330000]">
          <CipherVault />
        </section>
      </div>
      )}

      {/* Global Insect Defense Badge fixed to the viewport */}
      <SafeBadge />
    </div>
  );
}

export default App;
