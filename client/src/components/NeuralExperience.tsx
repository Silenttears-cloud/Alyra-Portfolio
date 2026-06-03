import { motion } from 'framer-motion';
import { Briefcase, Calendar, Code, ShieldCheck } from 'lucide-react';
import { SplitTextGlow } from './SplitTextGlow';

interface ExperienceItem {
  company: string;
  role: string;
  date: string;
  technologies: string[];
  bullets: string[];
}

const experiences: ExperienceItem[] = [
  {
    company: 'Y Combinator (YC Startup - Shiptivity)',
    role: 'Software Engineering Simulation',
    date: 'June 2026',
    technologies: ['React.js', 'Dragula', 'Node.js', 'Webpack', 'OpenSSL'],
    bullets: [
      'Architected an interactive, 3-column Kanban dashboard (Backlog, In Progress, Complete) to replace legacy spreadsheet logging, boosting task status visibility.',
      'Integrated the Dragula library for fluid card drag-and-drop operations, and synchronized event-driven UI transitions directly into React state by intercepting drop events and forcing clean component re-renders.',
      'Resolved critical Node 25.9 compatibility errors by patching outdated http-deceiver dependencies and configuring environment variables to support legacy OpenSSL cryptographic providers.'
    ]
  },
  {
    company: 'Hewlett Packard Enterprise (HPE)',
    role: 'Software Engineering Job Simulation',
    date: 'June 2026',
    technologies: ['Java', 'Spring Boot', 'Gradle', 'JUnit 5', 'MockMvc', 'REST API'],
    bullets: [
      'Engineered a RESTful web service using Spring Boot and Gradle to process and persist employee data in-memory, supporting structured HTTP GET and POST operations.',
      'Resolved JVM compatibility conflicts by upgrading the application build infrastructure to Gradle 9.5.1 to support the host\'s Java 25 (LTS) compiler.',
      'Formulated a Mockito-free test wrapper utilizing JUnit 5 and MockMvc to run automated API verification without runtime JIT bytecode translation exceptions, achieving 100% build pass rate.'
    ]
  },
  {
    company: 'Walmart USA',
    role: 'Advanced Software Engineering Simulation',
    date: 'May 2026',
    technologies: ['Java', 'Bitwise Arithmetic', 'Data Structures', 'OOP', 'UML & ERD'],
    bullets: [
      'Designed a highly optimized, generic Power of Two Max Heap (SK$-ary heap) in Java to process dynamic shipping queues, replacing standard arithmetic with bitwise shift operators (<<, >>>) for parent-child index transitions.',
      'Engineered a custom zero-dependency unit test suite and profiling micro-benchmarks to measure algorithm throughput across varying branching exponents.',
      'Created unified UML class diagrams and Entity-Relationship diagrams (ERD) to design new database schemas for Walmart\'s department assets, ensuring strict operational compliance.'
    ]
  }
];

export function NeuralExperience() {
  return (
    <section id="experience" className="py-32 px-4 relative z-10 border-t border-[rgba(233,30,140,0.2)] bg-[rgba(10,5,15,0.2)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <SplitTextGlow text="SIMULATION GRID" className="text-4xl md:text-6xl font-black mb-4 justify-center" colorType="primary" />
          <p className="text-[#00f5ff] text-lg font-mono tracking-widest uppercase">Software Engineering Experience Logs</p>
        </div>

        <div className="space-y-12">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="card-premium relative group hover:border-[rgba(0,245,255,0.4)] transition-all duration-300"
            >
              {/* Telemetry Accents */}
              <div className="absolute top-2 left-6 text-[8px] font-mono text-[#ff6eb4] uppercase tracking-widest opacity-60">
                [LOG_UNIT: 00{idx + 1}]
              </div>
              <div className="absolute top-2 right-6 text-[8px] font-mono text-[#00f5ff] uppercase tracking-widest opacity-60 animate-pulse">
                [SEC_LEVEL: OVERRIDE]
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pt-2">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white font-orbitron tracking-wide flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#e91e8c]" />
                    {exp.company}
                  </h3>
                  <p className="text-[#ff6eb4] font-mono text-sm tracking-wider mt-1">{exp.role}</p>
                </div>
                <div className="flex items-center gap-2 text-[#00f5ff] font-mono text-xs md:text-sm bg-[rgba(0,245,255,0.05)] border border-[#00f5ff]/20 px-3 py-1.5 rounded-[4px] self-start md:self-center">
                  <Calendar className="w-4 h-4" />
                  {exp.date}
                </div>
              </div>

              {/* Bullet Points */}
              <ul className="space-y-3.5 mb-6 text-[#fdf0ff] opacity-85 text-sm font-mono leading-relaxed">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-3">
                    <span className="text-[#00f5ff] font-bold mt-1 select-none">&gt;&gt;</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Technology Badges */}
              <div className="flex flex-wrap gap-2.5 pt-4 border-t border-[rgba(233,30,140,0.15)]">
                <span className="text-[10px] text-[#cc99ff] font-mono uppercase tracking-wider flex items-center gap-1.5 mr-2">
                  <Code className="w-3.5 h-3.5" /> Core Modules:
                </span>
                {exp.technologies.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-sm border border-[rgba(0,245,255,0.15)] bg-[rgba(0,245,255,0.02)] text-[#00f5ff] hover:bg-[rgba(0,245,255,0.1)] hover:border-[#00f5ff]/45 font-mono text-xs transition-colors duration-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
