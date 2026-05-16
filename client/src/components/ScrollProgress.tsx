import { useState, useEffect, useRef } from 'react';

export function ScrollProgress() {
  const [scroll, setScroll] = useState(0);
  const requestRef = useRef<number>(null);

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? (scrollY / height) * 100 : 0;
      setScroll(progress);
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[10001] pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-[#e91e8c] via-[#00f5ff] to-[#e91e8c] bg-[length:200%_100%]"
        style={{ 
          width: `${scroll}%`,
          boxShadow: '0 0 15px rgba(233, 30, 140, 0.7), 0 0 5px rgba(0, 245, 255, 0.5)',
          animation: 'scrollGradient 3s linear infinite'
        }}
      />
      <style>{`
        @keyframes scrollGradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
}
