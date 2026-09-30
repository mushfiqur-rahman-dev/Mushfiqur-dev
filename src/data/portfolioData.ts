import type { Milestone, SkillCategory, ProjectItem, ExperienceItem } from '../types';
import avatarImg from '../assets/me.jpeg';

export const MILESTONES: Milestone[] = [
  {
    id: 'hero',
    title: 'The Sanctuary',
    subtitle: 'Where Creativity Meets Architecture',
    stationName: 'Valley Gateway',
    side: 'center',
    progress: 0.0,
    iconName: 'Compass',
    themeColor: '#38bdf8',
  },
  {
    id: 'about',
    title: 'About Me',
    subtitle: 'Philosophy, Background & Vision',
    stationName: 'Station 01 • Left Wood Signpost',
    side: 'left',
    progress: 0.22,
    iconName: 'User',
    themeColor: '#34d399',
  },
  {
    id: 'skills',
    title: 'Skills & Tech Stack',
    subtitle: 'Modern Frameworks, Systems & Design',
    stationName: 'Station 02 • Right Birch Signpost',
    side: 'right',
    progress: 0.48,
    iconName: 'Cpu',
    themeColor: '#818cf8',
  },
  {
    id: 'projects',
    title: 'Featured Projects',
    subtitle: 'Engineered for Performance & Scale',
    stationName: 'Station 03 • Left Cedar Signpost',
    side: 'left',
    progress: 0.74,
    iconName: 'Layers',
    themeColor: '#f59e0b',
  },
  {
    id: 'experience',
    title: 'Experience & Timeline',
    subtitle: 'Milestones, Leadership & Impact',
    stationName: 'Station 04 • Right Oak Signpost',
    side: 'right',
    progress: 0.90,
    iconName: 'Briefcase',
    themeColor: '#ec4899',
  },
  {
    id: 'contact',
    title: 'Get In Touch',
    subtitle: 'Let’s Build Something Unforgettable',
    stationName: 'Station 05 • Pavilion Summit',
    side: 'center',
    progress: 1.0,
    iconName: 'Send',
    themeColor: '#10b981',
  },
];

