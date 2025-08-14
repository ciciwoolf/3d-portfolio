// Global type declarations for the project

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.glb' {
  const src: string;
  export default src;
}

declare module '*.gltf' {
  const src: string;
  export default src;
}

// OpenRouter API types
interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

// Background API types
interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  key_projects: string[];
  technologies: string[];
}

interface PersonalInfo {
  full_name: string;
  nickname: string;
  location: string;
  education: string;
  years_experience: number;
}

interface BackgroundData {
  personal_info: PersonalInfo;
  current_focus: string[];
  experience: ExperienceItem[];
  skills: {
    frontend: string[];
    backend: string[];
    databases: string[];
    tools: string[];
    specialties: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    highlights: string[];
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

export {};
