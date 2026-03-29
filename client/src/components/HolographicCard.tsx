import { useRef, useState, MouseEvent } from 'react';
import { ExternalLink, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HolographicCardProps {
  title: string;
  description: string;
  tech: string[];
  link: string;
  date: string;
  index: number;
  previewUrl?: string;
}

export function HolographicCard({ title, description, tech, link, date, index, previewUrl }: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [shimmerPosition, setShimmerPosition] = useState({ x: 50, y: 50 });
  const [showDNA, setShowDNA] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setRotation({ x: rotateX, y: rotateY });
    
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    setShimmerPosition({ x: px, y: py });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setShimmerPosition({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group perspective-1000 w-full transition-all duration-500 ${showDNA ? 'scale-[1.02]' : ''}`}
      style={{
        perspective: '1000px',
        animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`,
      }}
    >
      <div
        className="card-premium group relative w-full h-full overflow-hidden transition-all duration-300 ease-out border-[rgba(155,89,182,0.2)] bg-[var(--card)]"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Shimmer Effect */}
        <div 
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay"
          style={{
            background: `radial-gradient(circle at ${shimmerPosition.x}% ${shimmerPosition.y}%, rgba(233, 30, 140, 0.3) 0%, rgba(155, 89, 182, 0.05) 50%, transparent 80%)`
          }}
        />

        {/* DNA Overlay */}
        <AnimatePresence>
          {showDNA && (
            <motion.div 
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              className="absolute inset-0 z-40 bg-black/60 p-6 flex flex-col justify-center gap-4 border border-[#e91e8c]/50"
            >
              <div className="space-y-4">
                 <div className="flex justify-between items-end border-b border-[#e91e8c]/20 pb-2">
                    <span className="text-[10px] text-[#00f5ff] font-mono uppercase tracking-[0.2em]">Module Complexity</span>
                    <span className="text-xl font-orbitron font-bold text-[#e91e8c]">8.4/10</span>
                 </div>
                 <div className="flex justify-between items-end border-b border-[#e91e8c]/20 pb-2">
                    <span className="text-[10px] text-[#00f5ff] font-mono uppercase tracking-[0.2em]">Neural Integration</span>
                    <span className="text-xl font-orbitron font-bold text-[#fdf0ff]">94%</span>
                 </div>
                 <div className="flex justify-between items-end border-b border-[#e91e8c]/20 pb-2">
                    <span className="text-[10px] text-[#00f5ff] font-mono uppercase tracking-[0.2em]">Data Optimization</span>
                    <span className="text-xl font-orbitron font-bold text-[#00ff99]">A++</span>
                 </div>
              </div>
              <p className="text-[10px] text-[#cc99ff] font-mono italic opacity-60">
                // SYSTEM_DIAGNOSTIC: No memory leaks detected. Logic flow optimal. GPGPU acceleration supported.
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowDNA(false); }}
                className="mt-4 p-2 border border-[#e91e8c] text-[10px] font-mono text-[#e91e8c] hover:bg-[#e91e8c] hover:text-white transition-all uppercase tracking-widest"
              >
                Close Diagnostic
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="relative z-10 flex flex-col h-full" style={{ transform: 'translateZ(30px)' }}>
          {previewUrl && (
            <div className="relative w-full h-48 overflow-hidden border-b border-[rgba(233,30,140,0.1)]">
              <img 
                src={previewUrl} 
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/80 to-transparent" />
            </div>
          )}
          
          <div className="p-6 flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2 group-hover:text-[#e91e8c] transition-colors font-orbitron uppercase tracking-tight">
                  {title}
                </h3>
                <p className="text-[var(--foreground)] opacity-70 text-sm leading-relaxed">{description}</p>
              </div>
              <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                <span className="text-[10px] font-bold px-3 py-1 border border-[#9b59b6] text-[#cc99ff] bg-[#9b59b6]/10 font-mono tracking-widest whitespace-nowrap">
                  {date}
                </span>
                <button 
                  onClick={() => setShowDNA(true)}
                  className="flex items-center gap-2 text-[9px] font-mono text-[#00f5ff] hover:text-[#e91e8c] transition-colors uppercase tracking-widest"
                >
                  <Zap size={10} /> TECHNICAL_DNA
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8 flex-grow">
              {tech.map((t, i) => (
                <span key={i} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 border border-[#e91e8c]/30 text-[#ff6eb4] bg-[#e91e8c]/5">
                  {t}
                </span>
              ))}
            </div>

            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-max items-center gap-2 text-[#e91e8c] hover:text-[#00f5ff] font-bold transition-all group/link uppercase tracking-[0.2em] text-[10px] font-mono border-b border-[#e91e8c]/20 hover:border-[#00f5ff] pb-1"
            >
              DECRYPT SOURCE_CODE
              <ExternalLink className="w-3 h-3 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
