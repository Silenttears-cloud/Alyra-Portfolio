import { useEffect, useRef, Suspense } from 'react';
import { use3DScroll, useStaggerChildren, useCounterAnimation } from '@/hooks/use3DScroll';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { CyberpunkNeon } from '@/components/CyberpunkNeon';
import { HolographicCard } from '@/components/HolographicCard';
import { SplitTextGlow } from '@/components/SplitTextGlow';
import { CombinedScene } from '@/components/CombinedScene';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { AlyraAssistant } from '@/components/AlyraAssistant';
import { Github, Linkedin, Mail, Code, Zap, Award, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

import { ScrambleText } from '@/components/ScrambleText';
import { NeuralContactForm } from '@/components/NeuralContactForm';
import { NeuralTimeline } from '@/components/NeuralTimeline';
import { GitHubActivityCard } from '@/components/GitHubActivityCard';
import { ResumeScanModal } from '@/components/ResumeScanModal';
import { useState } from 'react';

// Aether OS Components
import { AetherTerminal } from '@/components/AetherTerminal';
import { AetherConsole } from '@/components/AetherConsole';
import { SystemHUD } from '@/components/SystemHUD';
import { Sliders, Monitor } from 'lucide-react';


function HeroSection() {
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      gsap.to(window, {
        scrollTo: { y: element, offsetY: 80 },
        duration: 1.5,
        ease: 'power3.inOut',
      });
    }
  };

  useEffect(() => {
    if (!titleGroupRef.current || !subtitleRef.current || !descRef.current || !ctaRef.current || !badgeRef.current) return;

    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(badgeRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.5)' })
      .fromTo(titleGroupRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, "-=0.4")
      .fromTo(subtitleRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, "-=0.8")
      .fromTo(descRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, "-=0.6")
      .fromTo(ctaRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, "-=0.4");
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 py-20 pointer-events-none">
        <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-[#e91e8c] bg-[rgba(233,30,140,0.1)] text-[#ff6eb4] mb-8 text-xs md:text-sm font-bold tracking-widest uppercase" style={{ boxShadow: '0 0 15px rgba(233, 30, 140, 0.3)' }}>
          <Sparkles className="w-4 h-4" />
          <span>System Online</span>
        </div>

        <div ref={titleGroupRef} className="mb-6">
          <h1 className="text-[clamp(2.5rem,10vw,8rem)] leading-none font-black glow-text relative break-words uppercase tracking-tighter" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <ScrambleText text="AYUSHI" delay={1200} />
          </h1>
          <h1 className="text-[clamp(2.5rem,10vw,8rem)] leading-none font-black glow-text-violet relative break-words uppercase tracking-tighter" style={{ fontFamily: 'Orbitron, sans-serif', marginTop: '-0.05em' }}>
            <ScrambleText text="RAJ" delay={1400} />
          </h1>
        </div>

        <p ref={subtitleRef} className="text-base md:text-xl lg:text-2xl text-[#00f5ff] mb-8 font-bold tracking-[0.2em] uppercase" style={{ fontFamily: 'Share Tech Mono, monospace', textShadow: '0 0 10px rgba(0, 245, 255, 0.5)' }}>
          &gt; <ScrambleText text="AI & Full-Stack Architect" delay={1600} /> _
        </p>

        <p ref={descRef} className="text-[#fdf0ff] text-sm md:text-lg mb-12 max-w-2xl mx-auto leading-relaxed opacity-80 backdrop-blur-sm p-4 rounded-xl border border-[rgba(155,89,182,0.2)] bg-[rgba(13,10,20,0.4)]">
          Crafting immersive digital experiences with Python, React, and AI. Specialized in prompt engineering and developing innovative full-stack solutions. Bridging the gap between human creativity and artificial intelligence.
        </p>

        <div ref={ctaRef} className="flex gap-4 md:gap-6 justify-center flex-wrap pointer-events-auto">
          <button onClick={() => scrollToSection('projects')} className="btn-primary group flex items-center gap-3 text-xs md:text-base">
            Access Database
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
          </button>
          <button 
            onClick={() => (window as any).openResumeScan?.()} 
            className="btn-secondary flex items-center gap-2 text-xs md:text-base"
          >
            <Award className="w-4 h-4" />
            Curriculum Vitae
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <svg className="w-6 h-6 md:w-8 md:h-8 text-[#e91e8c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 5px #e91e8c)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}



function ProjectsSection() {
  const sectionRef = use3DScroll() as React.RefObject<HTMLDivElement>;

  const projects = [
    {
      title: 'Dynamic Quiz Management System',
      description: 'Python-based structural logic application with advanced user and admin modes for dynamic data management.',
      tech: ['Python', 'File Architecture', 'Modular Programming'],
      link: 'https://github.com/Silenttears-cloud/Dynamic-Quiz-Management-System',
      date: 'Jan 2026',
      previewUrl: '/quiz-preview.png'
    },
    {
      title: 'AI CRM HCP Interaction Hub',
      description: 'AI-driven CRM system for logging healthcare professional interactions with an advanced neural chat interface.',
      tech: ['Python', 'React', 'FastAPI', 'JavaScript'],
      link: 'https://github.com/Silenttears-cloud/ai-crm-hcp-log-interaction',
      date: 'Mar 2026',
      previewUrl: '/crm-preview.png'
    },
    {
      title: 'Student Record Management System',
      description: 'A comprehensive student record management system with secure authentication, data management, and admin controls.',
      tech: ['Python', 'File Management', 'Admin Auth', 'CLI'],
      link: 'https://github.com/Silenttears-cloud/Student-Record-Management-System',
      date: '2025',
      previewUrl: '/prompt-preview.png'
    },
  ];

  return (
    <section id="projects" ref={sectionRef} className="py-32 px-4 relative z-10 border-t border-[rgba(155,89,182,0.2)] bg-[rgba(15,10,25,0.4)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <SplitTextGlow text="COMPILED PROJECTS" className="text-4xl md:text-6xl font-black mb-4 justify-center" colorType="secondary" />
          <p className="text-[#00f5ff] text-lg font-mono tracking-widest uppercase">System Architecture Showcase</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {projects.map((project, idx) => (
            <HolographicCard key={idx} index={idx} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  const sectionRef = use3DScroll() as React.RefObject<HTMLDivElement>;
  const containerRef = useStaggerChildren() as React.RefObject<HTMLDivElement>;

  const skills = {
    'Core Logic': ['Python', 'JavaScript', 'TypeScript'],
    'Frontend Interface': ['React', 'Redux', 'Tailwind', 'Three.js'],
    'Backend Systems': ['FastAPI', 'Node.js', 'MySQL', 'PostgreSQL'],
    'AI Systems': ['Prompt Engineering', 'LangGraph', 'Gemini API', 'LLM Integration'],
  };

  return (
    <section id="skills" ref={sectionRef} className="py-32 px-4 relative z-10 border-t border-[rgba(233,30,140,0.2)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <SplitTextGlow text="TACTICAL ARSENAL" className="text-4xl md:text-6xl font-black mb-4 justify-center" colorType="primary" />
          <p className="text-[#cc99ff] text-lg font-mono tracking-widest uppercase">Loaded Technical Modules</p>
        </div>

        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div data-stagger className="md:col-span-2 lg:col-span-1">
            <GitHubActivityCard />
          </div>
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} data-stagger className="card-premium">
              <h3 className="text-2xl font-bold mb-8 text-[#ff6eb4]" style={{ fontFamily: 'Orbitron, sans-serif' }}>// {category}</h3>
              <div className="flex flex-wrap gap-4">
                {items.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-5 py-2 border border-[#9b59b6] bg-[rgba(155,89,182,0.1)] text-[#fdf0ff] rounded-sm font-mono text-sm uppercase hover:bg-[#9b59b6] hover:text-white transition-colors cursor-default shadow-[0_0_10px_rgba(155,89,182,0.2)] hover:shadow-[0_0_20px_rgba(155,89,182,0.6)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EducationSection() {
  const sectionRef = use3DScroll() as React.RefObject<HTMLDivElement>;

  const education = [
    {
      title: 'Bachelor of Computer Applications',
      subtitle: 'Software Development Core',
      school: 'Amity University Noida',
      date: 'Jul 2025 - Jul 2028',
    },
    {
      title: 'Gemini Certified Engineer',
      subtitle: 'Google For Education',
      school: 'AI Infrastructure & Architecture',
      date: 'Feb 2026',
    },
    {
      title: 'Advanced Python Protocol',
      subtitle: 'Google Professional Cert',
      school: 'Technical Infrastructure Training',
      date: '2025',
    },
  ];

  const certs = [
    { name: 'Google Gemini AI', issuer: 'Google Cloud', date: '2026' },
    { name: 'Full-Stack Development', issuer: 'Meta', date: '2025' },
    { name: 'Prompt Engineering', issuer: 'DeepLearning.AI', date: '2025' },
  ];

  return (
    <section id="education" ref={sectionRef} className="py-32 px-4 relative z-10 border-t border-[rgba(155,89,182,0.2)] bg-[rgba(15,10,25,0.4)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <SplitTextGlow text="DATA TRAINING CENTERS" className="text-4xl md:text-6xl font-black mb-4 justify-center" colorType="secondary" />
          <p className="text-[#00f5ff] text-lg font-mono tracking-widest uppercase">Academic Archives & Certs</p>
        </div>

        <div className="space-y-6 mb-24">
          {education.map((edu, idx) => (
            <div key={idx} className="card-premium">
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Orbitron, sans-serif' }}>{edu.title}</h3>
                  <p className="text-[#ff6eb4] font-mono text-sm mb-2">{edu.subtitle}</p>
                  <p className="text-[#fdf0ff] opacity-70">{edu.school}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="px-4 py-1 rounded-sm border border-[#00f5ff] text-[#00f5ff] bg-[rgba(0,245,255,0.05)] font-mono text-sm">
                    {edu.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-[#cc99ff] text-lg font-mono tracking-widest uppercase mb-12">Verified Credentials</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certs.map((cert, idx) => (
              <div key={idx} className="p-6 border border-[rgba(233,30,140,0.2)] bg-[rgba(233,30,140,0.05)] rounded-lg hover:border-[#e91e8c] transition-all group">
                <h4 className="text-[#fdf0ff] font-bold mb-2 group-hover:text-[#ff6eb4]">{cert.name}</h4>
                <p className="text-xs text-[#cc99ff] uppercase tracking-tighter mb-4">{cert.issuer}</p>
                <span className="text-[10px] font-mono opacity-50">{cert.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const sectionRef = use3DScroll() as React.RefObject<HTMLDivElement>;
  const counter1Ref = useCounterAnimation(0, 2);
  const counter2Ref = useCounterAnimation(0, 1);
  const counter3Ref = useCounterAnimation(0, 4);

  return (
    <section id="stats" ref={sectionRef} className="py-24 px-4 relative z-10 border-t border-[rgba(233,30,140,0.2)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { ref: counter1Ref, label: 'Systems Deployed', suffix: '+' },
            { ref: counter2Ref, label: 'Active Certifications', suffix: '' },
            { ref: counter3Ref, label: 'Frameworks Mastered', suffix: '+' },
          ].map((stat, idx) => (
            <div key={idx} className="card-premium text-center group flex flex-col items-center justify-center py-12">
              <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#e91e8c] to-[#9b59b6] mb-4" style={{ fontFamily: 'Orbitron, sans-serif', filter: 'drop-shadow(0 0 10px rgba(233, 30, 140, 0.5))' }}>
                <span ref={stat.ref}>0</span>
                {stat.suffix}
              </div>
              <p className="text-[#fdf0ff] font-mono tracking-widest uppercase text-sm opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const sectionRef = use3DScroll() as React.RefObject<HTMLDivElement>;

  return (
    <section id="contact" ref={sectionRef} className="py-32 px-4 relative z-10 border-t border-[rgba(155,89,182,0.2)] bg-[rgba(15,10,25,0.8)]">
      <div className="max-w-4xl mx-auto text-center">
        <SplitTextGlow text="INITIATE UPLINK" className="text-5xl md:text-7xl font-black mb-8 justify-center" colorType="primary" />
        <p className="text-[#fdf0ff] text-lg mb-16 max-w-2xl mx-auto opacity-80 font-mono">
          Ready to deploy new systems. Open for transmissions and collaborative protocols.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start text-left mb-16">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold font-orbitron text-[#e91e8c]">MESSAGE UPLINK</h3>
            <p className="text-[#fdf0ff] opacity-60 font-mono text-sm leading-relaxed">
              If you have a project in mind, a freelance inquiry, or just want to say hello, use the form below to synchronize your transmission.
            </p>
            <NeuralContactForm />
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-bold font-orbitron text-[#00f5ff]">GLOBAL COMMS</h3>
            <p className="text-[#fdf0ff] opacity-60 font-mono text-sm leading-relaxed">
              Prefer direct protocols? Reach out via these verified neural channels across the grid.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { label: 'Email', href: 'mailto:ayushi29507@gmail.com', text: 'ayushi29507@gmail.com', isInstagram: false, isDiscord: false, icon: Mail },
                { label: 'Discord', href: 'https://discordapp.com/users/ayushi_sinha295', text: 'ayushi_sinha295', isInstagram: false, isDiscord: true, icon: MessageSquare },
                { label: 'GitHub', href: 'https://github.com/Silenttears-cloud', text: 'GitHub', isInstagram: false, isDiscord: false, icon: Github },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ayushi-raj-299a99388/', text: 'LinkedIn', isInstagram: false, isDiscord: false, icon: Linkedin },
                { label: 'Instagram', href: 'https://www.instagram.com/Silenttears_82', text: '@Silenttears_82', isInstagram: true, isDiscord: false, icon: Mail },
              ].map((contact, idx) => {
                const Icon = contact.icon;
                return (
                  <a
                    key={idx}
                    href={contact.href}
                    target={contact.href.startsWith('mailto') ? undefined : '_blank'}
                    rel={contact.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    className="group flex items-center gap-4 p-4 rounded-lg border border-[rgba(233,30,140,0.2)] bg-black/40 hover:bg-[rgba(233,30,140,0.15)] hover:border-[#e91e8c] transition-all flex-1 min-w-[200px]"
                  >
                    {contact.isInstagram ? (
                      <svg className="w-6 h-6 text-[#ff6eb4]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    ) : contact.isDiscord ? (
                      <svg className="w-6 h-6 text-[#ff6eb4]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                      </svg>
                    ) : (
                      <Icon className="w-6 h-6 text-[#ff6eb4]" />
                    )}
                    <div className="text-left">
                      <p className="text-[10px] text-[#00f5ff] font-mono leading-none mb-1 opacity-60">PROTOCOL: {contact.label}</p>
                      <p className="text-[#fdf0ff] font-mono text-xs font-bold leading-none">{contact.text}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-[#00f5ff] font-mono tracking-widest text-sm uppercase">
          <p>&gt; LOCATION_PING: Nawada, Bihar, India_</p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [activeScan, setActiveScan] = useState(false);

  useEffect(() => {
    (window as any).openResumeScan = () => setIsResumeModalOpen(true);
    
    // Keyboard Shortcut for Terminal (')
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "'" || e.key === "dead") {
        setIsTerminalOpen(prev => !prev);
      }
    };
    
    // --- Neural Cursor Trail ---
    const particles: HTMLDivElement[] = [];
    const handleMouseMove = (e: MouseEvent) => {
        const particle = document.createElement('div');
        particle.className = 'neural-cursor-particle';
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;
        particle.style.opacity = '1';
        document.body.appendChild(particle);
        particles.push(particle);

        gsap.to(particle, {
            y: '+=20',
            opacity: 0,
            scale: 0.5,
            duration: 0.8,
            onComplete: () => {
                particle.remove();
                particles.shift();
            }
        });
    };

    // --- Section Scan Line Trigger ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveScan(true);
                setTimeout(() => setActiveScan(false), 2500);
            }
        });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('section');
    sections.forEach(s => observer.observe(s));
    
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
        window.removeEventListener('keydown', handleKeyPress);
        window.removeEventListener('mousemove', handleMouseMove);
        observer.disconnect();
    };
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Ayushi_Raj_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsResumeModalOpen(false);
  };

  return (
    <main className="relative bg-[var(--background)] text-[var(--foreground)] min-h-screen overflow-x-hidden selection:bg-[#e91e8c]/30 selection:text-white transition-colors duration-500">
      {/* OS Vital Units */}
      <div className={`system-scan-line ${activeScan ? 'system-scan-active' : ''}`} />
      
      <CyberpunkNeon />
      <AlyraAssistant />
      
      {/* Aether OS Core Units */}
      <SystemHUD />
      <AetherTerminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      <AetherConsole isOpen={isConsoleOpen} onClose={() => setIsConsoleOpen(false)} />

      {/* Persistent Triggers */}
      <div className="fixed top-32 right-6 z-[80] flex flex-col gap-4">
        <button 
          onClick={() => setIsConsoleOpen(true)}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-[#e91e8c]/30 flex items-center justify-center text-[#ff6eb4] hover:bg-[#e91e8c]/20 hover:border-[#e91e8c] transition-all group"
          title="Aether Console"
        >
          <Sliders className="w-5 h-5 group-hover:rotate-45 transition-transform" />
        </button>
        <button 
          onClick={() => setIsTerminalOpen(true)}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-[#00f5ff]/30 flex items-center justify-center text-[#00f5ff] hover:bg-[#00f5ff]/20 hover:border-[#00f5ff] transition-all group"
          title="Aether Terminal [']"
        >
          <Monitor className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <CombinedScene />
      </div>

      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        
        <div className="border-t border-[rgba(233,30,140,0.1)] py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <SplitTextGlow text="NEURAL JOURNEY" className="text-3xl md:text-5xl font-black mb-4 justify-center" colorType="primary" />
            <p className="text-[#ff6eb4] text-xs font-mono tracking-[0.3em] uppercase opacity-60">Authentication & Growth History</p>
          </div>
          <NeuralTimeline />
        </div>

        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        <StatsSection />
        <ContactSection />
        <Footer />
      </div>

      <ResumeScanModal 
        isOpen={isResumeModalOpen} 
        onClose={() => setIsResumeModalOpen(false)} 
        onDownload={handleDownload}
      />
    </main>
  );
}

