import React, { useEffect, useRef } from 'react';

// Use a global declaration for the loaded script
declare global {
  interface Window {
    confetti: any;
  }
}

interface FireworksProps {
  active: boolean;
}

export const Fireworks: React.FC<FireworksProps> = ({ active }) => {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (active && window.confetti) {
      // Main burst
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const runFireworks = () => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        // Since particles fall down, start a bit higher than random
        window.confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
        }));
        window.confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
        }));
      };

      intervalRef.current = window.setInterval(runFireworks, 250);
      
      // Immediate big burst on start
      window.confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active]);

  return null; // This component renders nothing to DOM, just effects
};
