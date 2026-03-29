import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function CyberAudio() {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeInterval = useRef<number | null>(null);

  useEffect(() => {
    // Initialize audio with the locally hosted lofi chill track
    const audio = new Audio('/lofi-chill.mp3');
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      if (fadeInterval.current) clearInterval(fadeInterval.current);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      // Start playing if not already
      audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
      
      // Smooth fade in
      if (fadeInterval.current) clearInterval(fadeInterval.current);
      fadeInterval.current = window.setInterval(() => {
        if (audioRef.current && audioRef.current.volume < 0.25) {
          audioRef.current.volume = Math.min(0.25, audioRef.current.volume + 0.01);
        } else {
          if (fadeInterval.current) clearInterval(fadeInterval.current);
        }
      }, 50);
      setIsMuted(false);
    } else {
      // Smooth fade out
      if (fadeInterval.current) clearInterval(fadeInterval.current);
      fadeInterval.current = window.setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.01) {
          audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.02);
        } else {
          if (audioRef.current) {
            audioRef.current.volume = 0;
            // We keep it "playing" but at volume 0 for instant resume, 
            // or pause if preferred. Let's pause to save resources.
            audioRef.current.pause();
          }
          if (fadeInterval.current) clearInterval(fadeInterval.current);
        }
      }, 50);
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-[100] flex items-center gap-4">
      <button
        onClick={toggleMute}
        className={`p-3 rounded-full border transition-all duration-500 backdrop-blur-md ${
          isMuted 
            ? 'border-[#e91e8c]/30 text-[#e91e8c]/50 bg-black/20' 
            : 'border-[#00f5ff] text-[#00f5ff] bg-[#00f5ff]/10 shadow-[0_0_20px_rgba(0,245,255,0.3)]'
        }`}
        title={isMuted ? "Initialize Neural Link (Audio ON)" : "Terminate Link (Audio OFF)"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
      </button>
      
      {!isMuted && (
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-[#00f5ff] tracking-[0.3em] uppercase opacity-50 animate-pulse">
            Neural_Lofi_Stream
          </span>
          <span className="text-[8px] font-mono text-[#e91e8c] tracking-[0.1em] uppercase opacity-40">
            Ambient_Chill_Active
          </span>
        </div>
      )}
    </div>
  );
}
