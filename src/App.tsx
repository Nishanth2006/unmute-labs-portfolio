import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight, Mail, Terminal, ArrowLeft, Maximize2, X, Cpu, Layers, LayoutGrid, CheckCircle2 } from 'lucide-react';
import anime from 'animejs';

// --- STATIC LOCAL .JPG IMPORTS ---
import aether1 from './assets/aether-1.jpg';
import aether2 from './assets/aether-2.jpg';
import aether3 from './assets/aether-3.jpg';

import nexus1 from './assets/nexus-1.jpg';
import nexus2 from './assets/nexus-2.jpg';

import velocity1 from './assets/velocity-1.jpg';
import velocity2 from './assets/velocity-2.jpg';

// --- CONFIGURATION CORNER ---
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_ENDPOINT_HERE";

// --- TS INTERFACES ---
interface Project {
  id: string;
  num: string;
  title: string;
  tagline: string;
  category: 'Branding' | 'SaaS' | 'E-Commerce';
  metrics: string;
  tech: string[];
  desc: string;
  longDesc: string;
  gallery: { url: string; caption: string }[];
}

interface FormState {
  name: string;
  email: string;
  category: string;
  budget: string;
  details: string;
}

const PORTFOLIO_DB: Project[] = [
  {
    id: "aether",
    num: "01",
    title: "AETHER EV",
    tagline: "Premium Immersive Multi-Page Framework",
    category: "Branding",
    metrics: "60 FPS Fluid Scroll / Hardware Accelerated Layouts",
    tech: ["React", "Vite", "Tailwind v4", "Framer Motion"],
    desc: "A high-end interaction showroom featuring dynamic asset loading pipelines, structural text layers, and asynchronous route state transitions engineered specifically for luxury boutique brands.",
    longDesc: "Aether EV redefines the digital showroom envelope. Built to explore smooth scrolling timelines, it handles custom client-side navigation matrices to keep heavy asset elements loaded seamlessly in the background without layout fracturing or page-flicker.",
    gallery: [
      { url: aether1 as string, caption: "Hero Landing Framework - Heavy Contrast Perspective" },
      { url: aether2 as string, caption: "Aerodynamic Propulsion Module Hub" },
      { url: aether3 as string, caption: "Tactical Hardware Diagnostic Specifications Display" }
    ]
  },
  {
    id: "nexus",
    num: "02",
    title: "NEXUS ANALYTICS",
    tagline: "Enterprise SaaS Architecture & Vector Core",
    category: "SaaS",
    metrics: "Zero-Lag Multi-Theme Engine / Vector Path Synthesis",
    tech: ["TypeScript", "React", "Tailwind v4", "Lucide Nodes"],
    desc: "A client-side analytics dashboard workspace. Built with an instantaneous light/dark mode design synchronization pipeline and reactive SVG rendering graphs calculating telemetry metrics data on the fly.",
    longDesc: "Nexus Analytics scales performance interpretation by bringing enterprise data tracking directly to the client view layer. It features dynamic mathematical path plotting variables to draw vector line configurations instantaneously from active state matrices.",
    gallery: [
      { url: nexus1 as string, caption: "SaaS Management Interface Core Display View" },
      { url: nexus2 as string, caption: "Interactive Live Vector Data Synthesis Engine" }
    ]
  },
  {
    id: "velocity",
    num: "03",
    title: "VELOCITY GEAR",
    tagline: "State-Driven High-Conversion Storefront",
    category: "E-Commerce",
    metrics: "Instantaneous State Mutators / Slide Checkout Utility",
    tech: ["React", "Vite", "Tailwind v4", "AnimatePresence"],
    desc: "A premium tactical retail storefront interface featuring live dynamic array asset filtering, transactional cart state management arrays, and smooth structural modal cart overlays optimized heavily for conversion velocity.",
    longDesc: "Velocity Gear uses deep-state state manipulation architecture to keep client cart item parameters updated in absolute real-time. Paired with localized product filter pipelines, it decreases shopping transaction friction exponentially.",
    gallery: [
      { url: velocity1 as string, caption: "Tactical Alpha V1 Equipment Selection Grid" },
      { url: velocity2 as string, caption: "Transactional Sliding Package Panel Framework" }
    ]
  }
];

