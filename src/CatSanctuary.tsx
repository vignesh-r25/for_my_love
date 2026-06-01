import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CatSanctuary() {
  const [windowDimensions, setWindowDimensions] = useState({ width: 1000, height: 800 });

  useEffect(() => {
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#550000] overflow-hidden selection:bg-[#E8DCC4] selection:text-[#550000] flex flex-col items-center justify-center py-20">
      
      {/* Soft Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,251,247,0.02)_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
      
      {/* Subtly Floating Dust/Motes */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#E8DCC4]/20 pointer-events-none"
          initial={{
            x: Math.random() * windowDimensions.width,
            y: Math.random() * windowDimensions.height,
          }}
          animate={{
            y: [null, Math.random() * -300],
            x: [null, (Math.random() - 0.5) * 150],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* The Content */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl px-8 w-full">
        
        {/* Soft-Focus Photo/Illustration Container */}
        <motion.div 
          className="w-64 h-64 md:w-[400px] md:h-[400px] rounded-full overflow-hidden border border-[#E8DCC4]/20 shadow-[0_0_50px_rgba(0,0,0,0.6)] mb-16 flex items-center justify-center bg-[#330000] relative group cursor-pointer"
          initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        >
          {/* We use one of the images, keeping it moody but allowing it to clear up slightly on hover */}
          <img 
            src="/media/images/IMG_20260422_145524_0738.jpg" 
            alt="Gentle moment" 
            className="w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000 ease-out"
          />
          
          {/* Subtle glowing overlay that reacts to the image */}
          <div className="absolute inset-0 bg-[#550000]/30 mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] pointer-events-none" />
        </motion.div>

        {/* The Gentle Caption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.8 }}
          className="text-center w-full"
        >
           <h3 className="text-[#E8DCC4]/90 font-serif text-2xl md:text-4xl italic tracking-wide leading-relaxed drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
             "You have this beautiful way of being so gentle with the world... <br className="hidden md:block" />
             <span className="font-light opacity-80 mt-6 block text-xl md:text-3xl text-[#E8DCC4]/70">and I just want to be the one who is gentle with yours."</span>
           </h3>
        </motion.div>
        
      </div>
    </div>
  );
}
