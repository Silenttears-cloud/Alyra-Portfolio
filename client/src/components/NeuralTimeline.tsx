import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { School, Award, Code2, Rocket } from 'lucide-react';

const timelineData = [
  {
    year: '2025',
    title: 'NEURAL INITIALIZATION',
    location: 'BCA — AMITY UNIVERSITY NOIDA',
    desc: 'Commenced Bachelor of Computer Applications. Building foundations in Software Architecture and Data Logic.',
    icon: <School className="text-[#00f5ff]" size={20} />,
    color: '#00f5ff'
  },
  {
    year: '2026',
    title: 'GEMINI CERTIFICATION',
    location: 'GOOGLE FOR EDUCATION',
    desc: 'Bypassed standard engineering protocols to become a Google Gemini Certified Engineer. Specializing in Generative AI Integration.',
    icon: <Award className="text-[#ff6eb4]" size={20} />,
    color: '#ff6eb4'
  },
  {
    year: '2026',
    title: 'SYSTEM ARCHITECTURE',
    location: 'FULL-STACK DEPLOYMENT',
    desc: 'Architected multiple full-stack systems including AXIOM Orchestration Gateways and Zero-Knowledge password managers.',
    icon: <Code2 className="text-[#9b59b6]" size={20} />,
    color: '#9b59b6'
  },
  {
    year: '2025 - 2028',
    title: 'FUTURE HORIZON',
    location: 'AMITY UNIVERSITY NOIDA',
    desc: 'Synthesizing BCA degree with real-world AI engineering. Targeted completion: July 2028.',
    icon: <Rocket className="text-[#cc99ff]" size={20} />,
    color: '#cc99ff'
  }
];

export function NeuralTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative py-20 px-4">
      {/* Central Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[1px] bg-[rgba(233,30,140,0.1)] overflow-hidden hidden md:block">
        <motion.div 
          style={{ scaleY: pathLength, originY: 0 }}
          className="w-full h-full bg-gradient-to-b from-[#00f5ff] via-[#e91e8c] to-[#9b59b6]"
        />
      </div>

      <div className="max-w-4xl mx-auto space-y-24">
        {timelineData.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
          >
            {/* Year Badge */}
            <div className="flex-1 text-center md:text-right">
               <div 
                className="inline-block px-4 py-1 rounded-full border text-xs font-mono tracking-widest mb-2"
                style={{ borderColor: `${item.color}30`, backgroundColor: `${item.color}10`, color: item.color }}
               >
                 {item.year}
               </div>
            </div>

            {/* Icon Point */}
            <div className="relative z-10 w-12 h-12 rounded-full bg-[#0d0a14] border-2 border-[rgba(155,89,182,0.3)] flex items-center justify-center shadow-[0_0_20px_rgba(0,245,255,0.1)]">
               {item.icon}
            </div>

            {/* Content */}
            <div className="flex-1 card-premium p-6 text-center md:text-left group hover:border-[rgba(0,245,255,0.4)] transition-all">
               <h3 className="text-xl font-bold mb-1 font-orbitron group-hover:text-[#00f5ff] transition-colors">{item.title}</h3>
               <p className="text-[#ff6eb4] text-xs font-mono mb-4 tracking-wider uppercase">{item.location}</p>
               <p className="text-[#fdf0ff]/70 text-sm leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