export default function App() {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [consoleMessage, setConsoleMessage] = useState<string>("System online. Ready to map client lead generation parameters...");
  const [currentPage, setCurrentPage] = useState<'showroom' | 'project'>('showroom');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    category: 'SaaS Platform',
    budget: '$2,000 - $5,000',
    details: ''
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // --- NEW: ANIME.JS STAGGERED ENTRANCE ENGINE ---
  useEffect(() => {
    if (currentPage === 'showroom') {
      // Small timeout to allow structural components to frame up cleanly
      setTimeout(() => {
        anime({
          targets: '.anime-project-card',
          translateY: [40, 0],
          opacity: [0, 1],
          delay: anime.stagger(120, { start: 200 }),
          duration: 1000,
          easing: 'cubicBezier(0.16, 1, 0.3, 1)'
        });
      }, 50);
    }
  }, [currentPage, activeFilter]); // Re-triggers animations perfectly when filters change!

  // Mouse trail pointer and liquid glow setups
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const glowX = useMotionValue(-200);
  const glowY = useMotionValue(-200);

  const springConfig = { damping: 35, stiffness: 350, mass: 0.3 };
  const glowConfig = { damping: 55, stiffness: 100, mass: 0.9 };

  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const glowXSpring = useSpring(glowX, glowConfig);
  const glowYSpring = useSpring(glowY, glowConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      glowX.set(e.clientX - 200);
      glowY.set(e.clientY - 200);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY, glowX, glowY]);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 1.03]);

  const filteredProjects = activeFilter === "ALL" 
    ? PORTFOLIO_DB 
    : PORTFOLIO_DB.filter(p => p.category.toUpperCase() === activeFilter);

  const navigateToProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentPage('project');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setConsoleMessage(`Mapping active view route directly to: [${project.title}]. Assets initialized successfully.`);
  };

  const backToShowroom = () => {
    setCurrentPage('showroom');
    setSelectedProject(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setConsoleMessage("Returned to primary layout deck view. Workspace synced.");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setConsoleMessage(`Updating local context: [form_${name}] -> "${value.substring(0, 30)}${value.length > 30 ? '...' : ''}"`);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsoleMessage("COMPILING PAYLOAD... Establishing safe handshake array matrix parameters with transmission node.");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        setConsoleMessage(`TRANSMISSION SUCCESSFUL: Lead packet successfully pushed to mailbox array queue. Client "${formData.name}" tracked completely.`);
        setFormData({ name: '', email: '', category: 'SaaS Platform', budget: '$2,000 - $5,000', details: '' });
      } else {
        setConsoleMessage("TRANSMISSION ERROR: Endpoint pipeline handshake failed. Check your unique configuration token value.");
      }
    } catch (err) {
      setConsoleMessage("CRITICAL CORRUPTION FAILURE: Unable to locate active online routing network gateway pipelines.");
    }
  };

  return (
    <div ref={containerRef} className="relative bg-[#030303] text-white selection:bg-white selection:text-black min-h-screen antialiased overflow-hidden">
      
      {/* CYBERNETIC BLUEPRINT GRID BACKGROUND */}
      <motion.div 
        style={{ scale: gridScale }}
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"
      />

      {/* DYNAMIC AMBIENT MOUSE TRAIL GLOW */}
      <motion.div 
        className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full bg-white/[0.012] blur-[120px] pointer-events-none z-0 hidden md:block"
        style={{ x: glowXSpring, y: glowYSpring }}
      />

      {/* INTERACTIVE POINTER TRAIL */}
      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-50 hidden md:block mix-blend-difference"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />

      {/* MASTER TRANSPARENT NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-40 border-b border-white/[0.03] backdrop-blur-md bg-[#030303]/30 px-6 md:px-12 py-6 flex justify-between items-center">
        <button onClick={backToShowroom} className="flex items-center space-x-2 text-left bg-transparent border-none cursor-pointer">
          <span className="font-extrabold text-sm tracking-[0.3em] uppercase">UNMUTE LABS</span>
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        </button>
        <a 
          href="#hire" 
          className="flex items-center space-x-2 text-[11px] uppercase tracking-widest font-bold px-5 py-2.5 bg-white text-black rounded-xl hover:opacity-90 transition-all font-mono"
        >
          <Mail size={12} />
          <span>Request Pipeline</span>
        </a>
      </nav>

      {/* MAIN VIEW CONTROLLER SYSTEM */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          
          {/* VIEW LAYER A: PORTFOLIO SHOWROOM INDEX */}
          {currentPage === 'showroom' && (
            <motion.div
              key="showroom-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* HERO SECTION */}
              <motion.section 
                style={{ opacity: heroOpacity }}
                className="relative h-screen w-full flex flex-col justify-center items-center px-6 md:px-12 overflow-hidden border-b border-white/[0.02]"
              >
                <motion.div style={{ y: heroTextY }} className="text-center max-w-4xl space-y-6 z-10">
                  <span className="text-[10px] font-mono tracking-[0.4em] text-[#7e7e87] uppercase block">
                    [ FRONTEND ARCHITECT / INTERACTION SPECIALIST ]
                  </span>
                  <h1 className="text-4xl sm:text-7xl font-black tracking-tighter uppercase leading-[0.95] mb-4">
                    High-fidelity code. <br/>
                    <span className="eye-candy-gradient block mt-2">Fluid digital motion.</span>
                  </h1>
                  <p className="text-[#7e7e87] text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
                    Engineering ultra-smooth web systems, responsive interface engines, and zero-latency state controllers tailored specifically for premium corporate platforms.
                  </p>
                </motion.div>
              </motion.section>

              {/* PROJECT SHOWCASE GRID */}
              <section className="w-full py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-white/[0.04] pb-8 mb-16 gap-6">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#7e7e87] uppercase block mb-2">[ PRODUCT SHOWROOM ]</span>
                    <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight uppercase">Operational Infrastructure.</h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 bg-[#0a0a0c] p-1 border border-white/[0.04] rounded-xl font-mono text-[11px]">
                    {["ALL", "BRANDING", "SAAS", "E-COMMERCE"].map(category => (
                      <button
                        key={category}
                        onClick={() => setActiveFilter(category)}
                        className={`px-4 py-2 rounded-lg font-medium tracking-wide transition-all uppercase cursor-pointer ${activeFilter === category ? 'bg-white text-black font-bold' : 'text-[#7e7e87] hover:text-white'}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => navigateToProject(project)}
                      /* UPDATED: Added target target hook class for staggered Anime.js entrance pipeline */
                      className="anime-project-card opacity-0 w-full bg-[#0a0a0c]/80 backdrop-blur-md border border-white/[0.04] rounded-3xl p-6 md:p-10 flex flex-col justify-between group hover:border-white/20 transition-all relative overflow-hidden cursor-pointer"
                    >
                      <div className="absolute -top-12 -right-12 text-[10vw] font-black text-white/[0.01] select-none uppercase pointer-events-none font-mono">
                        {project.num}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
                        <div className="lg:col-span-1 space-y-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-xs font-mono font-bold text-[#7e7e87] border border-white/10 px-2.5 py-0.5 rounded-md bg-black/40">
                              {project.category}
                            </span>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-black tracking-tight uppercase group-hover:text-neutral-300 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-xs text-white/90 font-mono font-medium tracking-wide">⚡ {project.metrics}</p>
                        </div>

                        <div className="lg:col-span-1">
                          <p className="text-[#7e7e87] text-sm font-light leading-relaxed pt-1">{project.desc}</p>
                          <div className="flex flex-wrap gap-1.5 mt-4">
                            {project.tech.map((t, idx) => (
                              <span key={idx} className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/[0.02] border border-white/[0.03] text-neutral-400">{t}</span>
                            ))}
                          </div>
                        </div>

                        <div className="lg:col-span-1 flex lg:justify-end items-center h-full">
                          <button className="flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-xs font-mono tracking-wider hover:bg-white hover:text-black hover:border-white transition-all w-full lg:w-auto justify-center group/btn cursor-pointer">
                            <span>Explore Interface Case</span>
                            <ArrowUpRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* VIEW LAYER B: TARGET PROJECT DEEP DIVE INTERFACE */}
          {currentPage === 'project' && selectedProject && (
            <motion.div
              key="project-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="pt-28 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto pb-24"
            >
              <button 
                onClick={backToShowroom}
                className="flex items-center space-x-2 text-xs font-mono text-[#7e7e87] hover:text-white transition-colors mb-8 cursor-pointer uppercase tracking-widest bg-transparent border-none"
              >
                <ArrowLeft size={14} />
                <span>Back to Master Showroom</span>
              </button>

              <div className="border-b border-white/[0.05] pb-10 mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div>
                  <span className="text-xs font-mono text-[#7e7e87] uppercase tracking-wider block mb-2">// PROJECT MODULE {selectedProject.num}</span>
                  <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-none">{selectedProject.title}</h1>
                  <p className="text-sm text-neutral-400 font-mono mt-3">⚡ {selectedProject.metrics}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 max-w-xs md:justify-end">
                  {selectedProject.tech.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04] text-neutral-300">{t}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="md:col-span-2">
                  <h4 className="text-xs font-mono text-[#7e7e87] uppercase tracking-widest mb-3 flex items-center gap-1.5"><Cpu size={12} /> Engineering Blueprint</h4>
                  <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed">{selectedProject.longDesc}</p>
                </div>
                <div className="bg-[#0a0a0c] border border-white/[0.04] p-6 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-[#7e7e87] tracking-widest uppercase block mb-4"><Layers size={11} /> Deployment Status</span>
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-neutral-400">Pipeline: <span className="text-white font-bold">Verified Production</span></div>
                    <div className="text-xs font-mono text-neutral-400">Response Offset: <span className="text-emerald-400 font-bold">0.02ms</span></div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-mono text-[#7e7e87] uppercase tracking-widest mb-4 flex items-center gap-1.5"><LayoutGrid size={12} /> Interface Captures (Click Component to Expand)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedProject.gallery.map((img, i) => (
                    <div 
                      key={i}
                      onClick={() => setZoomImage(img.url)}
                      className="bg-[#0a0a0c] border border-white/[0.04] rounded-2xl overflow-hidden p-3 group hover:border-white/20 transition-all cursor-zoom-in relative"
                    >
                      <div className="w-full aspect-[16/10] overflow-hidden rounded-xl bg-neutral-900 relative">
                        <img src={img.url} alt={img.caption} className="w-full h-full object-cover filter grayscale contrast-[1.05] transition-transform duration-500 group-hover:scale-[1.02]" />
                        <div className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-lg text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 size={12} />
                        </div>
                      </div>
                      <p className="text-[11px] font-mono text-neutral-400 mt-3 px-1">{img.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* REAL FUNCTIONAL LEAD CAPTURE FORM DECK */}
      <section id="hire" className="w-full bg-[#0a0a0c]/90 border-t border-white/[0.03] py-24 px-4 sm:px-6 md:px-12 relative z-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#7e7e87] uppercase block">[ CLIENT INGESTION PIPELINE ]</span>
            <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight uppercase">Ready to initiate a contract project?</h3>
            <p className="text-[#7e7e87] text-sm font-light max-w-md mx-auto">Submit your product architecture metrics below to directly queue your deployment consultation scope.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <form onSubmit={handleFormSubmit} className="lg:col-span-7 bg-black border border-white/[0.04] p-6 md:p-8 rounded-2xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Identity / Brand</label>
                  <input required name="name" type="text" placeholder="Alex Rivera" value={formData.name} onChange={handleInputChange} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-white focus:outline-none transition-all text-white placeholder-neutral-600" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Secure Mailbox</label>
                  <input required name="email" type="email" placeholder="alex@brand.com" value={formData.email} onChange={handleInputChange} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-white focus:outline-none transition-all text-white placeholder-neutral-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Project Track</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-white focus:outline-none transition-all text-white cursor-pointer">
                    <option>SaaS Platform</option>
                    <option>E-Commerce Hub</option>
                    <option>Immersive Showroom</option>
                    <option>Custom Matrix Solution</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Target Budget Allocation</label>
                  <select name="budget" value={formData.budget} onChange={handleInputChange} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-white focus:outline-none transition-all text-white cursor-pointer">
                    <option>$1,000 - $2,000</option>
                    <option>$2,000 - $5,000</option>
                    <option>$5,000 - $10,000</option>
                    <option>$10,000+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Architectural Scope Details</label>
                <textarea required name="details" rows={4} placeholder="Describe your performance metrics targets, preferred timeline layouts, or functional design goals..." value={formData.details} onChange={handleInputChange} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-white focus:outline-none transition-all text-white resize-none placeholder-neutral-600" />
              </div>

              <button type="submit" disabled={isSubmitted} className="w-full flex items-center justify-center space-x-2 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {isSubmitted ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-500 animate-pulse" />
                    <span>Transmission Secured</span>
                  </>
                ) : (
                  <>
                    <span>Compile & Transmit Scope</span>
                    <ArrowUpRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="lg:col-span-5 w-full border border-white/[0.05] rounded-2xl bg-black font-mono overflow-hidden shadow-2xl">
              <div className="bg-neutral-900/60 border-b border-white/[0.05] px-4 py-3 flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center space-x-2">
                  <Terminal size={12} className="text-[#7e7e87]" />
                  <span className="font-bold">lead_compilation_stream.sh</span>
                </div>
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                </div>
              </div>
              
              <div className="p-6 text-xs min-h-[295px] flex flex-col justify-between bg-black">
                <div className="space-y-3 text-neutral-400">
                  <p className="text-neutral-500 font-bold">// Live Object Memory Monitor:</p>
                  <div className="bg-[#0a0a0c] p-4 rounded-xl border border-white/[0.02] space-y-1 text-neutral-300">
                    <p><span className="text-purple-400">client_identity:</span> <span className="text-emerald-400">"{formData.name || 'null'}"</span></p>
                    <p><span className="text-purple-400">contact_mailbox:</span> <span className="text-emerald-400">"{formData.email || 'null'}"</span></p>
                    <p><span className="text-purple-400">project_track:</span> <span className="text-emerald-400">"{formData.category}"</span></p>
                    <p><span className="text-purple-400">budget_allocation:</span> <span className="text-amber-400 font-bold">"{formData.budget}"</span></p>
                  </div>
                  <p className="text-emerald-500 font-semibold text-[11px] leading-normal animate-pulse">&gt; {consoleMessage}</p>
                </div>
                <p className="text-[10px] text-neutral-600 pt-4 border-t border-white/[0.03]">Input elements automatically register inside the tracking buffer matrix row.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* EXPERT ZOOM LIGHTBOX OVERLAY GRAPHIC FRAME MASK */}
      <AnimatePresence>
        {zoomImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.95 }} exit={{ opacity: 0 }} onClick={() => setZoomImage(null)} className="absolute inset-0 bg-black cursor-zoom-out" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative max-w-5xl max-h-[85vh] z-10 select-none overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-black p-1">
              <button onClick={() => setZoomImage(null)} className="absolute top-4 right-4 z-20 p-2 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white hover:text-black transition-all cursor-pointer"><X size={16} /></button>
              <img src={zoomImage} alt="Expanded Interface Component View" className="w-full h-auto max-h-[80vh] object-contain rounded-lg filter grayscale" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}