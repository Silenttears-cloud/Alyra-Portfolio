import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Minimize2, Maximize2, Zap } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  id: string;
}

const COMMANDS = {
  HELP: 'help',
  WHOIS: 'whois',
  PROJECTS: 'projects',
  SKILLS: 'skills',
  CONTACT: 'contact',
  CLEAR: 'clear',
  THEME: 'theme',
  STATUS: 'status',
  EXIT: 'exit',
  NEOFETCH: 'neofetch'
};

export const AetherTerminal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'AETHER OS [Version 1.0.42]', type: 'system', id: 'init-1' },
    { text: '(c) 2026 Ayushi Corp. All protocols reserved.', type: 'system', id: 'init-2' },
    { text: 'Type "help" for a list of available commands.', type: 'system', id: 'init-3' },
  ]);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = (text: string, type: TerminalLine['type'] = 'output') => {
    setLines(prev => [...prev, { text, type, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const handleCommand = (cmd: string) => {
    const fullCmd = cmd.trim().toLowerCase();
    const args = fullCmd.split(' ');
    const command = args[0];

    addLine(`> ${cmd}`, 'input');

    switch (command) {
      case COMMANDS.HELP:
        addLine('Available Commands:');
        addLine('  help      - Show this list');
        addLine('  whois     - Information about Ayushi');
        addLine('  projects  - List technical projects');
        addLine('  skills    - Display tactical arsenal');
        addLine('  contact   - Connectivity protocols');
        addLine('  theme     - Toggle light/dark mode');
        addLine('  status    - View system health diagnostics');
        addLine('  neofetch  - Show system information');
        addLine('  clear     - Wipe terminal screen');
        addLine('  exit      - Terminate session');
        break;
      
      case COMMANDS.WHOIS:
        addLine('NAME: Ayushi Raj');
        addLine('ROLE: AI & Full-Stack Architect');
        addLine('LOC: India');
        addLine('BIO: Crafting immersive digital experiences with Python, React, and AI.');
        break;

      case 'whoami':
        addLine('USER: GU_ADMIN_01');
        addLine('ACCESS: LEVEL_5_OVERRIDE');
        addLine('STATUS: AUTHENTICATED');
        addLine('NEURAL_LINK: STABLE');
        break;

      case COMMANDS.PROJECTS:
        addLine('FETCHING SECURE REPOSITORIES...');
        addLine('1. Zero-Knowledge Password Manager [React/TS/Crypto]');
        addLine('2. AXIOM Orchestration Gateway [Python/React/Redis]');
        addLine('3. Astra Vision [Python/YOLO/PyTorch]');
        addLine('4. AI CRM HCP Interaction Hub [Python/FastAPI/React]');
        break;

      case COMMANDS.SKILLS:
        addLine('LANGUAGES: Java, Python, JavaScript, TypeScript, SQL, HTML5, CSS3');
        addLine('BACKEND: Spring Boot, Node.js, Express.js, FastAPI');
        addLine('FRONTEND: React.js, Dragula, Bootstrap, TailwindCSS, Three.js');
        addLine('DATABASES & CACHE: PostgreSQL, MongoDB, Redis, SQLite');
        addLine('TESTING & AUTOMATION: JUnit 5, MockMvc, Mockito, PyTest');
        addLine('TOOLS & PLATFORMS: Git, GitHub, Docker, Gradle, Vercel, Render');
        addLine('CORE CONCEPTS: RESTful APIs, Bitwise Optimization, OOP, UML/ERD');
        addLine('AI INTEGRATIONS: Prompt Engineering, Gemini API');
        break;

      case COMMANDS.CONTACT:
        addLine('GITHUB: github.com/Silenttears-cloud');
        addLine('LINKEDIN: linkedin.com/in/ayushi-raj-299a99388/');
        addLine('EMAIL: ayushi29507@gmail.com');
        break;

      case COMMANDS.THEME:
        if (toggleTheme) {
          toggleTheme();
          addLine('THEME INITIALIZED: ' + (theme === 'dark' ? 'NEBULA LIGHT' : 'COSMIC DARK'), 'success');
        }
        break;

      case COMMANDS.STATUS:
        addLine('SYSTEM HEALTH: OPTIMAL', 'success');
        addLine('FPS: 60.0');
        addLine('LATENCY: 12ms');
        addLine('UPTIME: ' + Math.floor(performance.now() / 1000) + 's');
        break;

      case COMMANDS.NEOFETCH:
        addLine('      /\\      ayushi@aether-os');
        addLine('     /  \\     ----------------');
        addLine('    / /\\ \\    OS: Aether OS v5.0.42');
        addLine('   / /__\\ \\   Kernel: React 19.x [GPGPU]');
        addLine('  / /____\\ \\  Shell: Antigravity-Zsh v3.0');
        addLine('  \\/      \\/  UI: Aether-Glass-Morphism');
        addLine('              Uptime: ' + Math.floor(performance.now() / 1000) + 's');
        addLine('              Memory: 1024TB [Neural Flash]');
        break;

      case COMMANDS.CLEAR:
        setLines([]);
        break;

      case COMMANDS.EXIT:
        onClose();
        break;

      case '':
        break;

      default:
        addLine(`COMMAND NOT FOUND: ${command}`, 'error');
        addLine('Type "help" for valid protocols.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input) {
      handleCommand(input);
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          height: isMinimized ? '40px' : 'min(500px, 80vh)',
          width: isMinimized ? '200px' : 'min(700px, 95vw)'
        }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        drag
        dragMomentum={false}
        dragElastic={0.05}
        dragConstraints={{ left: -400, right: 400, top: -400, bottom: 200 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] overflow-hidden"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="w-full h-full bg-black/90 border border-[#e91e8c]/40 rounded-lg flex flex-col shadow-[0_0_30px_rgba(233,30,140,0.2)] backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#e91e8c]/20 bg-[#e91e8c]/5 cursor-grab active:cursor-grabbing select-none">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#e91e8c]" />
              <span className="text-[10px] uppercase tracking-widest text-[#fdf0ff] font-mono font-bold">Aether Terminal</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setIsMinimized(!isMinimized)} className="hover:text-[#00f5ff] transition-colors">
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <button onClick={onClose} className="hover:text-[#ff0000] transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Output */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-xs md:text-sm space-y-1 scrollbar-thin scrollbar-thumb-[#e91e8c]/20"
              >
                {lines.map((line) => (
                  <div 
                    key={line.id} 
                    className={`
                      ${line.type === 'input' ? 'text-[#00f5ff]' : ''}
                      ${line.type === 'error' ? 'text-[#ff4444]' : ''}
                      ${line.type === 'success' ? 'text-[#00ff99]' : ''}
                      ${line.type === 'system' ? 'text-[#ff6eb4] opacity-80' : ''}
                      ${line.type === 'output' ? 'text-[#fdf0ff]' : ''}
                    `}
                  >
                    {line.text}
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-[#e91e8c]/10 flex items-center gap-2">
                <span className="text-[#e91e8c] font-mono font-bold">{'>'}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-[#fdf0ff] font-mono text-xs md:text-sm"
                  placeholder="Execute protocol..."
                  spellCheck={false}
                  autoComplete="off"
                />
                <motion.div
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-2 h-4 bg-[#e91e8c]"
                />
              </form>
            </>
          )}

          {isMinimized && (
            <div className="flex-1 flex items-center px-4">
               <span className="text-[10px] text-[#ff6eb4] animate-pulse">TERMINAL STANDBY...</span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
