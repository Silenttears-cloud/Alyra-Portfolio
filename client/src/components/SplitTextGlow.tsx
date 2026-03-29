import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextGlowProps {
  text: string;
  className?: string;
  delay?: number;
  colorType?: 'primary' | 'secondary' | 'neutral';
}

export function SplitTextGlow({ text, className = '', delay = 0, colorType = 'primary' }: SplitTextGlowProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Simple custom splitting (instead of premium GSAP SplitText)
    const chars = containerRef.current.querySelectorAll('.char');
    
    gsap.fromTo(chars, 
      { opacity: 0, y: 20, rotationX: -90, filter: 'blur(10px)' },
      { 
        opacity: 1, 
        y: 0, 
        rotationX: 0, 
        filter: 'blur(0px)',
        duration: 1, 
        stagger: 0.05, 
        ease: 'back.out(1.7)',
        delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        }
      }
    );
  }, [delay]);

  let textClass = "";
  if (colorType === 'primary') textClass = "glow-text";
  else if (colorType === 'secondary') textClass = "glow-text-violet";
  else textClass = "text-white";

  return (
    <h2 ref={containerRef} className={`${className} perspective-1000 flex flex-wrap`}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block mr-3 whitespace-nowrap">
          {word.split('').map((char, j) => (
            <span 
              key={j} 
              className={`char inline-block ${textClass}`}
              style={{ transformOrigin: '50% 50% -20px' }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
}
