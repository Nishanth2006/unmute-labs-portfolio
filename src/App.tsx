import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight, Mail, Terminal, ArrowLeft, Maximize2, Cpu, Layers, LayoutGrid, CheckCircle2 } from 'lucide-react';

// --- CONFIGURATION CORNER ---
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xoqykpzo"; 

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
  gallery: string[];
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
    desc: "A high-end interaction showroom featuring dynamic asset loading pipelines, structural text layers, and asynchronous route state transitions engineered specifically for luxury boutique experiences.",
    longDesc: "Aether EV redefines the digital showroom envelope. Built to explore smooth scrolling timelines, it handles custom client-side navigation matrices to keep heavy asset elements loaded efficiently while maintaining fluid 60 FPS performance throughout all interactive sequences.",
    gallery: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800",
      "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800"
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
    desc: "A client-side analytics dashboard workspace. Built with an instantaneous light/dark mode design synchronization pipeline and reactive SVG rendering graphs calculating telemetry metrics in real-time.",
    longDesc: "Nexus Analytics scales performance interpretation by bringing enterprise data tracking directly to the client view layer. It features dynamic mathematical path plotting variables to transform raw datasets into visual narratives without backend latency.",
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800"
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
    desc: "A premium retail storefront interface featuring live dynamic array filtering, transactional cart state management arrays, and smooth structural modal cart overlays optimized heavily for conversion.",
    longDesc: "Velocity Gear uses deep-state state manipulation architecture to keep client cart item parameters updated in absolute real-time. Paired with localized product filter pipelines, it delivers instant user feedback without network roundtrips.",
    gallery: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800"
    ]
  }
];

