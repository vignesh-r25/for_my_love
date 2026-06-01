import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// --- The Embers Physics --- //
const Embers = () => {
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 800 });
  const [embers, setEmbers] = useState<any[]>([]);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    // Generate slow, floating embers that drift upward indefinitely
    const generated = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      startX: Math.random() * window.innerWidth,
      endX: Math.random() * window.innerWidth,
      scale: Math.random() * 0.4 + 0.3,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
    }));
    setEmbers(generated);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {embers.map((ember) => (
        <motion.div
          key={ember.id}
          className="absolute w-2 h-2 rounded-full bg-[#E8DCC4] shadow-[0_0_12px_rgba(232,220,196,0.9)] opacity-70"
          initial={{ x: ember.startX, y: "110vh", scale: ember.scale }}
          animate={{ x: ember.endX, y: "-20vh" }}
          transition={{ duration: ember.duration, delay: ember.delay, ease: "linear", repeat: Infinity }}
        />
      ))}
    </div>
  );
};

// --- The Invisible String Border --- //
const GlowingThread = () => (
  <div className="absolute inset-0 pointer-events-none p-6 md:p-12 z-0">
     <motion.div 
       className="w-full h-full rounded-[2rem] border border-[#E8DCC4]/30"
       initial={{ opacity: 0 }}
       whileInView={{ opacity: 1 }}
       viewport={{ once: true, margin: "-100px" }}
       transition={{ duration: 4, ease: "easeInOut", delay: 1 }}
       animate={{ boxShadow: ["0 0 10px rgba(232,220,196,0.1)", "0 0 35px rgba(232,220,196,0.4)", "0 0 10px rgba(232,220,196,0.1)"] }}
     >
        {/* Inner thin stroke for the string effect */}
        <div className="w-full h-full rounded-[2rem] border-[0.5px] border-[#FDFBF7]/60" />
     </motion.div>
  </div>
);

// --- Main Component --- //
export default function FinalLetter() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { damping: 40, stiffness: 40 });
  const springY = useSpring(y, { damping: 40, stiffness: 40 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      // Slight opposite movement for floating parallax feel
      x.set(distanceX * -0.015); 
      y.set(distanceY * -0.015);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return (
    <div className="relative w-full min-h-screen bg-[#550000] overflow-hidden selection:bg-[#E8DCC4] selection:text-[#550000] flex items-center justify-center">
      
      {/* Deep Moody Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,251,247,0.03)_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

      {/* The Indefinite Floating Embers */}
      <Embers />

      {/* The Invisible String Border */}
      <GlowingThread />

      {/* The Parallax Letter Container */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="relative z-10 w-full max-w-4xl px-10 md:px-20 py-24 flex flex-col items-center text-center cursor-default"
      >
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          // Mimics the pace of a deep breath
          transition={{ duration: 4, ease: "easeInOut" }}
          className="space-y-10 md:space-y-14"
        >
          <h2 className="text-[#FDFBF7] font-serif text-3xl md:text-5xl tracking-widest drop-shadow-[0_0_15px_rgba(253,251,247,0.5)] mb-12">
            HAPPY BIRTHDAY <br className="md:hidden" />
            <span className="font-extralight italic opacity-90 block mt-3">يا روحي</span>
          </h2>

          <div className="text-[#E8DCC4]/90 font-serif italic text-lg md:text-2xl leading-loose md:leading-loose font-light space-y-8">
            <p>
              It feels like just yesterday we were two benches apart,
              quietly existing in the same classroom back in 2023.
              I never could have imagined that the soft distance between us
              would unfold into this beautiful, intimate world we share today.
            </p>

            <p>
              We took our time, letting that invisible string pull us gently,
              until the vulnerability of that magical day on April 9th, 2026, when we finally
              spoke from the heart. 
            </p>

            <p>
              And then came the pure joy of April 25th, 2026—the day we chose us.
              Every breath, every moment since then has felt like a timeless dream I never want to wake up from.
            </p>
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
}
