import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Moon, Sun, Zap, Info, Sliders, Activity } from 'lucide-react';
import { useAether } from '@/contexts/AetherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const AetherConsole: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useAether();
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        drag
        dragMomentum={false}
        dragElastic={0.05}
        dragConstraints={{ left: -600, right: 100, top: -100, bottom: 400 }}
        className="fixed right-6 top-24 z-[100] w-72 h-[calc(100vh-160px)]"
      >
        <div className="h-full bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl flex flex-col overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.2)] dark:shadow-[0_0_40px_rgba(233,30,140,0.1)] transition-colors duration-300">
          {/* Header */}
          <div className="p-6 border-b border-[#e91e8c]/10 bg-[#e91e8c]/5 flex items-center justify-between cursor-grab active:cursor-grabbing select-none">
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-[#e91e8c]" />
              <h3 className="font-orbitron font-bold text-sm tracking-widest text-[var(--foreground)] uppercase">Aether Console</h3>
            </div>
            <button onClick={onClose} className="text-[#ff6eb4] hover:rotate-90 transition-transform">
              <Zap size={18} />
            </button>
          </div>

          {/* Controls */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
            {/* Theme Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-tighter text-[#cc99ff] flex items-center gap-2">
                  {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                  Appearance: {theme.toUpperCase()}
                </Label>
                <Switch 
                  checked={theme === 'light'} 
                  onCheckedChange={() => toggleTheme?.()}
                  className="data-[state=checked]:bg-[#e91e8c]"
                />
              </div>
            </div>

            {/* Bloom Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-xs uppercase tracking-tighter text-[#cc99ff]">Bloom Intensity</Label>
                <span className="text-[10px] font-mono text-[#00f5ff]">{Math.round(settings.bloom * 100)}%</span>
              </div>
              <Slider
                value={[settings.bloom * 100]}
                max={200}
                step={1}
                onValueChange={(val) => updateSettings({ bloom: val[0] / 100 })}
                className="[&_[role=slider]]:bg-[#e91e8c]"
              />
            </div>

            {/* Brightness Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-xs uppercase tracking-tighter text-[#cc99ff]">System Brightness</Label>
                <span className="text-[10px] font-mono text-[#00f5ff]">{Math.round(settings.brightness * 100)}%</span>
              </div>
              <Slider
                value={[settings.brightness * 100]}
                max={150}
                min={50}
                step={1}
                onValueChange={(val) => updateSettings({ brightness: val[0] / 100 })}
                className="[&_[role=slider]]:bg-[#e91e8c]"
              />
            </div>

            {/* Performance Mode */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-tighter text-[#cc99ff] flex items-center gap-2">
                  <Activity size={14} />
                  Performance Profile
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateSettings({ gpuMode: 'eco' })}
                  className={`p-3 rounded-lg border text-[10px] font-mono transition-all ${
                    settings.gpuMode === 'eco' 
                    ? 'border-[#00f5ff] bg-[#00f5ff]/10 text-[#00f5ff]' 
                    : 'border-white/10 hover:border-white/20 text-white/40'
                  }`}
                >
                  NEURAL ECO
                </button>
                <button
                  onClick={() => updateSettings({ gpuMode: 'ultra' })}
                  className={`p-3 rounded-lg border text-[10px] font-mono transition-all ${
                    settings.gpuMode === 'ultra' 
                    ? 'border-[#e91e8c] bg-[#e91e8c]/10 text-[#e91e8c]' 
                    : 'border-white/10 hover:border-white/20 text-white/40'
                  }`}
                >
                  QUANTUM MAX
                </button>
              </div>
              <p className="text-[9px] text-[#cc99ff]/50 leading-relaxed">
                * ECO mode disables complex shaders and reduces particle count to preserve GPU resources.
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="p-4 bg-[var(--muted)] flex items-center gap-3">
             <Info className="w-4 h-4 text-[var(--aurora-teal)] shrink-0" />
             <p className="text-[9px] text-[var(--foreground)] opacity-60">
               Dynamic environment protocols v1.0.42. Optimize based on your system cooling.
             </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
