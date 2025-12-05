export interface Profile {
  name: string;
  title: string;
  bio: string;
  location?: string;

  contact: {
    email: string;
    twitter?: string;
    telegram?: string;
  };

  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    other: string[];
  };

  experience: WorkExperience[];

  projects: Project[];
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location?: string;
  period: {
    start: string; // YYYY-MM
    end: string | 'Present';
  };
  description: string;
  achievements?: string[];
  technologies?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repoUrl?: string; // GitHub repo URL (for public repos)
  readmePath?: string; // Path to README file (for private repos or custom content)
  technologies: string[];
  highlights?: string[];
  demo?: string;
  featured?: boolean;
}
