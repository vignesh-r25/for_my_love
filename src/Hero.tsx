import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

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

// Antigravity Floating Number Component
const FloatingNumber = ({ value, label, delay }: { value: number, label: string, delay: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    
    if (distance < 120) {
      x.set(-distanceX * 0.4);
      y.set(-distanceY * 0.4);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="flex flex-col items-center justify-center p-4 md:p-6 relative cursor-default"
      animate={{ y: ["-10px", "10px"] }}
      transition={{ 
        y: {
          duration: 4 + Math.random() * 2,
          repeat: Infinity, 
          repeatType: 'mirror', 
          ease: 'easeInOut',
          delay: delay 
        }
      }}
    >
      <span className="text-4xl md:text-6xl lg:text-7xl font-sans font-extralight text-[#FDFBF7] drop-shadow-xl tracking-widest pointer-events-none">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] md:text-xs font-serif text-[#E8DCC4]/70 mt-4 tracking-[0.3em] uppercase pointer-events-none">
        {label}
      </span>
    </motion.div>
  );
};

const MilestoneCounter = () => {
  const [elapsedTime, setElapsedTime] = useState(calculateTimeElapsed(START_DATE));

  useEffect(() => {
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
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 3, ease: "easeOut" }}
      className="flex flex-col items-center w-full px-4"
    >
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 max-w-5xl">
        {timeUnits.map((unit, index) => (
          <FloatingNumber 
            key={unit.label} 
            value={unit.value} 
            label={unit.label} 
            delay={index * 0.15} 
          />
        ))}
      </div>

      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 2, ease: "easeOut" }}
        className="text-[#E8DCC4]/80 font-serif text-lg md:text-xl lg:text-2xl italic tracking-widest mt-24 text-center font-light px-4"
      >
        Every second since you became mine. I’d wait three more years just to hear you say yes again.
      </motion.h2>

      {/* The Invisible String */}
      <div className="mt-12 relative flex items-center justify-center w-full max-w-md h-10 opacity-70">
        <motion.div
          className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#E8DCC4] to-transparent shadow-[0_0_12px_rgba(232,220,196,0.6)]"
          animate={{ opacity: [0.2, 0.6, 0.2], scaleX: [0.9, 1, 0.9] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-1.5 h-1.5 rounded-full bg-[#FDFBF7] shadow-[0_0_15px_rgba(253,251,247,1)]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

export default function Hero() {
  const [step, setStep] = useState(0);

  // Define the slow, intimate narrative sequence
  const sequence = [
    {
      id: "wish",
      duration: 5000,
      content: (
        <div className="flex flex-col items-center justify-center space-y-6">
          <h1 className="text-[#E8DCC4]/90 font-sans font-light tracking-[0.4em] text-sm md:text-lg uppercase">
            Happy Birthday
          </h1>
          <h2 className="text-[#FDFBF7] font-serif text-4xl md:text-6xl lg:text-7xl font-extralight tracking-widest drop-shadow-[0_0_25px_rgba(253,251,247,0.6)]">
            يا روحي
          </h2>
        </div>
      )
    },
    {
      id: "text1",
      duration: 5000,
      content: (
        <h2 className="text-[#E8DCC4]/90 font-serif text-xl md:text-3xl font-light italic text-center px-6 leading-relaxed max-w-3xl">
          For three years, you were just two benches away. I didn't know then that I was looking at my entire future.
        </h2>
      )
    },
    {
      id: "counter",
      duration: Infinity, // Stays forever
      content: <MilestoneCounter />
    }
  ];

  useEffect(() => {
    if (step < sequence.length - 1) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, sequence[step].duration);
      return () => clearTimeout(timer);
    }
  }, [step, sequence]);

  return (
    <div className="min-h-screen bg-[#550000] flex flex-col items-center justify-center overflow-hidden selection:bg-[#E8DCC4] selection:text-[#550000] relative">
      {/* Deep cinematic vignette to make the center glow pop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,251,247,0.03)_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

      <div className="relative z-10 w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={sequence[step].id}
            initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)', scale: 1.05 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute w-full flex justify-center"
          >
            {sequence[step].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
