import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Cpu, Wifi } from 'lucide-react';
import { useAether } from '@/contexts/AetherContext';

export const SystemHUD: React.FC = () => {
  const [fps, setFps] = useState(0);
  const [ping, setPing] = useState(12);
  const [uptime, setUptime] = useState(0);
  const { settings } = useAether();
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const startTime = useRef(Date.now());

  useEffect(() => {
    let animationId: number;
    
    const updateStats = () => {
      const now = performance.now();
      frameCount.current++;
      
      if (now - lastTime.current >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / (now - lastTime.current)));
        frameCount.current = 0;
        lastTime.current = now;
        
        // Randomly fluctuate simulated ping for realism
        setPing(prev => Math.max(8, Math.min(45, prev + (Math.random() * 4 - 2))));
        setUptime(Math.floor((Date.now() - startTime.current) / 1000));
      }
      
      animationId = requestAnimationFrame(updateStats);
    };
    
    animationId = requestAnimationFrame(updateStats);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="fixed top-5 right-12 md:right-44 z-[90] flex items-center gap-3 pointer-events-none select-none">
      {/* FPS & MS */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-[#e91e8c]/20 rounded-sm"
      >
        <div className="flex items-center gap-3">
             <div className="flex items-center gap-1">
               <Activity className={`w-3 h-3 ${fps < 30 ? 'text-red-500' : 'text-[#00ff99]'} animate-pulse`} />
               <span className="text-[10px] font-mono font-bold text-[#fdf0ff]">{fps} FPS</span>
             </div>
             <div className="w-[1px] h-3 bg-white/10" />
             <div className="flex items-center gap-1">
               <Wifi className="w-3 h-3 text-[#00f5ff]" />
               <span className="text-[10px] font-mono font-bold text-[#fdf0ff]">{Math.round(ping)} MS</span>
             </div>
        </div>
      </motion.div>

      {/* Resource HUD */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-[#00f5ff]/20 rounded-sm"
      >
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
             <Cpu className="w-3 h-3 text-[#00f5ff] opacity-60" />
             <span className="text-[9px] font-mono text-[#00f5ff] uppercase tracking-tighter">
               {settings.gpuMode === 'ultra' ? 'MAX' : 'ECO'}
             </span>
           </div>
           <div className="flex items-center gap-2">
             <Zap className="w-3 h-3 text-[#e91e8c] opacity-60" />
             <span className="text-[9px] font-mono text-[#fdf0ff] opacity-60">UPTIME: {uptime}S</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
