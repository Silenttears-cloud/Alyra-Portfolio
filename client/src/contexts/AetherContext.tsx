import React, { createContext, useContext, useState, useEffect } from 'react';

interface AetherSettings {
  bloom: number;
  brightness: number;
  particles: 'low' | 'high';
  gpuMode: 'eco' | 'ultra';
  fpsLimit: number;
}

interface AetherContextType {
  settings: AetherSettings;
  updateSettings: (newSettings: Partial<AetherSettings>) => void;
}

const AetherContext = createContext<AetherContextType | undefined>(undefined);

export const AetherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AetherSettings>(() => {
    const stored = localStorage.getItem('aether_settings');
    return stored ? JSON.parse(stored) : {
      bloom: 0.8,
      brightness: 1.0,
      particles: 'high',
      gpuMode: 'ultra',
      fpsLimit: 60
    };
  });

  useEffect(() => {
    localStorage.setItem('aether_settings', JSON.stringify(settings));
    
    // Apply brightness to the document
    document.documentElement.style.filter = `brightness(${settings.brightness})`;
    
    // Apply performance hints
    if (settings.gpuMode === 'eco') {
      document.body.classList.add('low-power-mode');
    } else {
      document.body.classList.remove('low-power-mode');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<AetherSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AetherContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AetherContext.Provider>
  );
};

export const useAether = () => {
  const context = useContext(AetherContext);
  if (!context) throw new Error('useAether must be used within AetherProvider');
  return context;
};
