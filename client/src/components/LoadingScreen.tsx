import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [scanStatus, setScanStatus] = useState('INITIALIZING...');

  useEffect(() => {
    const duration = 2500;
    const interval = 30;
    const step = 100 / (duration / interval);

    const statuses = [
      'BOOT_SEQUENCE_INITIALIZED',
      'NEURAL_LINK_ESTABLISHED',
      'BIOMETRIC_SCAN_IN_PROGRESS',
      'SYSTEM_CALIBRATION_COMPLETE',
      'ACCESS_GRANTED'
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        const statusIdx = Math.min(Math.floor((next / 100) * statuses.length), statuses.length - 1);
        setScanStatus(statuses[statusIdx]);

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 1000);
          }, 400);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#0d0a14] transition-all duration-1000 ${isExiting ? 'opacity-0 scale-110' : 'opacity-100'}`}
    >
      {/* Biometric Scan Line */}
      {!isExiting && (
        <motion.div 
          initial={{ top: '0%' }}
          animate={{ top: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-[2px] bg-[#00f5ff] shadow-[0_0_20px_#00f5ff] z-50 opacity-40"
        />
      )}

      {/* Center UI */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative w-48 h-48 border border-[#e91e8c]/20 rounded-full flex items-center justify-center">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 border-t-2 border-[#e91e8c] rounded-full shadow-[0_0_15px_#e91e8c]"
           />
           <div className="flex flex-col items-center">
              <span className="font-orbitron text-4xl font-black text-white glow-text mb-1">AR</span>
              <span className="font-mono text-[8px] text-[#00f5ff] tracking-[0.5em] opacity-50 uppercase">User_Identified</span>
           </div>
        </div>

        <div className="w-64 space-y-2">
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-gradient-to-r from-[#e91e8c] to-[#00f5ff]"
               style={{ width: `${progress}%` }}
               transition={{ type: "spring", stiffness: 50 }}
             />
          </div>
          <div className="flex justify-between items-center font-mono text-[9px] uppercase tracking-widest text-[#fdf0ff] opacity-60">
             <span>{scanStatus}</span>
             <span className="text-[#00f5ff]">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #e91e8c 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
    </div>
  );
}
