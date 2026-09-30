export type SectionId = 'hero' | 'about' | 'skills' | 'projects' | 'experience' | 'contact';

export interface Milestone {
  id: SectionId;
  title: string;
  subtitle: string;
  stationName: string;
  side: 'left' | 'right' | 'center';
  progress: number; // 0.0 to 1.0 on path
  iconName: string;
  themeColor: string;
}

export interface SkillCategory {
  title: string;
  skills: {
    name: string;
    level: number; // 0 - 100
    icon?: string;
    description?: string;
  }[];
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  metrics: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  accentColor: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string[];
  tech: string[];
}
