import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Minimalist SVG Icons --- //
const WaffleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="20" y="20" width="60" height="60" rx="6" />
    <line x1="40" y1="20" x2="40" y2="80" />
    <line x1="60" y1="20" x2="60" y2="80" />
    <line x1="20" y1="40" x2="80" y2="40" />
    <line x1="20" y1="60" x2="80" y2="60" />
    {/* Abstract syrup/butter drop */}
    <path d="M 45 45 C 50 50, 55 45, 50 40 C 45 35, 40 40, 45 45 Z" fill="currentColor" opacity="0.6" stroke="none" />
  </svg>
);

const IceCreamIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Cup */}
    <path d="M 25 55 L 35 90 C 35 95, 65 95, 65 90 L 75 55 Z" />
    {/* Corner House Scoops */}
    <path d="M 20 55 C 20 40, 40 35, 50 45 C 60 35, 80 40, 80 55" />
    <circle cx="50" cy="30" r="15" />
    {/* Drizzle line */}
    <path d="M 38 25 Q 50 40 62 25" strokeWidth="2" opacity="0.6" />
  </svg>
);

// --- The Floating Treats Background --- //
const BackgroundTreats = () => {
  const [treats, setTreats] = useState<any[]>([]);

  useEffect(() => {
    // Generate static random values once on mount to avoid hydration mismatch/re-renders
    const generatedTreats = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      isWaffle: Math.random() > 0.5,
      left: Math.random() * 100, // vw
      scale: 0.2 + Math.random() * 0.4,
      duration: 20 + Math.random() * 20,
      delay: Math.random() * 10,
    }));
    setTreats(generatedTreats);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {treats.map((treat) => (
        <motion.div
          key={treat.id}
          className="absolute text-[#E8DCC4] opacity-10"
          style={{ left: `${treat.left}vw`, width: '100px', height: '100px' }}
          initial={{ y: "110vh", scale: treat.scale, rotate: 0 }}
          animate={{ 
            y: ["110vh", "-20vh"], 
            rotate: [0, 180],
            x: ["0vw", `${(Math.random() - 0.5) * 10}vw`] 
          }}
          transition={{
            y: { duration: treat.duration, delay: treat.delay, repeat: Infinity, ease: "linear" },
            rotate: { duration: treat.duration * 1.5, repeat: Infinity, ease: "linear" },
            x: { duration: treat.duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          }}
        >
          {treat.isWaffle ? <WaffleIcon className="w-full h-full" /> : <IceCreamIcon className="w-full h-full" />}
        </motion.div>
      ))}
    </div>
  );
};

// --- Interactive Circle Component --- //
const InteractiveCircle = ({ 
  icon: Icon, 
  hiddenText,
  delay
}: { 
  icon: React.ElementType, 
  hiddenText: string,
  delay: number
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="w-36 h-36 md:w-56 md:h-56 rounded-full border border-[#E8DCC4]/30 flex items-center justify-center bg-[#4a0000] shadow-[0_0_30px_rgba(0,0,0,0.8)] relative overflow-hidden cursor-pointer touch-manipulation"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      // Slow breathing animation
      animate={{ scale: [1, 1.03, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <AnimatePresence mode="wait">
        {!isHovered ? (
          <motion.div
            key="icon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Icon className="w-16 h-16 md:w-24 md:h-24 text-[#E8DCC4] opacity-90 drop-shadow-lg" />
          </motion.div>
        ) : (
          <motion.div
            key="text"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="text-[#E8DCC4] font-serif text-2xl md:text-4xl italic tracking-widest drop-shadow-md">
              {hiddenText}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Subtle hover glow layer */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-[#E8DCC4]/5 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  );
};

// --- Main Component --- //
export default function SweetCorner() {
  return (
    <div className="relative w-full min-h-screen bg-[#550000] overflow-hidden selection:bg-[#E8DCC4] selection:text-[#550000] flex flex-col items-center justify-center py-20">
      {/* Deep Moody Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,251,247,0.02)_0%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

      {/* Floating Treats Physics */}
      <BackgroundTreats />

      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl px-6">
        {/* The Heart-Touching Caption */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="text-[#E8DCC4]/90 font-serif text-xl md:text-2xl lg:text-3xl italic tracking-widest mb-20 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] font-light text-center max-w-4xl leading-loose"
        >
          To endless Corner House dates, sharing waffles, and me realizing that the sweetest thing in my life is just sitting across the table.
        </motion.h2>

        {/* The Two Interactive Circles */}
        <div className="flex flex-row items-center justify-center gap-8 md:gap-24">
           {/* Left Circle: Ice Cream / Rachel */}
           <InteractiveCircle icon={IceCreamIcon} hiddenText="Rachel" delay={0} />
           
           {/* Right Circle: Waffle / Samantha */}
           <InteractiveCircle icon={WaffleIcon} hiddenText="Samantha" delay={2} />
        </div>
      </div>
    </div>
  );
}
