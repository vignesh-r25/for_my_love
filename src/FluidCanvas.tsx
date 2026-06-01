import { useEffect, useRef } from 'react';

// Math formula for the heart shape
const getHeartPosition = (t: number, scale: number) => {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x: x * scale, y: y * scale };
};

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  targetX: number | null;
  targetY: number | null;
  t: number | null; // parameter for heart curve

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    // Spawn with random fluid-like spread
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2;
    this.vx = Math.cos(angle) * speed;
    // Add slight constant upward velocity during spawn (plus randomness)
    this.vy = Math.sin(angle) * speed - 1.5; 
    
    this.maxLife = 200 + Math.random() * 100; // 2-3 seconds at 60fps
    this.life = this.maxLife;
    this.size = Math.random() * 2 + 1;
    // Cream/Faint Gold colors
    const colors = ['#E8DCC4', '#FDFBF7', '#D4C4A8'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.targetX = null;
    this.targetY = null;
    this.t = null;
  }

  update(isIdle: boolean, centerX: number, centerY: number, scale: number) {
    if (isIdle) {
      // Idle mode: move towards heart target
      if (this.targetX === null || this.targetY === null) {
        // Assign a random point on the heart shape
        this.t = Math.random() * Math.PI * 2;
        const pos = getHeartPosition(this.t, scale);
        // Add a bit of noise to the outline
        this.targetX = centerX + pos.x + (Math.random() - 0.5) * 10;
        this.targetY = centerY + pos.y + (Math.random() - 0.5) * 10;
      }

      // Smoothly steer towards target
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      this.vx += dx * 0.005; // Gentle pull
      this.vy += dy * 0.005;
      
      // Add friction/drag so they settle into the shape
      this.vx *= 0.92;
      this.vy *= 0.92;
      
      // Decrease life for the 2-3 second dissolve
      this.life -= 1;
    } else {
      // Active fluid mode
      // Reset targets if interrupted
      this.targetX = null;
      this.targetY = null;
      
      // Apply slight constant upward drift
      this.vy -= 0.02;
      
      // Apply fluid drag
      this.vx *= 0.98;
      this.vy *= 0.98;
      
      // Keep alive if still moving fast enough, otherwise slow decay
      if (Math.abs(this.vx) < 0.1 && Math.abs(this.vy) < 0.1) {
        this.life -= 0.5;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return;
    
    // Opacity fades out based on life
    const opacity = Math.max(0, this.life / this.maxLife);
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = opacity;
    // Glowing effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
}

export default function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = 600; // Capped between 400-800 for buttery 60fps
    let lastInteractionTime = Date.now();
    let lastX = 0;
    let lastY = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const spawnParticles = (x: number, y: number, amount: number) => {
      lastInteractionTime = Date.now();
      for (let i = 0; i < amount; i++) {
        if (particles.length >= maxParticles) {
          // Remove the oldest particle if we exceed max
          particles.shift();
        }
        particles.push(new Particle(x, y));
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      lastInteractionTime = Date.now();
      
      // Interpolate for smoother trails if moving fast
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 5) {
        const steps = Math.floor(dist / 5);
        for (let i = 0; i < steps; i++) {
          const ix = lastX + (dx * i) / steps;
          const iy = lastY + (dy * i) / steps;
          spawnParticles(ix, iy, 2); // 2 particles per step
        }
      } else {
        spawnParticles(e.clientX, e.clientY, 3);
      }
      
      lastX = e.clientX;
      lastY = e.clientY;

      // Also gently push existing active particles in the wake
      particles.forEach(p => {
        const pdx = p.x - e.clientX;
        const pdy = p.y - e.clientY;
        const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
        if (pdist < 100) {
          const force = (100 - pdist) / 100;
          p.vx += (pdx / pdist) * force * 1.5;
          p.vy += (pdy / pdist) * force * 1.5;
        }
      });
    };

    const handlePointerDown = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      spawnParticles(e.clientX, e.clientY, 10);
    };

    const handlePointerUp = () => {
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    const render = () => {
      // Clear the canvas with deep maroon, slightly transparent for trailing effect
      // Actually, standard clear is better for glowing overlapping particles
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // We rely on the container's background color #550000.
      // Use lighter composite operation for the WebGL glow feel
      ctx.globalCompositeOperation = 'lighter';

      const now = Date.now();
      const idleTime = now - lastInteractionTime;
      const isIdle = idleTime > 3000;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      // Adjust scale based on screen size so heart fits nicely
      const heartScale = Math.min(canvas.width, canvas.height) / 50;

      particles.forEach(p => p.update(isIdle, centerX, centerY, heartScale));
      particles.forEach(p => p.draw(ctx));

      // Remove dead particles
      particles = particles.filter(p => p.life > 0);

      // Random gentle spawn even when not interacting to keep it alive (optional, 
      // but the prompt says "resting dark fluid", so we'll just let it be completely
      // dark until touched, or maybe a very faint ambient drift).
      // Decided to leave it completely dark until touched for maximum contrast.

      ctx.globalCompositeOperation = 'source-over'; // reset

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0"
      style={{ touchAction: 'none' }} // Prevent scrolling when dragging on canvas
    />
  );
}
