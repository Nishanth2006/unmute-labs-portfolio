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
  category: 'Privacy / Social Architecture' | 'AI Architecture' | 'Commerce / FinTech';
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

interface ParticleNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  radius: number;
}

const BOOT_DURATION = 2000;
const BOOT_FRAGMENTS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_+-=[]{}<>/';
const BOOT_LINES = [
  'Initializing local launch sequence...',
  'Decrypting private context cache...',
  'Pinning offline weights into memory...',
  'Local Context Engine: ONLINE',
];

const PROJECT_FILTERS = [
  { label: 'ALL', value: 'ALL' },
  { label: 'PRIVACY / SOCIAL', value: 'PRIVACY / SOCIAL ARCHITECTURE' },
  { label: 'AI ARCHITECTURE', value: 'AI ARCHITECTURE' },
  { label: 'COMMERCE / FINTECH', value: 'COMMERCE / FINTECH' },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const scrambleBootText = (value: string, progress: number) => {
  const revealCount = Math.floor(value.length * clamp(progress, 0, 1));

  return value
    .split('')
    .map((character, index) => {
      if (character === ' ') return ' ';
      if (index < revealCount) return character;

      const fragmentIndex = (index * 13 + Math.floor(progress * 100)) % BOOT_FRAGMENTS.length;
      return BOOT_FRAGMENTS[fragmentIndex];
    })
    .join('');
};

const buildParticleField = (width: number, height: number) => {
  const spacing = Math.max(120, Math.min(width, height) / 5.5);
  const columns = Math.max(5, Math.ceil(width / spacing));
  const rows = Math.max(4, Math.ceil(height / spacing));
  const nodes: ParticleNode[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const offsetX = (Math.random() - 0.5) * spacing * 0.35;
      const offsetY = (Math.random() - 0.5) * spacing * 0.35;

      nodes.push({
        x: clamp((column + 0.5) * spacing + offsetX, 24, width - 24),
        y: clamp((row + 0.5) * spacing + offsetY, 24, height - 24),
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        phase: Math.random() * Math.PI * 2,
        radius: 1.2 + Math.random() * 1.4,
      });
    }
  }

  return nodes;
};

interface TiltProjectCardProps {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
  onCursorStateChange: (state: 'default' | 'hovered' | 'click') => void;
}

