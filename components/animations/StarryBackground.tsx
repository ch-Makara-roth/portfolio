'use client'

import React, { useEffect, useMemo } from 'react'

interface StarryBackgroundProps {
  className?: string
  speed?: number
  starCount?: number
  nebulaColor?: string
}

const StarryBackground: React.FC<StarryBackgroundProps> = ({
  className = '',
  speed = 0.5,
  starCount = 200,
  nebulaColor = '#4a0e4f'
}) => {
  // Generate random star data for consistent positioning
  const stars = useMemo(() => {
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2
    }))
  }, [starCount])

  // Generate nebula data
  const nebulae = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 30,
      rotation: Math.random() * 360,
      duration: Math.random() * 20 + 30
    }))
  }, [])

  return (
    <div 
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    >
      <style jsx>{`
        /* Keyframes for star twinkling */
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* Keyframes for nebula drift */
        @keyframes nebulaDrift {
          0% { transform: rotate(0deg) translateX(10px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(10px) rotate(-360deg); }
        }

        /* Keyframes for nebula pulse */
        @keyframes nebulaPulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }

        /* Star styles */
        .star {
          position: absolute;
          background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, transparent 100%);
          border-radius: 50%;
          pointer-events: none;
          animation: twinkle linear infinite;
        }

        /* Nebula styles */
        .nebula {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: nebulaDrift linear infinite, nebulaPulse ease-in-out infinite;
          filter: blur(2px);
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .star, .nebula {
            animation: none;
          }
          .star {
            opacity: 0.6;
          }
          .nebula {
            opacity: 0.2;
          }
        }

        /* Mobile optimization */
        @media (max-width: 768px) {
          .nebula {
            filter: blur(1px);
          }
        }
      `}</style>

      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, 
            #0a0a0a 0%, 
            #1a0a2e 25%, 
            #16213e 50%, 
            #0f3460 75%, 
            #0a0a0a 100%)`
        }}
      />

      {/* Nebula clouds */}
      {nebulae.map((nebula) => (
        <div
          key={`nebula-${nebula.id}`}
          className="nebula"
          style={{
            left: `${nebula.x}%`,
            top: `${nebula.y}%`,
            width: `${nebula.size}vw`,
            height: `${nebula.size}vw`,
            background: `radial-gradient(circle, 
              ${nebulaColor}40 0%, 
              ${nebulaColor}20 30%, 
              ${nebulaColor}10 60%, 
              transparent 100%)`,
            animationDuration: `${nebula.duration / speed}s, ${(nebula.duration * 0.7) / speed}s`,
            animationDelay: `${nebula.id * 2}s, 0s`,
            transform: `rotate(${nebula.rotation}deg)`
          }}
        />
      ))}

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration / speed}s`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}

      {/* Additional twinkling layer for depth */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at center, 
            transparent 0%, 
            rgba(255,255,255,0.1) 50%, 
            transparent 100%)`,
          animation: `nebulaPulse ${20 / speed}s ease-in-out infinite`
        }}
      />
    </div>
  )
}

export default StarryBackground