import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';

export default function TwoBenchesTimeline() {
  const [isComplete, setIsComplete] = useState(false);
  const sliderValue = useMotionValue(0);

  // Smooth out the slider movement
  const smoothProgress = useSpring(sliderValue, { stiffness: 100, damping: 20 });

  // Map progress to X positions.
  const leftX = useTransform(smoothProgress, [0, 100], ["-35vw", "-6vw"]);
  const rightX = useTransform(smoothProgress, [0, 100], ["35vw", "6vw"]);

  // String Glow and Opacity
  const stringOpacity = useTransform(smoothProgress, [0, 100], [0.1, 1]);
  const stringGlow = useTransform(smoothProgress, [0, 100], ["rgba(232,220,196,0)", "rgba(232,220,196,0.8)"]);
  const stringBoxShadow = useTransform(stringGlow, (color) => `0 0 20px ${color}`);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    sliderValue.set(val);
    if (val >= 99 && !isComplete) {
      setIsComplete(true);
    } else if (val < 99 && isComplete) {
      setIsComplete(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#550000] overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

      {/* The Central View */}
      <div className="relative w-full max-w-5xl h-80 flex items-center justify-center mt-[-10vh]">
        
        {/* Invisible String */}
        <AnimatePresence>
          {!isComplete && (
            <motion.div 
              className="absolute h-[1px] bg-[#E8DCC4] w-[70vw]"
              style={{ 
                opacity: stringOpacity, 
                boxShadow: stringBoxShadow 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* Left Bench */}
        <motion.div 
          className="absolute w-20 h-28 md:w-32 md:h-40 border border-[#E8DCC4]/30 bg-[#330000]/80 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-sm flex flex-col items-center justify-center z-10"
          style={{ x: leftX }}
          animate={{ opacity: isComplete ? 0 : 1, filter: isComplete ? 'blur(10px)' : 'blur(0px)' }}
          transition={{ duration: 1 }}
        >
          <span className="text-[#E8DCC4]/40 font-sans text-[10px] md:text-xs tracking-widest uppercase">Bench 1</span>
        </motion.div>

        {/* Right Bench */}
        <motion.div 
          className="absolute w-20 h-28 md:w-32 md:h-40 border border-[#E8DCC4]/30 bg-[#330000]/80 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-sm flex flex-col items-center justify-center z-10"
          style={{ x: rightX }}
          animate={{ opacity: isComplete ? 0 : 1, filter: isComplete ? 'blur(10px)' : 'blur(0px)' }}
          transition={{ duration: 1 }}
        >
          <span className="text-[#E8DCC4]/40 font-sans text-[10px] md:text-xs tracking-widest uppercase">Bench 2</span>
        </motion.div>

        {/* Explosive Embers on Complete */}
        <AnimatePresence>
          {isComplete && (
            <motion.div 
              className="absolute z-0 w-10 h-10 flex items-center justify-center pointer-events-none"
            >
               {Array.from({ length: 30 }).map((_, i) => (
                 <motion.div
                   key={i}
                   className="absolute w-1 h-1 bg-[#E8DCC4] rounded-full shadow-[0_0_15px_rgba(232,220,196,1)]"
                   initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                   animate={{ 
                     x: (Math.random() - 0.5) * 400, 
                     y: (Math.random() - 0.5) * 400, 
                     opacity: [1, 0.8, 0],
                     scale: Math.random() * 2.5
                   }}
                   transition={{ duration: 1.5 + Math.random() * 2, ease: "easeOut" }}
                 />
               ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Completion Text Reveal */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 2.5, delay: 0.5, ease: "easeOut" }}
            className="absolute z-30 max-w-4xl text-center px-6 mt-[-10vh]"
          >
             <h3 className="text-[#E8DCC4]/90 font-serif text-2xl md:text-4xl italic tracking-widest drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] leading-loose">
               When we were both at our lowest, your voice was the only thing that felt like home. <br/>
               <span className="text-[#E8DCC4]/70 mt-6 block font-light">That was the day the invisible string pulled tight.</span>
             </h3>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline Slider */}
      <div className="absolute bottom-20 md:bottom-24 w-full max-w-xl px-8 flex flex-col items-center">
        <div className="w-full flex justify-between text-[#E8DCC4]/60 font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase mb-8">
          <span className="text-center w-32">College Start<br/>(2023)</span>
          <span className="text-center w-32">Our Hearts Spoke<br/>(April 9, 2026)</span>
        </div>
        
        <input 
          type="range" 
          min="0" 
          max="100" 
          defaultValue="0"
          onChange={handleSliderChange}
          className="w-full appearance-none bg-[#E8DCC4]/10 h-1 rounded-full outline-none cursor-grab active:cursor-grabbing relative z-20"
        />
        
        {/* We need custom CSS for the thumb to make it look elegant across browsers */}
        <style>{`
          input[type=range]::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #E8DCC4;
            box-shadow: 0 0 20px rgba(232, 220, 196, 0.9);
            cursor: grab;
            transition: transform 0.2s ease;
          }
          input[type=range]:active::-webkit-slider-thumb {
            transform: scale(1.3);
            cursor: grabbing;
          }
        `}</style>
      </div>

    </div>
  );
}
