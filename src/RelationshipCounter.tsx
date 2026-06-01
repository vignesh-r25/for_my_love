import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import FluidCanvas from './FluidCanvas';

const START_DATE = new Date('2026-04-25T00:00:00');

// Helper function to accurately calculate the elapsed time
const calculateTimeElapsed = (startDate: Date) => {
  const now = new Date();
  
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();
  let hours = now.getHours() - startDate.getHours();
  let minutes = now.getMinutes() - startDate.getMinutes();
  let seconds = now.getSeconds() - startDate.getSeconds();

  if (seconds < 0) {
    minutes--;
    seconds += 60;
  }
  if (minutes < 0) {
    hours--;
    minutes += 60;
  }
  if (hours < 0) {
    days--;
    hours += 24;
  }
  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days, hours, minutes, seconds };
};

// Component for each individual time unit with the "Antigravity" & "Repel" effect
const FloatingNumber = ({ value, label, delay }: { value: number, label: string, delay: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Motion values for the hover repel effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs to make the repel and snap-back buttery smooth
  const springConfig = { damping: 15, stiffness: 150, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from cursor to center of the number block
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    
    // If the cursor is close, push the element away (repel)
    if (distance < 120) {
      x.set(-distanceX * 0.4);
      y.set(-distanceY * 0.4);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0); // Snap back to natural position
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="flex flex-col items-center justify-center p-6 relative cursor-default"
      // Continuous floating antigravity effect
      animate={{ y: ["-10px", "10px"] }}
      transition={{ 
        y: {
          duration: 3 + Math.random() * 2, // Slightly randomized durations for a natural, un-synced feel
          repeat: Infinity, 
          repeatType: 'mirror', 
          ease: 'easeInOut',
          delay: delay 
        }
      }}
    >
      <span className="text-5xl md:text-7xl lg:text-8xl font-sans font-extralight text-[#FDFBF7] drop-shadow-xl tracking-widest pointer-events-none">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs md:text-sm font-serif text-[#E8DCC4]/70 mt-4 tracking-[0.3em] uppercase pointer-events-none">
        {label}
      </span>
    </motion.div>
  );
};

export default function RelationshipCounter() {
  const [elapsedTime, setElapsedTime] = useState(calculateTimeElapsed(START_DATE));

  useEffect(() => {
    // Tick every second to keep the live counter updated
    const timer = setInterval(() => {
      setElapsedTime(calculateTimeElapsed(START_DATE));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'Years', value: elapsedTime.years },
    { label: 'Months', value: elapsedTime.months },
    { label: 'Days', value: elapsedTime.days },
    { label: 'Hours', value: elapsedTime.hours },
    { label: 'Minutes', value: elapsedTime.minutes },
    { label: 'Seconds', value: elapsedTime.seconds },
  ];

  return (
    <div className="min-h-screen bg-[#550000] flex flex-col items-center justify-center overflow-hidden selection:bg-[#E8DCC4] selection:text-[#550000] relative">
      
      {/* The Interactive Fluid Canvas Background */}
      <FluidCanvas />

      {/* Subtle noir vignette / radial gradient overlay to give depth to the deep maroon */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,251,247,0.03)_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-0" />

      <motion.div 
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="z-10 flex flex-col items-center w-full px-4"
      >
        <h1 className="text-[#E8DCC4] font-serif text-2xl md:text-3xl lg:text-4xl italic tracking-wide mb-20 text-center drop-shadow-md font-light">
          Every second since you said yes.
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 max-w-6xl">
          {timeUnits.map((unit, index) => (
            <FloatingNumber 
              key={unit.label} 
              value={unit.value} 
              label={unit.label} 
              delay={index * 0.15} // Staggered delays so they don't float in unison
            />
          ))}
        </div>

        {/* The Invisible String */}
        <div className="mt-32 relative flex items-center justify-center w-full max-w-lg h-10 opacity-80">
          {/* Glowing thin line */}
          <motion.div
            className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#E8DCC4] to-transparent shadow-[0_0_12px_rgba(232,220,196,0.8)]"
            animate={{ 
              opacity: [0.2, 0.8, 0.2],
              scaleX: [0.85, 1, 0.85]
            }}
            transition={{
              duration: 3, // Slow heartbeat rhythm
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Pulsing center node (The 'Heartbeat') */}
          <motion.div
            className="absolute w-1.5 h-1.5 rounded-full bg-[#FDFBF7] shadow-[0_0_15px_rgba(253,251,247,1)]"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 1.5, // Faster, prominent pulse inside the slower breathing string
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
