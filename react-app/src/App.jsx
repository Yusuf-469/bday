import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Prism from './components/Prism';

const CONFIG = {
  senderName: 'Aapka Beta Yusuf',
  messages: [
    'To the woman who gave me everything...',
    'My first love, my eternal inspiration...',
    'Happy Birthday, Mom'
  ],
  memoryPhotos: [
    '/assets/1.jpeg',
    '/assets/2.jpeg',
    '/assets/3.jpeg',
    '/assets/4.jpeg',
    '/assets/5.jpeg'
  ]
};

function CandleFlame({ position }) {
  const meshRef = useRef();
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.scale.x = 1 + Math.sin(t * 10) * 0.1;
      meshRef.current.scale.z = 1 + Math.cos(t * 8) * 0.1;
    }
  });
  
  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, 0.35, 0]}>
        <coneGeometry args={[0.06, 0.2, 16]} />
        <meshBasicMaterial color="#FF9500" transparent opacity={0.8} />
      </mesh>
      <pointLight position={[0, 0.4, 0]} intensity={1.5} color="#FF9500" distance={3} />
    </group>
  );
}

function BirthdayCake() {
  const groupRef = useRef();
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 2.3, 0.1, 64]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.3} />
      </mesh>
      
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[2.0, 2.1, 0.8, 64]} />
        <meshStandardMaterial color="#FFF8F0" roughness={0.3} />
      </mesh>
      
      <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.52, 0.03, 16, 64]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={1} emissive="#D4AF37" emissiveIntensity={0.1} />
      </mesh>
      
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.55, 0.7, 64]} />
        <meshStandardMaterial color="#FFF8F0" roughness={0.3} />
      </mesh>
      
      <mesh position={[0, 1.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.02, 0.03, 16, 64]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={1} emissive="#D4AF37" emissiveIntensity={0.1} />
      </mesh>
      
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[1.0, 1.05, 0.6, 64]} />
        <meshStandardMaterial color="#FFF8F0" roughness={0.3} />
      </mesh>
      
      {[
        { pos: [1.8, 0.6, 0.5], color: '#FFB6C1' },
        { pos: [-1.5, 0.7, 0.8], color: '#FF69B4' },
        { pos: [0.3, 1.4, 1.3], color: '#FFD700' },
        { pos: [-0.8, 1.5, -1.0], color: '#E6E6FA' },
        { pos: [1.2, 2.0, -0.5], color: '#FFB6C1' }
      ].map((flower, i) => (
        <mesh key={i} position={flower.pos} scale={[1, 0.6, 1]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={flower.color} roughness={0.4} metalness={0.1} transparent opacity={0.9} />
        </mesh>
      ))}
      
      <CandleFlame position={[0, 2.1, 0]} />
      <CandleFlame position={[0.5, 2.1, 0.5]} />
      <CandleFlame position={[-0.5, 2.1, 0.5]} />
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} color="#FFF8E7" />
      <spotLight position={[0, 10, 5]} angle={Math.PI / 6} penumbra={0.5} intensity={2} castShadow />
      <pointLight position={[-5, 3, 0]} intensity={0.5} color="#D4AF37" />
      <pointLight position={[5, 3, 0]} intensity={0.5} color="#D4AF37" />
      
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <BirthdayCake />
      </Float>
      
      <Sparkles count={150} scale={10} size={2} speed={0.3} color="#D4AF37" />
    </>
  );
}

function MemoryCard({ photo, index }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div 
      onClick={() => setIsFlipped(!isFlipped)}
      style={{
        flexShrink: 0,
        width: 'min(280px, 70vw)',
        aspectRatio: '3/4',
        borderRadius: '20px',
        padding: '10px',
        background: 'linear-gradient(145deg, rgba(26,26,26,0.8), rgba(42,42,42,0.8))',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        cursor: 'pointer',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
        transition: 'transform 0.6s ease',
        position: 'relative',
        border: '2px solid #D4AF37',
        borderRadius: '22px',
        opacity: 0.8
      }}
    >
      <img 
        src={photo} 
        alt={`Memory ${index + 1}`}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          objectFit: 'cover'
        }}
      />
    </div>
  );
}