export const PERSONAL_INFO = {
  name: 'Mushfiq',
  avatar: avatarImg,
  title: 'Full-Stack Software Architect & Creative Developer',
  headline: 'Crafting cinematic web applications, scalable backends, and tactile user interfaces.',
  location: 'Available Worldwide • Remote & Relocation',
  status: 'Open to High-Impact Opportunities',
  email: 'mushfiq.dev@gmail.com',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  instagram: 'https://instagram.com',
  bio: `I am a full-stack engineer and creative technologist who operates at the intersection of high-performance backend architecture and viral interactive web aesthetics.
With a passion for high-precision design systems, real-time distributed systems, and buttery-smooth user experiences, I build digital products that leave a lasting impression.`,
  stats: [
    { label: 'Years Experience', value: '4+' },
    { label: 'Production Apps Built', value: '20+' },
    { label: 'Client Satisfaction', value: '99%' },
    { label: 'Global Contributors', value: '1.2k+' },
  ],
  interests: ['3D Web Graphics', 'Distributed Systems', 'UI/UX Craftsmanship', 'Audio Synthesis', 'Open Source'],
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Frontend & Interactive Web',
    skills: [
      { name: 'React / Next.js', level: 95, description: 'SSR, App Router, Server Actions, Hydration Optimization' },
      { name: 'TypeScript', level: 92, description: 'Strict typing, Generics, AST tooling' },
      { name: 'Three.js / WebGL / Shaders', level: 88, description: 'Instanced meshes, custom GLSL, 3D scrollytelling' },
      { name: 'Tailwind CSS & Design Tokens', level: 96, description: 'Glassmorphism, custom micro-interactions' },
      { name: 'Framer Motion & GSAP', level: 90, description: 'Physics springs, layout morphing, timeline sequencing' },
    ],
  },
  {
    title: 'Backend & Cloud Infrastructure',
    skills: [
      { name: 'Node.js / Express / Bun', level: 92, description: 'High-throughput microservices, WebSockets, Streams' },
      { name: 'Python / FastAPI', level: 85, description: 'Async APIs, Data processing, AI pipelines' },
      { name: 'PostgreSQL / Prisma / Redis', level: 90, description: 'Query tuning, caching tiers, ACID compliance' },
      { name: 'Docker & Kubernetes', level: 82, description: 'Containerization, ingress controllers, CI/CD pipelines' },
      { name: 'AWS / Cloudflare Edge', level: 86, description: 'Serverless workers, S3, CDN caching, edge compute' },
    ],
  },
  {
    title: 'Architecture & Creative Suite',
    skills: [
      { name: 'REST & GraphQL APIs', level: 94, description: 'Schema design, federation, rate-limiting' },
      { name: 'Web Audio API', level: 85, description: 'Procedural synthesis, spatial sound, WebRTC audio' },
      { name: 'Figma to Code', level: 95, description: 'Pixel-perfect translation, auto-layout, design tokens' },
      { name: 'Performance & SEO', level: 92, description: 'Core Web Vitals, 60fps frame budgeting, bundle splitting' },
    ],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'chronos-engine',
    title: 'Chronos 3D Workspace',
    tagline: 'Spatial Productivity & Collaborative Infinite Canvas',
    description: 'An Apple-inspired spatial operating environment built in the browser. Features real-time multi-user cursor sync, WebGL physics engine, and glassmorphic windowing system.',
    tags: ['React', 'Three.js', 'WebSockets', 'Tailwind', 'Redis'],
    metrics: '60fps across 100k nodes • 12k monthly users',
    liveUrl: 'https://example.com/chronos',
    githubUrl: 'https://github.com/example/chronos',
    featured: true,
    accentColor: '#38bdf8',
  },
  {
    id: 'lumina-ai',
    title: 'Lumina Neural Studio',
    tagline: 'Next-Gen Creative AI Pipeline Orchestrator',
    description: 'Enterprise AI generation platform allowing creators to visually connect LLMs, diffusion models, and voice synthesizers in an interactive node-based graph editor.',
    tags: ['Next.js 14', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Tailwind'],
    metrics: '99.98% uptime • 2.5M API requests handled',
    liveUrl: 'https://example.com/lumina',
    githubUrl: 'https://github.com/example/lumina',
    featured: true,
    accentColor: '#818cf8',
  },
  {
    id: 'nexus-vault',
    title: 'Nexus Decentralized Vault',
    tagline: 'Cryptographic Asset Manager with Biometric Auth',
    description: 'Zero-knowledge biometric security dashboard with real-time portfolio analytics, automated yield rebalancing, and instant cross-chain telemetry.',
    tags: ['TypeScript', 'Ethers.js', 'Zustand', 'Framer Motion', 'GraphQL'],
    metrics: '$14M Total Volume Tracked • Audited Smart Contracts',
    liveUrl: 'https://example.com/nexus',
    githubUrl: 'https://github.com/example/nexus',
    featured: true,
    accentColor: '#34d399',
  },
  {
    id: 'aether-audio',
    title: 'Aether Procedural Synth',
    tagline: 'Web Audio Ambient Sound Generator & Visualizer',
    description: 'High-precision browser synthesizer utilizing polyphonic oscillators, granular delays, and custom audio shaders for generative meditative soundscapes.',
    tags: ['Web Audio API', 'Canvas API', 'React', 'Tailwind CSS'],
    metrics: 'Zero external audio lag • 45k soundscapes generated',
    liveUrl: 'https://example.com/aether',
    githubUrl: 'https://github.com/example/aether',
    featured: false,
    accentColor: '#f59e0b',
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    period: '2023 — Present',
    role: 'Lead Full-Stack Architect',
    company: 'Vanguard Interactive Labs',
    location: 'Remote',
    description: [
      'Architected and delivered next-gen interactive client applications serving 500k+ global active users.',
      'Reduced initial page load latency by 48% through aggressive bundle splitting, edge asset caching, and WebGL instancing.',
      'Mentored a team of 8 engineers in reactive state architecture and modern animation systems.',
    ],
    tech: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Three.js', 'AWS'],
  },
  {
    period: '2021 — 2023',
    role: 'Senior Frontend Engineer',
    company: 'Aura Cloud Technologies',
    location: 'Hybrid',
    description: [
      'Spearheaded the redesign of the core analytics suite with real-time data streaming and glassmorphic dashboards.',
      'Engineered an internal component library adopted across 14 distinct product teams.',
      'Implemented automated E2E testing pipelines boosting release confidence from 70% to 99%.',
    ],
    tech: ['TypeScript', 'React', 'Tailwind CSS', 'GraphQL', 'Docker', 'Jest'],
  },
  {
    period: '2020 — 2021',
    role: 'Creative Developer & UI Engineer',
    company: 'Horizon Digital Studios',
    location: 'On-site',
    description: [
      'Developed award-winning commercial web experiences featuring custom scroll-linked animations and shader graphics.',
      'Collaborated closely with 3D artists and brand designers to produce high-retention digital launches.',
    ],
    tech: ['JavaScript', 'Three.js', 'GSAP', 'CSS3 Shaders', 'Webpack'],
  },
];
