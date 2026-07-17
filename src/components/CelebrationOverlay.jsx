// src/components/CelebrationOverlay.jsx - Celebratory falling footballs on page load
import React, { useEffect, useRef, useState } from 'react';

export default function CelebrationOverlay({ onComplete }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Handle viewport sizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Ball class definition
    class Football {
      constructor(w, h) {
        this.reset(w, h);
        // Start scattered at different initial heights off-screen
        this.y = -Math.random() * h * 0.8 - 40;
      }

      reset(w, _h) {
        this.radius = Math.random() * 15 + 18; // radius between 18 and 33
        this.x = Math.random() * w;
        this.y = -this.radius - 20;
        this.vy = Math.random() * 3 + 3.5; // fall speed
        this.vx = Math.random() * 1.5 - 0.75; // slight sway
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() * 0.04 + 0.02) * (Math.random() > 0.5 ? 1 : -1);
      }

      update(w, h) {
        this.y += this.vy;
        this.x += this.vx;
        this.rotation += this.rotationSpeed;

        // Reset if goes off bottom
        if (this.y > h + this.radius) {
          this.reset(w, h);
        }
      }

      draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);

        const r = this.radius;

        // Base white sphere
        context.beginPath();
        context.arc(0, 0, r, 0, Math.PI * 2);
        context.fillStyle = '#ffffff';
        context.fill();
        context.strokeStyle = '#334155';
        context.lineWidth = 2;
        context.stroke();

        // 3D Shadow overlay
        const radialGrad = context.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r);
        radialGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        radialGrad.addColorStop(1, 'rgba(15, 23, 42, 0.25)');
        context.beginPath();
        context.arc(0, 0, r, 0, Math.PI * 2);
        context.fillStyle = radialGrad;
        context.fill();

        // Central Pentagon (black/slate)
        const pr = r * 0.35;
        context.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
          const px = pr * Math.cos(angle);
          const py = pr * Math.sin(angle);
          if (i === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        }
        context.closePath();
        context.fillStyle = '#1e293b';
        context.fill();
        context.stroke();

        // Connect pentagon vertices to outer edge (Hexagonal panels outline)
        for (let i = 0; i < 5; i++) {
          const angleInner = (i * Math.PI * 2) / 5 - Math.PI / 2;
          const angleOuter = (i * Math.PI * 2) / 5 - Math.PI / 2 + Math.PI / 5;
          const ix = pr * Math.cos(angleInner);
          const iy = pr * Math.sin(angleInner);
          const ox = r * Math.cos(angleInner);
          const oy = r * Math.sin(angleInner);
          
          context.beginPath();
          context.moveTo(ix, iy);
          context.lineTo(ox, oy);
          context.strokeStyle = '#334155';
          context.lineWidth = 1.5;
          context.stroke();

          // Hexagon small patch at edge
          const hx = (pr + (r - pr) * 0.6) * Math.cos(angleOuter);
          const hy = (pr + (r - pr) * 0.6) * Math.sin(angleOuter);
          context.beginPath();
          context.arc(hx, hy, r * 0.1, 0, Math.PI * 2);
          context.fillStyle = '#1e293b';
          context.fill();
          context.stroke();
        }

        context.restore();
      }
    }

    // Initialize ball list
    const count = 18;
    const balls = [];
    for (let i = 0; i < count; i++) {
      balls.push(new Football(canvas.width, canvas.height));
    }

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      balls.forEach(ball => {
        ball.update(canvas.width, canvas.height);
        ball.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Auto-dismiss timers
    const fadeTimer = setTimeout(() => {
      setVisible(false);
    }, 3600);

    const completeTimer = setTimeout(() => {
      if (onCompleteRef.current) onCompleteRef.current();
    }, 4000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 400);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleDismiss}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: 'rgba(10, 11, 14, 0.4)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease-in-out',
        cursor: 'pointer',
        pointerEvents: visible ? 'auto' : 'none',
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
      
      {/* Premium glowing floating title */}
      <div
        style={{
          zIndex: 10,
          textAlign: 'center',
          animation: 'floatUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards, pulseText 3s infinite alternate',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: '15px',
            color: 'var(--neon-green)',
            letterSpacing: '5px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0, 255, 102, 0.4)',
            marginBottom: '8px'
          }}
        >
          WELCOME TO THE FUTURE
        </span>
        <h1
          style={{
            fontSize: 'calc(4vw + 48px)',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            letterSpacing: '2px',
            background: 'linear-gradient(135deg, #ffffff 40%, var(--neon-cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.6))',
            margin: 0,
            lineHeight: 1
          }}
        >
          FIFA 2026
        </h1>
        <span
          style={{
            display: 'block',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '2px',
            marginTop: '12px',
            fontFamily: 'var(--font-sans)'
          }}
        >
          Click anywhere to skip
        </span>
      </div>

      <style>{`
        @keyframes floatUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes pulseText {
          0% {
            filter: drop-shadow(0 0 10px rgba(0, 240, 255, 0.4));
          }
          100% {
            filter: drop-shadow(0 0 25px rgba(0, 240, 255, 0.8));
          }
        }
      `}</style>
    </div>
  );
}