export default function App() {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [consoleMessage, setConsoleMessage] = useState<string>("Booting workspace framework... Ready.");
  const [currentPage, setCurrentPage] = useState<'showroom' | 'project'>('showroom');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [cursorState, setCursorState] = useState<'default' | 'hovered' | 'click'>('default');

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    category: 'SaaS Platform',
    budget: '$2,000 - $5,000',
    details: ''
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // --- CANVAS BACKGROUND ENGINE ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const renderLoop = () => {
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.12;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.12;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cellSize = 55;
      const padding = 24;
      const glowRadius = 180;

      for (let x = padding; x < canvas.width - padding; x += cellSize) {
        for (let y = padding; y < canvas.height - padding; y += cellSize) {
          const rectX = x;
          const rectY = y;
          const rectW = cellSize - 6;
          const rectH = cellSize - 6;

          const centerX = rectX + rectW / 2;
          const centerY = rectY + rectH / 2;
          const distDX = mouseRef.current.x - centerX;
          const distDY = mouseRef.current.y - centerY;
          const distance = Math.sqrt(distDX * distDX + distDY * distDY);

          let opacity = 0.02; 
          let borderOpacity = 0.05;

          if (distance < glowRadius) {
            const proximityFactor = 1 - distance / glowRadius;
            opacity += Math.pow(proximityFactor, 2) * 0.18;
            borderOpacity += Math.pow(proximityFactor, 2) * 0.35;
          }

          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.beginPath();
          ctx.roundRect?.(rectX, rectY, rectW, rectH, 4);
          ctx.fill();

          ctx.strokeStyle = distance < glowRadius ? `rgba(52, 211, 153, ${borderOpacity})` : `rgba(255, 255, 255, ${borderOpacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // --- INTERACTIVE LOG SCRAMBLER MATRIX ---
  const triggerGlitchText = (targetString: string) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_-+=";
    let iterations = 0;
    const interval = setInterval(() => {
      // 🎯 FIXED: Removed unused 'prev' argument array reference
      setConsoleMessage(() => targetString
        .split("")
        .map((letter, index) => {
          if (index < iterations) return targetString[index];
          if (letter === " ") return " ";
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("")
      );
      if (iterations >= targetString.length) clearInterval(interval);
      iterations += 2;
    }, 20);
  };

  useEffect(() => {
    triggerGlitchText("BOOT PARAMETERS INITIALIZED: Safe workspace core up and running cleanly. System Online.");
  }, []);

  // --- CURSOR TRACKING MATRIX ---
  const rawX = useMotionValue(-1000);
  const rawY = useMotionValue(-1000);
  const springCursorX = useSpring(rawX, { damping: 30, stiffness: 350, mass: 0.15 });
  const springCursorY = useSpring(rawY, { damping: 30, stiffness: 350, mass: 0.15 });

  const lightboxMouseX = useMotionValue(0);
  const lightboxMouseY = useMotionValue(0);
  const springLightboxX = useSpring(lightboxMouseX, { damping: 40, stiffness: 200 });
  const springLightboxY = useSpring(lightboxMouseY, { damping: 40, stiffness: 200 });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);

      if (zoomImage) {
        const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        lightboxMouseX.set(dx * 25);
        lightboxMouseY.set(dy * 25);
      }
    };
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [rawX, rawY, zoomImage]);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const scaleXProgress = useSpring(scrollYProgress, { stiffness: 400, damping: 50 });
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const filteredProjects = activeFilter === "ALL" 
    ? PORTFOLIO_DB 
    : PORTFOLIO_DB.filter(p => p.category.toUpperCase() === activeFilter);

  const navigateToProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentPage('project');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerGlitchText(`ROUTE DISPATCHED: Initialized module pipeline map for [${project.title}]. Ready.`);
  };

  const backToShowroom = () => {
    setCurrentPage('showroom');
    setSelectedProject(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerGlitchText("WORKSPACE REDIRECTED: Switched framework context deck link back to root showroom display.");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    triggerGlitchText(`BUFFER DECRYPT: Local context stream input parameters [form_${name}] modified.`);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerGlitchText("TRANSMISSION VECTOR COMPILED. Dispatching handshake packet arrays...");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        triggerGlitchText(`SUCCESS HANDSHAKE: Payload delivered securely. Ingestion log clear for "${formData.name}".`);
        setFormData({ name: '', email: '', category: 'SaaS Platform', budget: '$2,000 - $5,000', details: '' });
      } else {
        triggerGlitchText("HANDSHAKE EXCEPTION: Remote connection array returned invalid status parameters.");
      }
    } catch (err) {
      triggerGlitchText("NETWORK FAULT MATRIX: Network routing interface dropped synchronization parameters.");
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative bg-[#030303] text-white selection:bg-emerald-500 selection:text-black min-h-screen antialiased overflow-hidden"
    >
      
      {/* Scroll Progress Tracker */}
      <motion.div 
        style={{ scaleX: scaleXProgress }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 origin-left z-50 pointer-events-none"
      />

      {/* CANVAS BACKGROUND ENGINE */}
      <canvas ref={canvasRef} className="fixed inset-0 w-screen h-screen z-0 pointer-events-none bg-[#030303]" />

      {/* Dynamic Cursor Ring */}
      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 hidden md:block border"
        animate={{
          x: cursorState === 'hovered' ? springCursorX.get() - 24 : springCursorX.get() - 16,
          y: cursorState === 'hovered' ? springCursorY.get() - 24 : springCursorY.get() - 16,
          scale: cursorState === 'hovered' ? 1.6 : 1,
          borderColor: cursorState === 'hovered' ? '#34d399' : 'rgba(255,255,255,0.4)',
          backgroundColor: cursorState === 'hovered' ? 'rgba(52, 211, 153, 0.08)' : 'rgba(255,255,255,0)'
        }}
        style={{ originX: 0.5, originY: 0.5 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />

      {/* NAVBAR */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 w-full z-40 border-b border-white/[0.03] backdrop-blur-md bg-[#030303]/30 px-6 md:px-12 py-6 flex justify-between items-center pointer-events-none"
      >
        <button 
          onClick={backToShowroom} 
          onMouseEnter={() => setCursorState('hovered')}
          onMouseLeave={() => setCursorState('default')}
          className="flex items-center space-x-2 text-left bg-transparent border-none cursor-pointer pointer-events-auto group"
        >
          <span className="font-extrabold text-sm tracking-[0.3em] uppercase group-hover:text-emerald-400 transition-colors">UNMUTE LABS</span>
          <div className="relative flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="absolute left-4 bg-[#0a0a0c] border border-white/10 text-[9px] font-mono px-2 py-0.5 rounded text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-widest pointer-events-none">
              SYSTEM ONLINE
            </span>
          </div>
        </button>
        <a 
          href="#hire" 
          onMouseEnter={() => setCursorState('hovered')}
          onMouseLeave={() => setCursorState('default')}
          className="flex items-center space-x-2 text-[11px] uppercase tracking-widest font-bold px-5 py-2.5 bg-white text-black rounded-xl hover:bg-emerald-400 hover:text-black transition-all font-mono pointer-events-auto cursor-pointer"
        >
          <Mail size={12} />
          <span>Request Pipeline</span>
        </a>
      </motion.nav>

      {/* MAIN LAYOUT SITE CONTAINER */}
      <main className="relative z-20 pointer-events-none">
        <AnimatePresence mode="wait">
          
          {currentPage === 'showroom' && (
            <motion.div key="showroom-view" className="pointer-events-auto">
              
              {/* HERO SECTION DECK */}
              <motion.section 
                style={{ opacity: heroOpacity }}
                className="relative h-screen w-full flex flex-col justify-center items-center px-6 md:px-12 border-b border-white/[0.02]"
              >
                {/* 🎯 FIXED: Hooked up heroTextY inside a motion element layer seamlessly */}
                <motion.div style={{ y: heroTextY }} className="text-center max-w-4xl space-y-6 z-10 relative">
                  <motion.span 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-[10px] font-mono tracking-[0.4em] text-[#7e7e87] uppercase block"
                  >
                    [ FRONTEND ARCHITECT / INTERACTION SPECIALIST ]
                  </motion.span>
                  
                  {/* 🎯 FIXED: Restored perfect </motion.h1> syntax pairing limits */}
                  <motion.h1 
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl sm:text-7xl font-black tracking-tighter uppercase leading-[0.95] mb-4 relative"
                  >
                    High-fidelity code. <br/>
                    <span className="bg-gradient-to-r from-white via-emerald-400 to-teal-500 bg-clip-text text-transparent block mt-2 drop-shadow-[0_0_30px_rgba(52,211,153,0.15)]">
                      Fluid digital motion.
                    </span>
                  </motion.h1>

                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-[#7e7e87] text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed relative z-10"
                  >
                    Engineering ultra-smooth web systems, responsive interface engines, and zero-latency state controllers tailored specifically for premium corporate platforms.
                  </motion.p>

                  {/* Brand Audio Waveform Mesh Layout */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none z-0 opacity-15">
                    <svg viewBox="0 0 800 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M0 100 Q 100 20, 200 100 T 400 100 T 600 100 T 800 100" 
                        fill="none" 
                        stroke="url(#emerald-wave)" 
                        strokeWidth="1.5"
                        className="animate-[pulse_4s_infinite_ease-in-out]"
                      />
                      <path 
                        d="M0 100 Q 150 160, 300 100 T 600 100 T 900 100" 
                        fill="none" 
                        stroke="url(#emerald-wave)" 
                        strokeWidth="1"
                        className="animate-[pulse_6s_infinite_ease-in-out_1s]"
                      />
                      <defs>
                        <linearGradient id="emerald-wave" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#030303" />
                          <stop offset="50%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#030303" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </motion.div>
              </motion.section>

              {/* PRODUCT SHOWROOM EXHIBITION */}
              <section className="w-full py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative">
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
                        onMouseEnter={() => setCursorState('hovered')}
                        onMouseLeave={() => setCursorState('default')}
                        className={`px-4 py-2 rounded-lg font-medium tracking-wide transition-all uppercase cursor-pointer ${activeFilter === category ? 'bg-emerald-500 text-black font-extrabold shadow-[0_0_20px_rgba(52,211,153,0.3)]' : 'text-[#7e7e87] hover:text-white'}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter Swapping Cross-fade Container Grid */}
                <motion.div layout className="grid grid-cols-1 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project, i) => (
                      <motion.div
                        layout
                        key={project.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ y: -6, scale: 1.005, boxShadow: "0 20px 40px -15px rgba(52, 211, 153, 0.12)" }}
                        onClick={() => navigateToProject(project)}
                        onMouseEnter={() => setCursorState('hovered')}
                        onMouseLeave={() => setCursorState('default')}
                        className="w-full bg-[#0a0a0c]/80 backdrop-blur-md rounded-3xl p-6 md:p-10 flex flex-col justify-between group cursor-pointer relative border border-white/[0.04] project-vector-card overflow-hidden"
                      >
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.5" y="0.5" width="100%" height="100%" rx="24" fill="none" className="vector-laser-stroke" />
                        </svg>

                        <div className="absolute -top-6 -right-6 text-[11vw] font-black text-white/[0.05] group-hover:text-emerald-400/[0.06] transition-colors select-none uppercase pointer-events-none font-mono leading-none">
                          {project.num}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
                          <div className="lg:col-span-1 space-y-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-xs font-mono font-bold text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-md bg-emerald-500/5">
                                {project.category}
                              </span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black tracking-tight uppercase group-hover:text-emerald-300 transition-colors">
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
                            <button className="flex items-center space-x-3 bg-white/5 border border-white/10 group-hover:border-emerald-400/40 group-hover:bg-emerald-500 group-hover:text-black px-6 py-4 rounded-xl text-xs font-mono tracking-wider transition-all pointer-events-none">
                              <span>Explore Interface Case</span>
                              <ArrowUpRight size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </section>
            </motion.div>
          )}

          {currentPage === 'project' && selectedProject && (
            <motion.div
              key="project-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="pt-28 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto pb-24 pointer-events-auto"
            >
              <button 
                onClick={backToShowroom}
                onMouseEnter={() => setCursorState('hovered')}
                onMouseLeave={() => setCursorState('default')}
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
                    <span key={idx} className="text-[10px] font-mono px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-400">{t}</span>
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
                <h4 className="text-xs font-mono text-[#7e7e87] uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <LayoutGrid size={12} /> 
                  <span>Interface Captures (Click Component to Expand)</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedProject.gallery.map((imgUrl, i) => (
                    <div 
                      key={i}
                      onClick={() => setZoomImage(imgUrl)}
                      onMouseEnter={() => setCursorState('hovered')}
                      onMouseLeave={() => setCursorState('default')}
                      className="bg-[#0a0a0c]/80 border border-white/[0.04] rounded-2xl overflow-hidden p-3 group hover:border-emerald-500/30 transition-all cursor-zoom-in relative"
                    >
                      <div className="w-full aspect-[16/10] overflow-hidden rounded-xl bg-neutral-900 relative">
                        <img 
                          src={imgUrl} 
                          alt="Interface Segment Capture" 
                          className="w-full h-full object-cover filter grayscale contrast-[1.05] group-hover:grayscale-0 group-hover:contrast-[1.0] transition-all duration-700 ease-out group-hover:scale-[1.03]" 
                        />
                        <div className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-lg text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 size={12} />
                        </div>
                      </div>
                      <p className="text-[11px] font-mono text-neutral-400 mt-3 px-1">Blueprint Interface Component Segment - [0{i + 1}]</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* CLIENT PIPELINE INGESTION GRID */}
      <section id="hire" className="w-full bg-[#0a0a0c]/90 border-t border-white/[0.03] py-24 px-4 sm:px-6 md:px-12 relative z-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#7e7e87] uppercase block">[ CLIENT INGESTION PIPELINE ]</span>
            <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight uppercase">Ready to initiate a contract project?</h3>
            <p className="text-[#7e7e87] text-sm font-light max-w-md mx-auto">Submit your product architecture metrics below to directly queue your deployment consultation scope.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form onSubmit={handleFormSubmit} className="lg:col-span-7 bg-black border border-white/[0.04] p-6 md:p-8 rounded-2xl space-y-6 pointer-events-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Identity / Brand</label>
                  <input required name="name" type="text" placeholder="Alex Rivera" value={formData.name} onChange={handleInputChange} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-emerald-500/40 focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Secure Mailbox</label>
                  <input required name="email" type="email" placeholder="alex@brand.com" value={formData.email} onChange={handleInputChange} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-emerald-500/40 focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Project Track</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-emerald-500/40 focus:outline-none transition-colors cursor-pointer">
                    <option>SaaS Platform</option>
                    <option>E-Commerce Hub</option>
                    <option>Immersive Showroom</option>
                    <option>Custom Matrix Solution</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Target Budget Allocation</label>
                  <select name="budget" value={formData.budget} onChange={handleInputChange} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-emerald-500/40 focus:outline-none transition-colors cursor-pointer">
                    <option>$1,000 - $2,000</option>
                    <option>$2,000 - $5,000</option>
                    <option>$5,000 - $10,000</option>
                    <option>$10,000+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Architectural Scope Details</label>
                <textarea required name="details" rows={4} placeholder="Describe your performance metrics targets..." value={formData.details} onChange={handleInputChange} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-emerald-500/40 focus:outline-none transition-colors resize-none" />
              </div>

              <button type="submit" disabled={isSubmitted} onMouseEnter={() => setCursorState('hovered')} onMouseLeave={() => setCursorState('default')} className="w-full flex items-center justify-center space-x-2 bg-emerald-500 text-black font-mono font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {isSubmitted ? (
                  <>
                    <CheckCircle2 size={14} className="text-black animate-pulse" />
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

            {/* MONITOR CONSOLE */}
            <div className="lg:col-span-5 w-full border border-white/[0.05] rounded-2xl bg-black font-mono overflow-hidden shadow-2xl pointer-events-auto">
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
                  <p className="text-emerald-500 font-semibold text-[11px] leading-normal min-h-[50px] transition-all break-words">&gt; {consoleMessage}</p>
                </div>
                <p className="text-[10px] text-neutral-600 pt-4 border-t border-white/[0.03]">Input elements automatically register inside the tracking buffer matrix row.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OVERLAY LIGHTBOX */}
      <AnimatePresence>
        {zoomImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto backdrop-blur-xl bg-black/60">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setZoomImage(null)} className="absolute inset-0 cursor-zoom-out" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.93 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.93 }} 
              style={{ x: springLightboxX, y: springLightboxY }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }} 
              className="relative z-10 max-w-5xl max-h-[85vh] select-none rounded-2xl p-1 bg-[#0a0a0c] border border-emerald-500/20 shadow-[0_25px_60px_-10px_rgba(52,211,153,0.15)]"
            >
              <button onClick={() => setZoomImage(null)} className="absolute top-4 right-4 z-20 p-2 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-emerald-400 hover:text-black transition-colors cursor-pointer">
                <span className="sr-only">Close</span>✕
              </button>
              <img src={zoomImage} alt="Expanded Frame View" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}