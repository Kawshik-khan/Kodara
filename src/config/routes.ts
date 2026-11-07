export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",

  // Learning Tracks
  learn: "/learn",
  typescript: "/learn/typescript",
  python: "/learn/python",
  react: "/learn/react",
  systemDesign: "/learn/system-design",
  aiEngineering: "/learn/ai-engineering",

  // Practice & Labs
  playground: "/playground",
  challenges: "/challenges",

  // Build & Projects
  projects: "/projects",

  // Explore & Graphs
  concepts: "/concepts",
  skillMap: "/skill-map",
  architectureLab: "/architecture-lab",

  // User & System
  aiTutor: "/ai-tutor",
  progress: "/progress",
  settings: "/settings",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",

  // Learning Tracks
  LEARN: "/learn",
  LESSON: "/learn/:trackId/:lessonSlug",
  TRACK_TYPESCRIPT: "/learn/typescript",
  TRACK_PYTHON: "/learn/python",
  TRACK_REACT: "/learn/react",
  TRACK_SYSTEM_DESIGN: "/learn/system-design",
  TRACK_AI_ENGINEERING: "/learn/ai-engineering",

  // Practice & Labs
  PLAYGROUND: "/playground",
  CHALLENGES: "/challenges",

  // Build & Projects
  PROJECTS: "/projects",

  // Explore & Graphs
  CONCEPTS: "/concepts",
  SKILL_MAP: "/skill-map",
  ARCHITECTURE_LAB: "/architecture-lab",

  // User & System
  AI_TUTOR: "/ai-tutor",
  PROGRESS: "/progress",
  SETTINGS: "/settings",
} as const;