function CrystalBall({ photos }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [photos.length]);
  
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    setRotation(prev => prev + delta * 0.5);
    setStartX(e.clientX);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleClick = (e) => {
    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${Math.random() > 0.5 ? '#D4AF37' : '#FFF8E7'};
        border-radius: 50%;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        pointer-events: none;
        z-index: 1000;
        box-shadow: 0 0 10px #D4AF37;
      `;
      document.body.appendChild(particle);
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 100 + 50;
      
      particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
      ], {
        duration: 1000,
        easing: 'ease-out'
      }).onfinish = () => particle.remove();
    }
  };
  
  return (
    <div 
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      style={{
        width: 'min(350px, 80vw)',
        height: 'min(350px, 80vw)',
        position: 'relative',
        cursor: 'grab'
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(212,175,55,0.2) 30%, rgba(15,23,42,0.8) 70%, rgba(15,23,42,1) 100%)',
        boxShadow: '0 0 60px rgba(212,175,55,0.3), inset 0 0 60px rgba(255,255,255,0.1), 0 0 100px rgba(15,23,42,0.5)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          inset: '10%',
          borderRadius: '50%',
          backgroundImage: `url(${photos[currentIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `rotateY(${rotation}deg)`,
          transition: 'transform 0.1s ease',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)'
        }} />
      </div>
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '40px',
        background: 'linear-gradient(to bottom, #D4AF37, #8B7355)',
        borderRadius: '0 0 30px 30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }} />
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showWishButton, setShowWishButton] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioContextRef = useRef(null);
  
  useEffect(() => {
    setTimeout(() => setLoading(false), 3500);
    
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % CONFIG.messages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleWish = () => {
    setShowWishButton(false);
    for (let i = 0; i < 30; i++) {
      const sparkle = document.createElement('div');
      sparkle.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${Math.random() > 0.5 ? '#D4AF37' : '#FFF8E7'};
        border-radius: 50%;
        left: 50%;
        top: 50%;
        pointer-events: none;
        z-index: 1000;
      `;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1000);
    }
  };
  
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };
  
  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #0F172A 0%, #1a1a2e 50%, #0F172A 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 0 40px rgba(212, 175, 55, 0.5)',
          background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem'
          }}>🎂</div>
        </div>
        <h1 style={{
          marginTop: '30px',
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          color: '#D4AF37',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)'
        }}>Happy Birthday, Mom</h1>
      </div>
    );
  }
  
  return (
    <div style={{ 
      width: '100vw', 
      minHeight: '100vh', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Full-screen Prism Background */}
      <Prism />
      
      {/* 3D Cake Scene */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1 }}>
        <Canvas shadows camera={{ position: [0, 2, 8], fov: 45 }}>
          <Scene />
        </Canvas>
      </div>
      
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        padding: '20px'
      }}>
        <div style={{
          width: 'min(90vw, 400px)',
          padding: '40px 30px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '30px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(212, 175, 55, 0.4)',
            background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            ❤️
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h2 style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
              fontWeight: 500,
              color: '#F4E4C1',
              letterSpacing: '0.5px'
            }}>
              AirDrop from <span style={{ fontWeight: 700, color: '#D4AF37' }}>{CONFIG.senderName}</span>
            </h2>
          </div>
          
          <div style={{ minHeight: '80px', marginBottom: '30px', textAlign: 'center' }}>
            <p style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
              fontWeight: 500,
              color: '#FFF8E7'
            }}>
              <span style={{
                background: 'linear-gradient(90deg, #F4E4C1, #D4AF37, #F4E4C1)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 3s linear infinite'
              }}>
                {CONFIG.messages[currentMessage]}
              </span>
            </p>
          </div>
          
          {showWishButton && (
            <button 
              onClick={handleWish}
              style={{
                display: 'block',
                width: '100%',
                padding: '18px 30px',
                background: 'transparent',
                border: '2px solid #D4AF37',
                borderRadius: '50px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#D4AF37',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.color = '#0F172A';
                e.target.style.background = 'linear-gradient(135deg, #D4AF37, #F4E4C1)';
                e.target.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.5)';
              }}
              onMouseOut={(e) => {
                e.target.style.color = '#D4AF37';
                e.target.style.background = 'transparent';
                e.target.style.boxShadow = 'none';
              }}
            >
              Make a Wish
            </button>
          )}
        </div>
        
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          animation: 'bounce 2s ease-in-out infinite'
        }}>
          <span style={{ fontSize: '0.8rem', color: '#F4E4C1', opacity: 0.7 }}>Scroll to explore</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#D4AF37">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </div>
      </section>
      
      {/* Memory Lane Section */}
      <section style={{
        minHeight: '100vh',
        padding: '100px 0',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          gap: '40px',
          padding: '0 50px',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          width: '100%',
          justifyContent: 'center'
        }}>
          {CONFIG.memoryPhotos.map((photo, i) => (
            <MemoryCard key={i} photo={photo} index={i} />
          ))}
        </div>
      </section>
      
      {/* Crystal Ball Section */}
      <section style={{
        minHeight: '100vh',
        padding: '50px 20px',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CrystalBall photos={CONFIG.memoryPhotos} />
      </section>
      
      <button 
        onClick={toggleAudio}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 100,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#D4AF37">
          {audioEnabled ? (
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          ) : (
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          )}
        </svg>
      </button>
      
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        body { margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}

export default App;
