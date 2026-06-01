import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, animate, AnimatePresence } from 'framer-motion';

const FLOWER_PATHS = [
  // Center Rose Base & Spirals
  "M 200 170 C 215 170, 230 160, 235 140 C 240 120, 225 105, 205 105 C 185 105, 170 120, 175 140 C 180 160, 195 170, 200 170",
  "M 205 105 C 220 115, 225 135, 215 150 C 205 165, 185 160, 180 145 C 175 130, 190 115, 205 125 C 215 135, 205 150, 195 145 C 185 140, 190 125, 200 130 C 205 135, 200 140, 198 138",
  "M 180 165 C 170 175, 180 180, 195 170",
  "M 220 165 C 230 175, 220 180, 205 170",
  "M 200 170 L 200 280", // Main Center Stem

  // Right Heart-Tulip and Stem
  "M 200 280 C 220 250, 250 200, 260 180",
  "M 260 180 C 255 150, 230 140, 235 160 C 240 180, 255 190, 265 200 C 275 190, 290 180, 285 160 C 280 140, 255 150, 255 170 C 255 180, 265 190, 275 185",
  "M 275 185 C 270 165, 280 150, 295 155 C 310 160, 305 180, 290 195 C 280 205, 270 195, 275 185",
  "M 285 152 C 285 170, 295 180, 300 175",
  "M 295 155 C 290 170, 280 180, 285 190",

  // Left Wildflower Branch & Clovers
  "M 200 280 C 180 260, 160 210, 130 180",
  "M 140 140 C 130 130, 140 120, 145 130 C 150 120, 160 130, 150 140 C 160 150, 150 160, 145 150 C 140 160, 130 150, 140 140",
  "M 120 160 C 110 150, 120 140, 125 150 C 130 140, 140 150, 130 160 C 140 170, 130 180, 125 170 C 120 180, 110 170, 120 160",
  "M 160 160 C 150 150, 160 140, 165 150 C 170 140, 180 150, 170 160 C 180 170, 170 180, 165 170 C 160 180, 150 170, 160 160",
  "M 145 150 C 140 160, 135 170, 130 180",
  "M 130 160 C 130 170, 130 175, 130 180",
  "M 165 170 C 155 175, 145 180, 130 180",

  // Wispy Leaves branching outwards
  "M 200 260 C 170 250, 130 240, 110 220",
  "M 110 220 C 120 225, 130 220, 140 225 C 130 230, 120 230, 110 220",
  "M 130 232 C 140 240, 150 235, 160 240 C 150 245, 140 245, 130 232",
  "M 150 242 C 160 250, 170 245, 180 250 C 170 255, 160 255, 150 242",
  "M 200 260 C 230 250, 270 240, 290 220",
  "M 290 220 C 280 225, 270 220, 260 225 C 270 230, 280 230, 290 220",
  "M 270 232 C 260 240, 250 235, 240 240 C 250 245, 260 245, 270 232",
  "M 250 242 C 240 250, 230 245, 220 250 C 230 255, 240 255, 250 242",
  "M 200 240 C 180 230, 170 210, 165 190 C 175 210, 185 220, 200 230",
  "M 200 240 C 220 230, 230 210, 235 190 C 225 210, 215 220, 200 230",

  // Wrapper Ribbon Knot & Waffle Grid
  "M 200 280 C 180 275, 170 285, 200 285 C 230 285, 220 275, 200 280",
  "M 197 281 L 197 284",
  "M 203 281 L 203 284",
  "M 195 282 L 205 282",

  // Fanning Base Stems
  "M 200 285 L 200 340",
  "M 200 285 C 190 310, 180 330, 175 340",
  "M 200 285 C 185 310, 170 325, 160 330",
  "M 200 285 C 210 310, 220 330, 225 340",
  "M 200 285 C 215 310, 230 325, 240 330",
];

export default function FlowerGenerator() {
  const [stage, setStage] = useState<'idle' | 'drawing' | 'bloomed' | 'wished'>('idle');
  const [wish, setWish] = useState('');
  const progress = useMotionValue(0);
  const animationRef = useRef<any>(null);

  const handlePointerDown = () => {
    if (stage !== 'idle' && stage !== 'drawing') return;
    setStage('drawing');
    
    animationRef.current = animate(progress, 1, {
      duration: 4,
      ease: 'linear',
      onComplete: () => {
        setStage('bloomed');
      }
    });
  };

  const handlePointerUp = () => {
    if (stage === 'bloomed' || stage === 'wished') return;
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    animate(progress, 0, {
      duration: progress.get() * 2,
      ease: 'easeOut',
      onComplete: () => setStage('idle')
    });
  };

  return (
    <div 
      className="relative w-full min-h-[100dvh] bg-[#550000] flex flex-col items-center justify-center overflow-hidden touch-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.8)_100%)]" />
      
      <AnimatePresence>
        {stage === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="w-2 h-2 rounded-full bg-[#FDFBF7] shadow-[0_0_15px_rgba(253,251,247,0.8)] mb-8"
            />
            <p className="text-[#FDFBF7] font-serif italic text-xl tracking-widest opacity-80 text-center">
              Hold to plant a wish.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={stage === 'bloomed' || stage === 'wished' ? {
          y: [-10, 10, -10],
          rotate: [-1, 1, -1]
        } : {}}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className={`relative w-[300px] h-[400px] pointer-events-none transition-all duration-1000 ${
          stage === 'bloomed' || stage === 'wished' ? 'drop-shadow-[0_0_30px_rgba(253,251,247,0.3)]' : ''
        }`}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
          <defs>
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g
            stroke="#FDFBF7"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={stage === 'bloomed' || stage === 'wished' ? "url(#neon-glow)" : undefined}
          >
            {FLOWER_PATHS.map((path, i) => (
              <motion.path
                key={i}
                d={path}
                initial={{ pathLength: 0 }}
                style={{ pathLength: progress }}
              />
            ))}
          </g>
        </svg>
      </motion.div>

      <AnimatePresence>
        {(stage === 'bloomed' || stage === 'wished') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute bottom-32 flex flex-col items-center w-full max-w-sm px-6 z-10 pointer-events-auto"
          >
            <input
              type="text"
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Whisper it here..."
              className="w-full bg-transparent border-b border-[#FDFBF7]/30 text-center font-serif italic text-2xl py-3 text-[#FDFBF7] outline-none focus:border-[#FDFBF7] transition-colors placeholder:text-[#FDFBF7]/20"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && wish.trim()) {
                  setStage('wished');
                }
              }}
              disabled={stage === 'wished'}
              onPointerDown={(e) => e.stopPropagation()}
            />
            {stage === 'wished' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-[#FDFBF7]/60 font-sans text-xs tracking-widest uppercase text-center"
              >
                Planted in the stars.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}