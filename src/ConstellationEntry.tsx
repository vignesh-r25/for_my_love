import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TARGET_NODES = [
  { id: 0, x: 50, y: 30 }, // Center dip
  { id: 1, x: 30, y: 15 },
  { id: 2, x: 15, y: 25 },
  { id: 3, x: 15, y: 45 },
  { id: 4, x: 30, y: 65 },
  { id: 5, x: 50, y: 85 }, // Bottom point
  { id: 6, x: 70, y: 65 },
  { id: 7, x: 85, y: 45 },
  { id: 8, x: 85, y: 25 },
  { id: 9, x: 70, y: 15 },
  { id: 10, x: 50, y: 30 }, // Back to center dip
];

// Generate random background stars
const bgStars = Array.from({ length: 90 }).map((_, i) => ({
  id: `bg-${i}`,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 0.6 + 0.2,
  opacity: Math.random() * 0.5 + 0.1
}));

export default function ConstellationEntry({ onComplete }: { onComplete: () => void }) {
  const [connectedNodes, setConnectedNodes] = useState<number[]>([0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pointerPos, setPointerPos] = useState({ x: 50, y: 30 }); // Default to first node
  const [isSuccess, setIsSuccess] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Helper to get relative coordinates within the SVG viewBox (100x100)
  const getCoordinates = (e: React.PointerEvent) => {
    if (!svgRef.current) return null;
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return null;
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSuccess) return;
    const coords = getCoordinates(e);
    if (!coords) return;

    // Check if we clicked near the LAST connected node to start drawing
    const lastNodeId = connectedNodes[connectedNodes.length - 1];
    const lastNode = TARGET_NODES[lastNodeId];
    
    const dist = Math.sqrt(Math.pow(coords.x - lastNode.x, 2) + Math.pow(coords.y - lastNode.y, 2));
    if (dist < 10) { // Interaction radius
      setIsDrawing(true);
      setPointerPos(coords);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || isSuccess) return;
    const coords = getCoordinates(e);
    if (!coords) return;
    setPointerPos(coords);

    // Check if we hit the NEXT node
    const nextNodeId = connectedNodes.length;
    if (nextNodeId < TARGET_NODES.length) {
      const nextNode = TARGET_NODES[nextNodeId];
      const dist = Math.sqrt(Math.pow(coords.x - nextNode.x, 2) + Math.pow(coords.y - nextNode.y, 2));
      if (dist < 8) { // Snap threshold
        const newConnected = [...connectedNodes, nextNodeId];
        setConnectedNodes(newConnected);
        
        // Success condition
        if (newConnected.length === TARGET_NODES.length) {
          setIsDrawing(false);
          setIsSuccess(true);
          setTimeout(() => onComplete(), 4000); // Wait for dissolve animation
        }
      }
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  return (
    <div className="fixed inset-0 bg-[#550000] flex flex-col items-center justify-center z-50 touch-none selection:bg-transparent overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,251,247,0.05)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

      <AnimatePresence>
        {!isSuccess && (
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-12 md:top-16 text-[#E8DCC4] font-serif text-2xl md:text-3xl italic tracking-widest pointer-events-none drop-shadow-md z-10"
          >
            Trace the string, meri jaan.
          </motion.h2>
        )}
      </AnimatePresence>

      <motion.svg 
        ref={svgRef}
        viewBox="0 0 100 100" 
        className="w-full max-w-lg md:max-w-2xl h-auto aspect-square z-10 mt-16 md:mt-24"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        animate={isSuccess ? { scale: 1.1, opacity: 0, filter: 'blur(20px)' } : {}}
        transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
      >
        {/* Background scattered stars */}
        {bgStars.map(star => (
          <circle 
            key={star.id} 
            cx={star.x} 
            cy={star.y} 
            r={star.size} 
            fill="#E8DCC4" 
            opacity={star.opacity} 
          />
        ))}

        {/* Drawn Lines */}
        {connectedNodes.length > 1 && (
          <motion.polyline 
            points={connectedNodes.map(id => `${TARGET_NODES[id].x},${TARGET_NODES[id].y}`).join(' ')}
            fill="none"
            stroke="#E8DCC4"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_5px_rgba(232,220,196,0.8)]"
            animate={{ opacity: isSuccess ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Active Drawing Line */}
        {isDrawing && connectedNodes.length > 0 && connectedNodes.length < TARGET_NODES.length && (
          <line
            x1={TARGET_NODES[connectedNodes[connectedNodes.length - 1]].x}
            y1={TARGET_NODES[connectedNodes[connectedNodes.length - 1]].y}
            x2={pointerPos.x}
            y2={pointerPos.y}
            stroke="#E8DCC4"
            strokeWidth="0.4"
            strokeDasharray="1 1"
            opacity="0.6"
          />
        )}

        {/* Target Nodes */}
        {TARGET_NODES.map((node, i) => {
          const isConnected = connectedNodes.includes(i);
          const isNext = connectedNodes.length === i;
          return (
            <motion.g key={node.id} animate={{ opacity: isSuccess ? 0 : 1 }} transition={{ duration: 0.5 }}>
              {/* Pulse effect for next node */}
              {isNext && !isSuccess && (
                <motion.circle 
                  cx={node.x} 
                  cy={node.y} 
                  r="3" 
                  fill="#E8DCC4" 
                  opacity="0.2"
                  animate={{ scale: [1, 2, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <circle 
                cx={node.x} 
                cy={node.y} 
                r={isConnected ? 1.5 : 1} 
                fill="#E8DCC4" 
                className={isNext ? "drop-shadow-[0_0_8px_rgba(232,220,196,1)]" : "opacity-80"}
                style={{ transition: 'r 0.3s' }}
              />
            </motion.g>
          );
        })}
      </motion.svg>

      {/* Success Silhouette (A cute minimalist cat) */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <svg viewBox="0 0 100 100" className="w-48 h-48 md:w-80 md:h-80 text-[#E8DCC4] opacity-90 drop-shadow-[0_0_30px_rgba(232,220,196,0.6)]">
              <path 
                fill="currentColor" 
                d="M50 88 C50 88 15 58 15 32 C15 15 35 10 50 28 C65 10 85 15 85 32 C85 58 50 88 50 88 Z"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
