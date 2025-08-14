// Type definitions for the AI chatbot data layer

// Background API Data Types (matching actual background.json structure)
export interface PersonalInfo {
  name: string;
  nickname: string;
  title: string;
  bio: string;
  location: string;
  personality: string;
  communication_style: string;
  interests: string[];
  languages: string[];
  education: {
    undergraduate: string;
    graduate: string;
    international: string;
    bootcamp: string;
  };
}

export interface Skills {
  frontend: {
    frameworks: string[];
    languages: string[];
    styling: string[];
    libraries: string[];
    advanced_patterns: string[];
  };
  backend: {
    runtime: string[];
    apis: string[];
    databases: string[];
    tools: string[];
    specialties: string[];
  };
  tools: {
    development: string[];
    design: string[];
    deployment: string[];
    testing: string[];
  };
  architecture: {
    principles: string[];
    patterns: string[];
    experience: string[];
  };
}

export interface Experience {
  company: string;
  duration?: string;
  role: string;
  type: string;
  description: string;
  key_projects?: string[];
  technologies: string[];
  achievements?: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies?: string[];
  url?: string;
  github?: string;
  type?: string;
  status?: string;
}

export interface BackgroundData {
  personal: PersonalInfo;
  skills: Skills;
  experience: Experience[];
  projects: Project[];
}

// Background API Class Interface
export interface IBackgroundAPI {
  background: BackgroundData | null;
  isInitialized: boolean;
  loadBackground(): Promise<void>;
  getContextForAI(userQuestion: string): string;
}

// AI Service types
export interface AIServiceConfig {
  apiKey: boolean;
  model: string;
}

export interface AIGenerationOptions {
  prompt: string;
  system: string;
  temperature: number;
  maxTokens: number;
}

export interface AIGenerationResult {
  text: string;
}

// Message types (for consistency with chat components)
export interface ChatMessage {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// OpenRouter AI Provider Types
export type OpenRouterProvider = (model: string) => {
  provider: string;
  model: string;
};

// Environment variables
export interface ImportMetaEnv {
  VITE_OPENROUTER_API_KEY?: string;
}

export interface ImportMeta {
  env: ImportMetaEnv;
}

// Error types for AI service
export interface AIServiceError extends Error {
  code?: string;
  status?: number;
}

export default {};
