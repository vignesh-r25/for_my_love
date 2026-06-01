import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FinalLetter from './FinalLetter';

const KnotSVG = ({ progress }: { progress: number }) => {
  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8 flex items-center justify-center">
      {/* Background glow that intensifies with progress */}
      <motion.div 
        className="absolute w-32 h-32 rounded-full bg-[#E8DCC4] blur-[50px] mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: progress * 0.2 }}
        transition={{ duration: 1 }}
      />
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(232,220,196,0.6)]">
        <motion.path
          // The elongated infinity loop
          d="M10 55 C10 35, 35 35, 50 55 C65 75, 90 75, 90 55 C90 35, 65 35, 50 55 C35 75, 10 75, 10 55 Z"
          fill="none"
          stroke="#E8DCC4"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 1, opacity: 0.8 }}
          animate={{ 
            pathLength: progress === 3 ? 0 : 1,
            opacity: progress === 3 ? 0 : 0.8,
            strokeWidth: progress > 0 ? 2.5 + (progress * 0.4) : 2.5
          }}
          transition={{ duration: progress === 3 ? 2.5 : 0.8, ease: "easeInOut" }}
        />
        <motion.path
          // The large overlapping heart
          d="M50 30 C35 10, 10 20, 20 50 C30 80, 50 95, 50 95 C50 95, 70 80, 80 50 C90 20, 65 10, 50 30 Z"
          fill="none"
          stroke="#E8DCC4"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 1, opacity: 0.8 }}
          animate={{ 
            pathLength: progress === 3 ? 0 : 1,
            opacity: progress === 3 ? 0 : 0.8,
            strokeWidth: progress > 0 ? 2.5 + (progress * 0.4) : 2.5
          }}
          transition={{ duration: progress === 3 ? 2.5 : 0.8, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

export default function CipherVault() {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [val3, setVal3] = useState('');

  // Fuzzy matching logic
  const is1Solved = val1.toLowerCase().includes('25') && val1.toLowerCase().includes('april');
  const is2Solved = val2.trim().toLowerCase() === 'you';
  const is3Solved = val3.trim().toLowerCase() === 'vignesh';

  const progress = (is1Solved ? 1 : 0) + (is2Solved ? 1 : 0) + (is3Solved ? 1 : 0);
  const isUnlocked = progress === 3;

  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    if (isUnlocked) {
      const timer = setTimeout(() => setShowFinal(true), 3500); // Wait for unravelling animation
      return () => clearTimeout(timer);
    }
  }, [isUnlocked]);

  if (showFinal) {
    return <FinalLetter />;
  }

  return (
    <div className="relative w-full min-h-screen bg-[#550000] flex flex-col items-center justify-center selection:bg-[#E8DCC4] selection:text-[#550000] overflow-hidden">
      {/* Vault Moody Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

      <AnimatePresence>
        {!isUnlocked && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(15px)', scale: 1.1 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="flex flex-col items-center w-full max-w-lg px-8 z-10 py-20"
          >
            <KnotSVG progress={progress} />

            <div className="w-full space-y-12">
              <div className="flex flex-col items-center">
                <span className="text-[#E8DCC4]/50 font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase mb-4 text-center">
                  When did we get committed?
                </span>
                <input 
                  type="text" 
                  value={val1}
                  onChange={e => setVal1(e.target.value)}
                  disabled={is1Solved}
                  placeholder="?"
                  className={`w-full bg-transparent border-b text-center font-serif italic text-xl md:text-2xl py-3 outline-none transition-all duration-700 ${
                    is1Solved ? 'border-[#E8DCC4] text-[#E8DCC4] drop-shadow-[0_0_15px_rgba(232,220,196,1)]' : 'border-[#E8DCC4]/20 text-[#E8DCC4]/80 focus:border-[#E8DCC4]/60 placeholder:text-[#E8DCC4]/10'
                  }`}
                />
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[#E8DCC4]/50 font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase mb-1 text-center">
                  Who am I obsessed with?
                </span>
                <span className="text-[#E8DCC4]/30 font-sans text-[8px] md:text-[10px] tracking-widest uppercase mb-4 text-center">
                  HINT: THREE Letters
                </span>
                <input 
                  type="text" 
                  value={val2}
                  onChange={e => setVal2(e.target.value)}
                  disabled={is2Solved}
                  placeholder="?"
                  className={`w-full bg-transparent border-b text-center font-serif italic text-xl md:text-2xl py-3 outline-none transition-all duration-700 ${
                    is2Solved ? 'border-[#E8DCC4] text-[#E8DCC4] drop-shadow-[0_0_15px_rgba(232,220,196,1)]' : 'border-[#E8DCC4]/20 text-[#E8DCC4]/80 focus:border-[#E8DCC4]/60 placeholder:text-[#E8DCC4]/10'
                  }`}
                />
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[#E8DCC4]/50 font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase mb-1 text-center">
                  And finally, who loves you the most?
                </span>
                <span className="text-[#E8DCC4]/30 font-sans text-[8px] md:text-[10px] tracking-widest uppercase mb-4 text-center">
                  HINT: 7 Letters
                </span>
                <input 
                  type="text" 
                  value={val3}
                  onChange={e => setVal3(e.target.value)}
                  disabled={is3Solved}
                  placeholder="?"
                  className={`w-full bg-transparent border-b text-center font-serif italic text-xl md:text-2xl py-3 outline-none transition-all duration-700 ${
                    is3Solved ? 'border-[#E8DCC4] text-[#E8DCC4] drop-shadow-[0_0_15px_rgba(232,220,196,1)]' : 'border-[#E8DCC4]/20 text-[#E8DCC4]/80 focus:border-[#E8DCC4]/60 placeholder:text-[#E8DCC4]/10'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
