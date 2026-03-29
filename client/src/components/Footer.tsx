export function Footer() {
  return (
    <footer className="relative bg-[rgba(13,10,20,0.9)] border-t border-[rgba(233,30,140,0.2)] py-16 px-4 z-20 backdrop-blur-md">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12 pb-12 border-b border-[rgba(155,89,182,0.1)]">
          <div className="space-y-4">
            <h3 className="font-black text-2xl glow-text uppercase tracking-tighter" style={{ fontFamily: 'Orbitron, sans-serif' }}>Ayushi Raj</h3>
            <p className="text-[#cc99ff] text-sm font-mono tracking-widest uppercase">&gt; AI & Full-Stack Architect_</p>
            <p className="text-[#fdf0ff] opacity-60 text-sm leading-relaxed max-w-xs">
              Bridging the gap between human creativity and artificial intelligence through immersive digital experiences.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#ff6eb4] mb-6 uppercase tracking-widest text-sm font-mono">// Quick Links</h4>
            <ul className="space-y-3 text-sm text-[#fdf0ff] opacity-80">
              <li><a href="#about" className="hover:text-[#00f5ff] transition-colors flex items-center gap-2 font-mono"><span className="text-[#e91e8c]">01.</span> ABOUT_PROTOCOL</a></li>
              <li><a href="#projects" className="hover:text-[#00f5ff] transition-colors flex items-center gap-2 font-mono"><span className="text-[#e91e8c]">02.</span> COMPILED_PROJECTS</a></li>
              <li><a href="#skills" className="hover:text-[#00f5ff] transition-colors flex items-center gap-2 font-mono"><span className="text-[#e91e8c]">03.</span> TACTICAL_ARSENAL</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#ff6eb4] mb-6 uppercase tracking-widest text-sm font-mono">// Connect</h4>
            <ul className="space-y-3 text-sm text-[#fdf0ff] opacity-80 font-mono">
              <li><a href="mailto:ayushi29507@gmail.com" className="hover:text-[#00f5ff] transition-colors flex items-center gap-2"><span className="text-[#e91e8c]">&gt;</span> EMAIL_LINK</a></li>
              <li><a href="https://www.linkedin.com/in/ayushi-raj-299a99388/" className="hover:text-[#00f5ff] transition-colors flex items-center gap-2"><span className="text-[#e91e8c]">&gt;</span> LINKEDIN_NODE</a></li>
              <li><a href="https://www.instagram.com/Silenttears_82" className="hover:text-[#00f5ff] transition-colors flex items-center gap-2"><span className="text-[#e91e8c]">&gt;</span> INSTA_FEED</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center space-y-4">
          <p className="text-[#cc99ff] text-xs font-mono tracking-[0.3em] uppercase opacity-40">
            © 2026 Ayushi Raj. All systems operational.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {['REACT', 'GSAP', 'THREE.JS', 'TAILWIND'].map(tech => (
              <span key={tech} className="text-[10px] text-[#ff6eb4] border border-[rgba(233,30,140,0.2)] px-2 py-1 rounded-sm bg-[rgba(233,30,140,0.05)] font-mono">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