const TiltProjectCard = ({ project, index, onOpen, onCursorStateChange }: TiltProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothRotateX = useSpring(rotateX, { stiffness: 120, damping: 24, mass: 0.65 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 120, damping: 24, mass: 0.65 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);
  const tiltX = useTransform(smoothRotateY, [-0.42, 0.42], [6.5, -6.5]);
  const tiltY = useTransform(smoothRotateX, [-0.42, 0.42], [-6.5, 6.5]);
  const [glareState, setGlareState] = useState({ x: 50, y: 50, opacity: 0 });
  const resetTimeoutRef = useRef<number | null>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;
    const centeredX = relativeX - 0.5;
    const centeredY = 0.5 - relativeY;
    const deadZone = 0.075;
    const normalizedX = Math.abs(centeredX) < deadZone ? 0 : clamp(centeredX / 0.5, -1, 1);
    const normalizedY = Math.abs(centeredY) < deadZone ? 0 : clamp(centeredY / 0.5, -1, 1);

    if (resetTimeoutRef.current) window.clearTimeout(resetTimeoutRef.current);

    rotateX.set(normalizedX);
    rotateY.set(normalizedY);
    glareX.set(relativeX * 100);
    glareY.set(relativeY * 100);
    glareOpacity.set(1);
    setGlareState({ x: relativeX * 100, y: relativeY * 100, opacity: 1 });
    onCursorStateChange('hovered');
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
    glareOpacity.set(0);
    if (resetTimeoutRef.current) window.clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = window.setTimeout(() => {
      setGlareState({ x: 50, y: 50, opacity: 0 });
    }, 0);
    onCursorStateChange('default');
  };

  return (
    <div className="group" style={{ perspective: 1400 }}>
      <motion.div
        ref={cardRef}
        layout
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -8 }}
        onClick={() => onOpen(project)}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={() => onCursorStateChange('click')}
        onPointerUp={() => onCursorStateChange('hovered')}
        className="project-vector-card w-full bg-[#0a0a0c]/80 backdrop-blur-md rounded-3xl p-6 md:p-10 flex flex-col justify-between group cursor-pointer relative border border-white/[0.04] overflow-hidden"
        style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: glareOpacity,
            background: `radial-gradient(circle at ${glareState.x}% ${glareState.y}%, rgba(52, 211, 153, 0.18), rgba(255, 255, 255, 0.06) 18%, transparent 60%)`,
          }}
        />

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
              {project.tech.map((tech, techIndex) => (
                <span key={techIndex} className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/[0.02] border border-white/[0.03] text-neutral-400">
                  {tech}
                </span>
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
    </div>
  );
};

const buildTerminalAnalysis = (field: keyof FormState, value: string) => {
  const cleanValue = value.trim() || 'null';

  if (field === 'budget') {
    if (cleanValue.includes('$10,000+')) {
      return 'Analyzing scope... High-tier resource allocation detected. Adjusting priority matrix for private implementation lanes.';
    }

    if (cleanValue.includes('$5,000 - $10,000')) {
      return 'Analyzing scope... Mid-to-high budget corridor detected. Balancing velocity with privacy-first architecture.';
    }

    return `Analyzing scope... Budget profile ${cleanValue} routed through delivery matrix.`;
  }

  if (field === 'name') {
    return `Identity resolved for ${cleanValue}. Establishing high-trust communication channel.`;
  }

  if (field === 'email') {
    return `Secure mailbox ${cleanValue} validated. Routing response through encrypted intake lane.`;
  }

  if (field === 'category') {
    return `Project track ${cleanValue} selected. Aligning solution topology with the requested delivery class.`;
  }

  return `Scope packet ingested. Context density evaluated from ${cleanValue.length} characters and staged for review.`;
};

const PhilosophySection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.3 });
  const leftShift = useTransform(smoothProgress, [0, 1], [0, -72]);
  const isolationStroke = useTransform(smoothProgress, [0, 0.16, 0.42, 0.78, 1], [1480, 1260, 600, 120, 0]);
  const isolationNodes = useTransform(smoothProgress, [0, 0.18, 0.5, 1], [0.28, 0.6, 1, 1]);
  const scalingStroke = useTransform(smoothProgress, [0, 0.12, 0.38, 0.72, 1], [1620, 1420, 780, 210, 0]);
  const scalingBars = useTransform(smoothProgress, [0, 0.24, 0.52, 0.86, 1], [0.16, 0.5, 0.82, 1, 1]);
  const emphasis = useTransform(smoothProgress, [0, 0.14, 0.36, 0.82, 1], [0.38, 0.82, 1, 1, 0.96]);

  return (
    <section ref={sectionRef} className="relative w-full min-h-[230vh] px-4 sm:px-6 md:px-12 py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <motion.div
          style={{ y: leftShift, opacity: emphasis }}
          className="lg:col-span-5 lg:sticky lg:top-24 space-y-6 self-start"
        >
          <span className="text-[10px] font-mono tracking-[0.45em] uppercase text-[#7e7e87] block">
            [ BUSINESS + PRIVACY-FIRST AI ]
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95]">
            AI systems that respect context, preserve privacy, and still move the business forward.
          </h2>
          <p className="text-[#a1a1aa] text-sm sm:text-base font-light leading-relaxed max-w-xl">
            The philosophy is simple: keep inference local whenever possible, isolate sensitive workflow data, and design execution layers that remain legible to operators in commerce and FinTech.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              'Local inference',
              'Private context boundaries',
              'Finance-grade scaling',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/5 bg-[#0a0a0c]/70 p-4 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-400 font-mono mb-2">Core signal</p>
                <p className="text-sm text-white/85 leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="lg:col-span-7 space-y-6">
          <motion.div
            className="rounded-[28px] border border-white/5 bg-[#0a0a0c]/75 backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_80px_-30px_rgba(52,211,153,0.12)]"
            style={{ opacity: emphasis }}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#7e7e87]">Offline data isolation</p>
                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight mt-1">Private context boundary</h3>
              </div>
              <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-emerald-400">draws with scroll</div>
            </div>

            <svg viewBox="0 0 700 360" className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="isolation-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(52, 211, 153, 0.18)" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="rgba(45, 212, 191, 0.9)" />
                </linearGradient>
              </defs>

              <motion.rect
                x="26"
                y="26"
                width="648"
                height="308"
                rx="28"
                fill="none"
                stroke="url(#isolation-stroke)"
                strokeWidth="1.4"
                style={{ strokeDasharray: 1480, strokeDashoffset: isolationStroke }}
              />
              <motion.path
                d="M120 182H250M250 182V98M250 98H360M360 98V252M360 252H490M490 252V150M490 150H590"
                fill="none"
                stroke="url(#isolation-stroke)"
                strokeWidth="1.6"
                strokeLinecap="round"
                style={{ strokeDasharray: 760, strokeDashoffset: isolationStroke }}
              />
              <motion.circle
                cx="120"
                cy="182"
                r="14"
                fill="rgba(8, 15, 12, 0.92)"
                stroke="#34d399"
                strokeWidth="1.4"
                style={{ strokeDasharray: 90, strokeDashoffset: isolationStroke, opacity: isolationNodes }}
              />
              <motion.circle
                cx="250"
                cy="98"
                r="18"
                fill="rgba(8, 15, 12, 0.92)"
                stroke="#34d399"
                strokeWidth="1.4"
                style={{ strokeDasharray: 90, strokeDashoffset: isolationStroke, opacity: isolationNodes }}
              />
              <motion.circle
                cx="360"
                cy="252"
                r="18"
                fill="rgba(8, 15, 12, 0.92)"
                stroke="#34d399"
                strokeWidth="1.4"
                style={{ strokeDasharray: 90, strokeDashoffset: isolationStroke, opacity: isolationNodes }}
              />
              <motion.circle
                cx="490"
                cy="150"
                r="18"
                fill="rgba(8, 15, 12, 0.92)"
                stroke="#34d399"
                strokeWidth="1.4"
                style={{ strokeDasharray: 90, strokeDashoffset: isolationStroke, opacity: isolationNodes }}
              />
              <motion.rect
                x="540"
                y="86"
                width="92"
                height="128"
                rx="16"
                fill="rgba(52, 211, 153, 0.04)"
                stroke="#34d399"
                strokeWidth="1.2"
                style={{ strokeDasharray: 220, strokeDashoffset: isolationStroke, opacity: isolationNodes }}
              />
              <text x="56" y="62" fill="rgba(255,255,255,0.32)" fontSize="11" letterSpacing="3" fontFamily="monospace">LOCAL SANDBOX</text>
            </svg>
          </motion.div>

          <motion.div
            className="rounded-[28px] border border-white/5 bg-[#0a0a0c]/75 backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_80px_-30px_rgba(52,211,153,0.12)]"
            style={{ opacity: emphasis }}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#7e7e87]">FinTech scaling</p>
                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight mt-1">Trusted growth lattice</h3>
              </div>
              <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-emerald-400">systems thinking</div>
            </div>

            <svg viewBox="0 0 700 320" className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="scale-stroke" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.92" />
                </linearGradient>
              </defs>

              <motion.path
                d="M52 266H636"
                fill="none"
                stroke="url(#scale-stroke)"
                strokeWidth="1.4"
                strokeLinecap="round"
                style={{ strokeDasharray: 1200, strokeDashoffset: scalingStroke }}
              />
              <motion.path
                d="M84 262V188L188 188V126L294 126V88L400 88V58L518 58V34"
                fill="none"
                stroke="url(#scale-stroke)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ strokeDasharray: 980, strokeDashoffset: scalingStroke }}
              />
              {[
                { x: 84, y: 262, r: 13 },
                { x: 188, y: 188, r: 15 },
                { x: 294, y: 126, r: 17 },
                { x: 400, y: 88, r: 17 },
                { x: 518, y: 58, r: 19 },
              ].map((node, nodeIndex) => (
                <motion.circle
                  key={nodeIndex}
                  cx={node.x}
                  cy={node.y}
                  r={node.r}
                  fill="rgba(8, 15, 12, 0.92)"
                  stroke="#2dd4bf"
                  strokeWidth="1.4"
                  style={{ strokeDasharray: 100, strokeDashoffset: scalingStroke, opacity: scalingBars }}
                />
              ))}
              <motion.rect
                x="560"
                y="26"
                width="86"
                height="226"
                rx="20"
                fill="rgba(52, 211, 153, 0.05)"
                stroke="#2dd4bf"
                strokeWidth="1.2"
                style={{ strokeDasharray: 260, strokeDashoffset: scalingStroke, opacity: scalingBars }}
              />
              {[0, 1, 2, 3].map((bar) => (
                <motion.rect
                  key={bar}
                  x={578 + bar * 14}
                  y={210 - bar * 18}
                  width="8"
                  height={36 + bar * 28}
                  rx="4"
                  fill="rgba(45, 212, 191, 0.7)"
                  style={{ strokeDasharray: 90, strokeDashoffset: scalingStroke, opacity: scalingBars }}
                />
              ))}
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const PORTFOLIO_DB: Project[] = [
  {
    id: "unmuteyou",
    num: "01",
    title: "UNMUTEYOU",
    tagline: "Anonymous Support Matrix",
    category: "Privacy / Social Architecture",
    metrics: "Zero-leak routing / Privacy-first social rails",
    tech: ["React", "Context Isolation", "Secure Routing", "Framer Motion"],
    desc: "A secure, anonymous application designed as a safe space for teenagers to discuss personal struggles. The interface emphasizes secure routing, privacy-first design, and zero-leak data architecture.",
    longDesc: "UnmuteYou is structured as a privacy-preserving support layer where identity boundaries, content routing, and session handling are isolated by design. The experience is intended to feel emotionally accessible while maintaining strict control over data exposure, metadata retention, and route-level privacy constraints.",
    gallery: []
  },
  {
    id: "local-context-engine",
    num: "02",
    title: "LOCAL CONTEXT ENGINE",
    tagline: "Offline Voice-Controlled Assistant",
    category: "AI Architecture",
    metrics: "Private desktop inference / Real-time intent parsing",
    tech: ["Local AI", "Voice Control", "Desktop Hardware", "Offline-First"],
    desc: "A personalized, context-aware voice control AI built specifically for local desktop hardware. It operates completely offline, guaranteeing zero online data exposure while maintaining high-speed intent parsing.",
    longDesc: "Local Context Engine treats the desktop as a trusted runtime. It combines offline speech interpretation, local memory anchoring, and deterministic command dispatch so that the assistant can respond quickly without leaking context to external services or cloud APIs.",
    gallery: []
  },
  {
    id: "ai-generalist-fintech-synthesis",
    num: "03",
    title: "AI GENERALIST & FINTECH SYNTHESIS",
    tagline: "Applied Business Intelligence",
    category: "Commerce / FinTech",
    metrics: "Business logic fusion / Offline financial pipelines",
    tech: ["React", "Local Models", "FinTech Ops", "Business Intelligence"],
    desc: "An exploration into integrating local AI models with commerce and business management systems. It bridges the gap between high-end financial technology and offline data processing pipelines.",
    longDesc: "AI Generalist & FinTech Synthesis maps local model outputs into commerce and management workflows that remain operationally clear to business teams. The architecture is designed around offline intelligence, contextual decision support, and high-trust financial process automation without compromising data sovereignty.",
    gallery: []
  }
];

export default function App() {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [consoleMessage, setConsoleMessage] = useState<string>("Booting workspace framework... Ready.");
  const [terminalHistory, setTerminalHistory] = useState<string[]>(['Awaiting field analysis handshake...']);
  const [bootComplete, setBootComplete] = useState<boolean>(false);
  const [bootProgress, setBootProgress] = useState<number>(0);
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

  // --- HARDWARE-ACCELERATED CANVAS BACKGROUND NEURAL FIELD ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const particleFieldRef = useRef<ParticleNode[]>([]);
  const canvasFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * devicePixelRatio);
      canvas.height = Math.floor(window.innerHeight * devicePixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      particleFieldRef.current = buildParticleField(window.innerWidth, window.innerHeight);
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

      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const nodes = particleFieldRef.current;
      const linkDistance = 175;
      const cursorDistance = 190;
      const cursorX = mouseRef.current.x;
      const cursorY = mouseRef.current.y;

      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        node.phase += 0.018;
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 18 || node.x > width - 18) node.vx *= -1;
        if (node.y < 18 || node.y > height - 18) node.vy *= -1;

        node.x = clamp(node.x, 18, width - 18);
        node.y = clamp(node.y, 18, height - 18);

        for (let otherIndex = index + 1; otherIndex < nodes.length; otherIndex += 1) {
          const other = nodes[otherIndex];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > linkDistance) continue;

          const linkAlpha = (1 - distance / linkDistance) * 0.16;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(52, 211, 153, ${linkAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }

        const cursorDx = cursorX - node.x;
        const cursorDy = cursorY - node.y;
        const cursorNodeDistance = Math.sqrt(cursorDx * cursorDx + cursorDy * cursorDy);
        const proximity = cursorNodeDistance < cursorDistance ? 1 - cursorNodeDistance / cursorDistance : 0;
        const pulse = 0.45 + Math.sin(node.phase) * 0.28;
        const opacity = 0.35 + proximity * 0.45;
        const radius = node.radius + pulse + proximity * 1.6;

        if (proximity > 0) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(52, 211, 153, ${proximity * 0.32})`;
          ctx.lineWidth = 1;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(cursorX, cursorY);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(248, 250, 252, ${0.25 + opacity * 0.45})`;
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(52, 211, 153, ${0.06 + proximity * 0.18})`;
        ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
        ctx.fill();
      }

      canvasFrameRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (canvasFrameRef.current) cancelAnimationFrame(canvasFrameRef.current);
    };
  }, []);

  // --- INTERACTIVE TERMINAL MONITOR ---
  const triggerGlitchText = (targetString: string) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_-+=";
    let iterations = 0;
    const interval = setInterval(() => {
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
    const bootTimer = window.setTimeout(() => {
      triggerGlitchText('BOOT PARAMETERS INITIALIZED: Local context engine up and running cleanly. System Online.');
    }, BOOT_DURATION);

    return () => window.clearTimeout(bootTimer);
  }, []);

  useEffect(() => {
    const startedAt = performance.now();
    const intervalId = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const nextProgress = Math.min(1, elapsed / BOOT_DURATION);

      setBootProgress(nextProgress);

      if (elapsed >= BOOT_DURATION) {
        window.clearInterval(intervalId);
        setBootComplete(true);
      }
    }, 32);

    return () => window.clearInterval(intervalId);
  }, []);

  // --- CURSOR TRACKING MATRIX ---
  const rawX = useMotionValue(-1000);
  const rawY = useMotionValue(-1000);
  const springCursorX = useSpring(rawX, { damping: 25, stiffness: 400, mass: 0.1 });
  const springCursorY = useSpring(rawY, { damping: 25, stiffness: 400, mass: 0.1 });

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

  const pushTerminalAnalysis = (message: string) => {
    setTerminalHistory(prev => [...prev.slice(-4), message]);
    triggerGlitchText(message);
  };

  const handleFieldBlur = (field: keyof FormState, value: string) => {
    pushTerminalAnalysis(buildTerminalAnalysis(field, value));
  };

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
      
      {/* Scroll Progress Indicator */}
      <motion.div 
        style={{ scaleX: scaleXProgress }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 origin-left z-50 pointer-events-none"
      />

      {/* CANVAS BACKGROUND ENGINE */}
      <canvas ref={canvasRef} className="neural-canvas fixed inset-0 w-screen h-screen z-0 pointer-events-none bg-[#030303]" />

      <AnimatePresence mode="wait">
        {!bootComplete && (
          <motion.div
            key="boot-sequence"
            className="fixed inset-0 z-[60] flex items-center justify-center px-4 sm:px-6 bg-[radial-gradient(circle_at_top,_rgba(8,15,12,0.98),_rgba(2,6,3,0.98)_55%,_rgba(0,0,0,1)_100%)]"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06, filter: 'blur(10px)' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="boot-shell w-full max-w-2xl rounded-[28px] border border-emerald-500/15 bg-black/70 backdrop-blur-2xl shadow-[0_25px_120px_-30px_rgba(52,211,153,0.28)] overflow-hidden"
              initial={{ y: 26, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-4 bg-white/[0.02]">
                <div>
                  <p className="text-[10px] font-mono tracking-[0.45em] uppercase text-emerald-400">Local AI Boot Sequence</p>
                  <p className="text-[11px] font-mono text-white/45 mt-1">Offline model loading into private memory</p>
                </div>
                <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/30">1.5s / gated reveal</div>
              </div>

              <div className="p-5 sm:p-7 space-y-5 boot-grid">
                <div className="space-y-3">
                  {BOOT_LINES.map((line, index) => {
                    const lineProgress = clamp(bootProgress * BOOT_LINES.length - index, 0, 1);
                    const isFinal = index === BOOT_LINES.length - 1;

                    return (
                      <motion.div
                        key={line}
                        className="boot-line flex items-start gap-3 text-sm sm:text-[15px] font-mono text-white/78"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: lineProgress > 0 ? 1 : 0.24, y: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <span className="text-emerald-400/90 w-8 shrink-0">{String(index + 1).padStart(2, '0')}</span>
                        <span className={isFinal ? 'text-emerald-300' : 'text-white/75'}>{scrambleBootText(line, lineProgress)}</span>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="space-y-3 rounded-2xl border border-white/5 bg-[#050607]/80 p-4 sm:p-5">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.4em] text-white/35">
                    <span>Memory Allocation</span>
                    <span>{Math.round(bootProgress * 100)}%</span>
                  </div>
                  <div className="space-y-2">
                    {['Context cache', 'Vector lanes', 'Private sandbox'].map((label, index) => {
                      const barProgress = clamp(bootProgress * 1.2 - index * 0.18, 0, 1);

                      return (
                        <div key={label} className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.25em] text-white/28">
                            <span>{label}</span>
                            <span>{Math.round(barProgress * 100)}%</span>
                          </div>
                          <div className="boot-progress-track h-2 rounded-full overflow-hidden">
                            <motion.div
                              className="boot-progress-fill h-full rounded-full origin-left"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: barProgress }}
                              transition={{ duration: 0.12, ease: 'linear' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.3em] text-white/25">
                  <span>Neural handshake</span>
                  <span className="text-emerald-400">{bootComplete ? 'stable' : 'syncing'}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎯 FIXED: Direct style binding with percent translating transforms. 
          This forces the circle context to track the mouse coordinates perfectly during scaling animations. */}
      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 hidden md:block border"
        style={{
          x: springCursorX,
          y: springCursorY,
          translateX: '-50%',
          translateY: '-50%',
          transformOrigin: "center center"
        }}
        animate={{
          scale: cursorState === 'hovered' ? 1.5 : 1,
          borderColor: cursorState === 'hovered' ? '#34d399' : 'rgba(255,255,255,0.4)',
          backgroundColor: cursorState === 'hovered' ? 'rgba(52, 211, 153, 0.08)' : 'rgba(255,255,255,0)'
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
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

      {/* MAIN VIEW CONTROLLER */}
      <main className={`relative z-20 pointer-events-none transition-opacity duration-300 ${bootComplete ? 'opacity-100' : 'opacity-0'}`}>
        <AnimatePresence mode="wait">
          
          {currentPage === 'showroom' && (
            <motion.div key="showroom-view" className="pointer-events-auto">
              
              {/* HERO DECK CONTAINER */}
              <motion.section 
                style={{ opacity: heroOpacity }}
                className="relative h-screen w-full flex flex-col justify-center items-center px-6 md:px-12 border-b border-white/[0.02]"
              >
                <motion.div style={{ y: heroTextY }} className="text-center max-w-4xl space-y-6 z-10 relative">
                  <motion.span 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-[10px] font-mono tracking-[0.4em] text-[#7e7e87] uppercase block"
                  >
                    [ FRONTEND ARCHITECT / INTERACTION SPECIALIST ]
                  </motion.span>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[1.05] mb-4 text-center select-text"
                  >
                    <span className="block text-white">High-fidelity code.</span>
                    <span className="block mt-2 text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                      Fluid digital motion.
                    </span>
                  </motion.h1>

                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-[#7e7e87] text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed relative z-20"
                  >
                    Engineering ultra-smooth web systems, responsive interface engines, and zero-latency state controllers tailored specifically for premium corporate platforms.
                  </motion.p>

                  {/* Waveform Mesh Vector Asset */}
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

              <PhilosophySection />

              {/* SHOWROOM GRID INFRASTRUCTURE */}
              <section className="w-full py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-white/[0.04] pb-8 mb-16 gap-6">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#7e7e87] uppercase block mb-2">[ PRODUCT SHOWROOM ]</span>
                    <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight uppercase">Operational Infrastructure.</h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 bg-[#0a0a0c] p-1 border border-white/[0.04] rounded-xl font-mono text-[11px]">
                    {PROJECT_FILTERS.map(category => (
                      <button
                        key={category.value}
                        onClick={() => setActiveFilter(category.value)}
                        onMouseEnter={() => setCursorState('hovered')}
                        onMouseLeave={() => setCursorState('default')}
                        className={`px-4 py-2 rounded-lg font-medium tracking-wide transition-all uppercase cursor-pointer pointer-events-auto ${activeFilter === category.value ? 'bg-emerald-500 text-black font-extrabold shadow-[0_0_20px_rgba(52,211,153,0.3)]' : 'text-[#7e7e87] hover:text-white'}`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Staggered Cross-fade List Layout Container */}
                <motion.div layout className="grid grid-cols-1 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project, i) => (
                      <TiltProjectCard
                        key={project.id}
                        project={project}
                        index={i}
                        onOpen={navigateToProject}
                        onCursorStateChange={setCursorState}
                      />
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
                  <p className="text-sm sm:text-base text-emerald-400 font-mono mt-3 uppercase tracking-[0.25em]">{selectedProject.tagline}</p>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
                {[
                  {
                    label: 'Architecture focus',
                    value: selectedProject.category,
                    description: 'The core problem space this system is designed to solve.'
                  },
                  {
                    label: 'Experience mode',
                    value: selectedProject.tagline,
                    description: 'A concise framing of the interaction model and user promise.'
                  },
                  {
                    label: 'System posture',
                    value: selectedProject.id === 'local-context-engine' ? 'Offline by default' : 'Privacy-first by design',
                    description: 'The operating principle that constrains data flow and model behavior.'
                  },
                ].map((card) => (
                  <div key={card.label} className="rounded-2xl border border-white/[0.04] bg-[#0a0a0c] p-5">
                    <p className="text-[10px] font-mono text-[#7e7e87] uppercase tracking-[0.35em]">{card.label}</p>
                    <p className="text-lg font-black uppercase tracking-tight mt-2">{card.value}</p>
                    <p className="text-xs text-neutral-400 leading-relaxed mt-3">{card.description}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-mono text-[#7e7e87] uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <LayoutGrid size={12} /> 
                  <span>Interface Captures (Click Component to Expand)</span>
                </h4>

                {selectedProject.gallery.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedProject.gallery.map((imgUrl, i) => (
                      <div 
                        key={i}
                        onClick={() => setZoomImage(imgUrl)}
                        onMouseEnter={() => setCursorState('hovered')}
                        onMouseLeave={() => setCursorState('default')}
                        className="bg-[#0a0a0c] border border-white/[0.04] rounded-2xl overflow-hidden p-3 group hover:border-emerald-500/30 transition-all cursor-zoom-in relative"
                      >
                        <div className="w-full aspect-[16/10] overflow-hidden rounded-xl bg-neutral-900 relative">
                          <img 
                            src={imgUrl} 
                            alt="Interface Frame Capture Segment" 
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
                ) : (
                  <div className="rounded-[24px] border border-white/5 bg-[linear-gradient(180deg,rgba(10,10,12,0.9),rgba(2,6,3,0.88))] p-5 sm:p-6 overflow-hidden relative">
                    <div className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.14),transparent_45%)]" />
                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                      <div className="space-y-3">
                        <p className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#7e7e87]">Architecture summary</p>
                        <h5 className="text-2xl font-black uppercase tracking-tight">{selectedProject.title}</h5>
                        <p className="text-sm text-[#a1a1aa] leading-relaxed">
                          {selectedProject.desc}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {[
                            { label: 'Primary constraint', value: selectedProject.category === 'AI Architecture' ? 'Offline inference' : 'Zero-leak routing' },
                            { label: 'Target outcome', value: selectedProject.tagline },
                          ].map((item) => (
                            <div key={item.label} className="rounded-2xl border border-white/5 bg-black/45 p-4">
                              <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-emerald-400">{item.label}</p>
                              <p className="text-sm text-white/85 mt-2">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          'Context boundary',
                          'Routing lane',
                          'Private compute',
                          'Consent lock',
                        ].map((label, labelIndex) => (
                          <div key={label} className="rounded-2xl border border-white/5 bg-black/45 p-4 min-h-28 flex flex-col justify-between">
                            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-emerald-400">{label}</span>
                            <div className="mt-3 h-10 rounded-xl bg-[linear-gradient(90deg,rgba(52,211,153,0.08),rgba(45,212,191,0.22),rgba(52,211,153,0.08))]" />
                            <p className="text-[10px] font-mono text-[#7e7e87] mt-3 uppercase tracking-[0.2em]">{String(labelIndex + 1).padStart(2, '0')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* LEAD CONVERSION TRANSMISSION STREAM */}
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
                  <input required name="name" type="text" placeholder="Alex Rivera" value={formData.name} onChange={handleInputChange} onBlur={() => handleFieldBlur('name', formData.name)} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-emerald-500/40 focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Secure Mailbox</label>
                  <input required name="email" type="email" placeholder="alex@brand.com" value={formData.email} onChange={handleInputChange} onBlur={() => handleFieldBlur('email', formData.email)} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-emerald-500/40 focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Project Track</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} onBlur={() => handleFieldBlur('category', formData.category)} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-emerald-500/40 focus:outline-none transition-colors cursor-pointer">
                    <option>SaaS Platform</option>
                    <option>E-Commerce Hub</option>
                    <option>Immersive Showroom</option>
                    <option>Custom Matrix Solution</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Target Budget Allocation</label>
                  <select name="budget" value={formData.budget} onChange={handleInputChange} onBlur={() => handleFieldBlur('budget', formData.budget)} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-emerald-500/40 focus:outline-none transition-colors cursor-pointer">
                    <option>$1,000 - $2,000</option>
                    <option>$2,000 - $5,000</option>
                    <option>$5,000 - $10,000</option>
                    <option>$10,000+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-mono uppercase text-[#7e7e87]">Architectural Scope Details</label>
                <textarea required name="details" rows={4} placeholder="Describe your performance metrics targets..." value={formData.details} onChange={handleInputChange} onBlur={() => handleFieldBlur('details', formData.details)} className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-emerald-500/40 focus:outline-none transition-colors resize-none" />
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

            {/* MONITOR LIVE DATA CONSOLE PANEL */}
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
                  <div className="space-y-1.5 rounded-xl border border-white/[0.02] bg-[#0a0a0c] p-4 text-[11px] leading-normal">
                    <p className="text-neutral-500 font-bold">// Analysis History:</p>
                    {terminalHistory.map((entry, entryIndex) => (
                      <p key={`${entry}-${entryIndex}`} className={entryIndex === terminalHistory.length - 1 ? 'text-emerald-400' : 'text-neutral-500'}>
                        &gt; {entry}
                      </p>
                    ))}
                  </div>
                  <p className="text-emerald-500 font-semibold text-[11px] leading-normal min-h-[50px] transition-all break-words">&gt; {consoleMessage}</p>
                </div>
                <p className="text-[10px] text-neutral-600 pt-4 border-t border-white/[0.03]">Input elements automatically register inside the tracking buffer matrix row.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENHANCED Tactile LIGHTBOX OVERLAY */}
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
              <img src={zoomImage} alt="Expanded Component Capture View" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}