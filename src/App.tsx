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

  // --- 🧬 HARDWARE-ACCELERATED CANVAS GRID ENGINES ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    // Scale canvas to match exactly the viewport limits
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

    // Render loop running outside of React updates for flawless performance
    const renderLoop = () => {
      // Smooth cursor interpolation easing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.12;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.12;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cellSize = 55;
      const padding = 24;
      const glowRadius = 180;

      // Draw Grid Matrix
      for (let x = padding; x < canvas.width - padding; x += cellSize) {
        for (let y = padding; y < canvas.height - padding; y += cellSize) {
          const rectX = x;
          const rectY = y;
          const rectW = cellSize - 6;
          const rectH = cellSize - 6;

          // Compute mathematical proximity parameters to check proximity to mouse coordinates
          const centerX = rectX + rectW / 2;
          const centerY = rectY + rectH / 2;
          const distDX = mouseRef.current.x - centerX;
          const distDY = mouseRef.current.y - centerY;
          const distance = Math.sqrt(distDX * distDX + distDY * distDY);

          let opacity = 0.02; // Baseline inactive alpha structure
          let borderOpacity = 0.05;

          if (distance < glowRadius) {
            // Smooth exponential power falloff curve matching premium interpolation presets
            const proximityFactor = 1 - distance / glowRadius;
            opacity += Math.pow(proximityFactor, 2) * 0.18;
            borderOpacity += Math.pow(proximityFactor, 2) * 0.45;
          }

          // Render Tile Fill Background Node
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.beginPath();
          ctx.roundRect?.(rectX, rectY, rectW, rectH, 4);
          ctx.fill();

          // Render Line Boundaries Glow Framework
          ctx.strokeStyle = `rgba(255, 255, 255, ${borderOpacity})`;
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

  // --- CURSOR CORE TRACKING ---
  const rawX = useMotionValue(-1000);
  const rawY = useMotionValue(-1000);
  const springCursorX = useSpring(rawX, { damping: 40, stiffness: 300, mass: 0.2 });
  const springCursorY = useSpring(rawY, { damping: 40, stiffness: 300, mass: 0.2 });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX - 16);
      rawY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [rawX, rawY]);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

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
    setConsoleMessage("COMPILING PAYLOAD... Establishing safe handshake parameters with transmission node.");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        setConsoleMessage(`TRANSMISSION SUCCESSFUL: Lead packet pushed to queue. Client "${formData.name}" tracked completely.`);
        setFormData({ name: '', email: '', category: 'SaaS Platform', budget: '$2,000 - $5,000', details: '' });
      } else {
        setConsoleMessage("TRANSMISSION ERROR: Endpoint pipeline handshake failed.");
      }
    } catch (err) {
      setConsoleMessage("CRITICAL CORRUPTION FAILURE: Unable to locate active online routing network gateway pipelines.");
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative bg-[#030303] text-white selection:bg-white selection:text-black min-h-screen antialiased overflow-hidden"
    >
      
      {/* 🚀 GLOWING GRID ENGINE: Pure canvas layer mapped completely directly to native viewport coordinates */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-screen h-screen z-0 pointer-events-none bg-[#030303]"
      />

      {/* CUSTOM RING CURSOR */}
      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 border border-white/40 rounded-full pointer-events-none z-50 hidden md:block mix-blend-difference"
        style={{ x: springCursorX, y: springCursorY }}
      />

      {/* NAVBAR */}
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

      {/* SYSTEM MAIN VIEW LAYOUT OVERLAY */}
      <main className="relative z-20">
        <AnimatePresence mode="wait">
          
          {currentPage === 'showroom' && (
            <motion.div
              key="showroom-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.section 
                style={{ opacity: heroOpacity }}
                className="relative h-screen w-full flex flex-col justify-center items-center px-6 md:px-12 border-b border-white/[0.02]"
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
                      className="w-full bg-[#0a0a0c]/80 backdrop-blur-md border border-white/[0.04] rounded-3xl p-6 md:p-10 flex flex-col justify-between group hover:border-white/20 transition-all cursor-pointer relative"
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
                          <button className="flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-xs font-mono tracking-wider hover:bg-white hover:text-black transition-all">
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
                <h4 className="text-xs font-mono text-[#7e7e87] uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <LayoutGrid size={12} /> 
                  <span>Interface Captures (Click Component to Expand)</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedProject.gallery.map((imgUrl, i) => (
                    <div 
                      key={i}
                      onClick={() => setZoomImage(imgUrl)}
                      className="bg-[#0a0a0c] border border-white/[0.04] rounded-2xl overflow-hidden p-3 group hover:border-white/20 transition-all cursor-zoom-in relative"
                    >
                      <div className="w-full aspect-[16/10] overflow-hidden rounded-xl bg-neutral-900 relative">
                        <img src={imgUrl} alt="Interface Frame Capture Segment" className="w-full h-full object-cover filter grayscale contrast-[1.05] transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-lg text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 size={12} />
                        </div>
                      </div>
                      <p className="text-[11px] font-mono text-neutral-400 mt-3 px-1">Blueprint Interface Subview Track Component Module - [0{i + 1}]</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

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
                  <input required name="name" type="text" placeholder="Alex Rivera" value={formData.name} onChange={handleInputChange} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-white/30 focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Secure Mailbox</label>
                  <input required name="email" type="email" placeholder="alex@brand.com" value={formData.email} onChange={handleInputChange} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-white/30 focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Project Track</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-white/30 focus:outline-none transition-colors cursor-pointer">
                    <option>SaaS Platform</option>
                    <option>E-Commerce Hub</option>
                    <option>Immersive Showroom</option>
                    <option>Custom Matrix Solution</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Target Budget Allocation</label>
                  <select name="budget" value={formData.budget} onChange={handleInputChange} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-white/30 focus:outline-none transition-colors cursor-pointer">
                    <option>$1,000 - $2,000</option>
                    <option>$2,000 - $5,000</option>
                    <option>$5,000 - $10,000</option>
                    <option>$10,000+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Architectural Scope Details</label>
                <textarea required name="details" rows={4} placeholder="Describe your performance metrics targets..." value={formData.details} onChange={handleInputChange} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-white/30 focus:outline-none transition-colors resize-none" />
              </div>

              <button type="submit" disabled={isSubmitted} className="w-full flex items-center justify-center space-x-2 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
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

      <AnimatePresence>
        {zoomImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.95 }} exit={{ opacity: 0 }} onClick={() => setZoomImage(null)} className="absolute inset-0 bg-black cursor-zoom-out" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative z-10">
              <button onClick={() => setZoomImage(null)} className="absolute top-4 right-4 z-20 p-2 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white hover:text-black transition-colors cursor-pointer">
                <span className="sr-only">Close</span>
                ✕
              </button>
              <img src={zoomImage} alt="Expanded Interface Component View" className="w-full h-auto max-h-[80vh] object-contain rounded-lg filter grayscale" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}