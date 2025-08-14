import type { BackgroundData, IBackgroundAPI } from './types';

/**
 * Background API - Simple keyword-based retrieval system
 */

class BackgroundAPI implements IBackgroundAPI {
  public background: BackgroundData | null;
  public isInitialized: boolean;

  constructor() {
    this.background = null;
    this.isInitialized = false;
    this.loadBackground();
  }

  /**
   * Load the background data
   */
  async loadBackground(): Promise<void> {
    try {
      // Try dynamic import first (preferred method)
      const module = await import('./background.json');
      this.background = module.default || module;
      this.isInitialized = true;
    } catch {
      // Fallback to fetch from public folder
      try {
        const response = await fetch('/background.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        this.background = await response.json();
        this.isInitialized = true;
      } catch {
        // Use hardcoded fallback data
        this.setupFallback();
      }
    }
  }

  setupFallback(): void {
    this.background = {
      personal: {
        name: 'Christine Woolf',
        nickname: 'Cici',
        title: 'Full Stack Developer',
        bio: 'Full Stack Developer passionate about modern web applications',
        location: 'Based in the United States',
        personality: 'friendly, professional, enthusiastic',
        communication_style: 'clear, helpful, detail-oriented',
        interests: ['Web Development', 'React', 'Vue.js'],
        languages: ['English'],
        education: {
          undergraduate:
            'Triple major in Philosophy, German, and Spanish at Concordia College',
          graduate: "Master's in Religious History at Luther Seminary",
          international:
            'Senior year at Friedrich Schiller Universität in Germany',
          bootcamp: 'Web Development bootcamp at Digitalhouse in Buenos Aires',
        },
      },
      skills: {
        frontend: {
          frameworks: ['React', 'Vue.js'],
          languages: ['JavaScript', 'TypeScript'],
          styling: ['CSS', 'Tailwind CSS'],
          libraries: ['Three.js'],
          advanced_patterns: ['Custom hooks', 'Context providers'],
        },
        backend: {
          runtime: ['Node.js'],
          apis: ['REST APIs', 'GraphQL'],
          databases: ['MongoDB'],
          tools: ['Express.js'],
          specialties: ['API development'],
        },
        tools: {
          development: ['Git', 'VS Code'],
          design: ['Figma'],
          deployment: ['Vercel'],
          testing: ['Jest'],
        },
        architecture: {
          principles: ['Scalability', 'Maintainability'],
          patterns: ['Component reusability'],
          experience: ['Multi-environment deployment'],
        },
      },
      projects: [],
      experience: [],
    };
    this.isInitialized = true;
  }

  /**
   * Main method for getting context - Simple keyword matching
   */
  getContextForAI(userQuestion: string): string {
    if (!this.isInitialized) {
      return this.getDefaultContext();
    }

    const question = userQuestion.toLowerCase();
    let context = this.getBasicPersonalInfo();

    // Direct keyword matching
    if (
      question.includes('skill') ||
      question.includes('tech') ||
      question.includes('programming')
    ) {
      context += this.getSkillsInfo();
    }

    if (
      question.includes('project') ||
      question.includes('work') ||
      question.includes('portfolio')
    ) {
      context += this.getProjectsInfo();
    }

    if (
      question.includes('education') ||
      question.includes('study') ||
      question.includes('school') ||
      question.includes('college')
    ) {
      context += this.getEducationInfo();
    }

    if (
      question.includes('experience') ||
      question.includes('job') ||
      question.includes('career')
    ) {
      context += this.getExperienceInfo();
    }

    if (
      question.includes('name') ||
      question.includes('woolf') ||
      question.includes('cici') ||
      question.includes('christine')
    ) {
      context += this.getNameInfo();
    }

    return context;
  }

  getBasicPersonalInfo(): string {
    return `
About Christine Woolf (Cici):
- Full name: Christine Woolf
- Nickname: Cici (she goes by both names)
- Current role: Full Stack Developer  
- Location: Based in the United States
`;
  }

  getSkillsInfo(): string {
    if (!this.background?.skills) {
      return '\nSKILLS: React, Vue.js, Node.js, JavaScript, TypeScript\n';
    }

    const { skills } = this.background;
    let skillsText = '\nSKILLS:\n';

    if (skills.frontend?.frameworks) {
      skillsText += `- Frontend: ${skills.frontend.frameworks.join(', ')}\n`;
    }
    if (skills.backend?.runtime) {
      skillsText += `- Backend: ${skills.backend.runtime.join(', ')}\n`;
    }
    if (skills.backend?.apis) {
      skillsText += `- APIs: ${skills.backend.apis.join(', ')}\n`;
    }
    if (skills.tools?.development) {
      skillsText += `- Tools: ${skills.tools.development.join(', ')}\n`;
    }

    return skillsText;
  }

  getProjectsInfo(): string {
    if (!this.background?.projects?.length) {
      return '\nPROJECTS: 3D Interactive Portfolio built with React, Three.js, and modern web technologies\n';
    }

    let projectsText = '\nPROJECTS:\n';
    this.background.projects.forEach((project) => {
      projectsText += `- ${project.name}: ${project.description}\n`;
      if (project.technologies) {
        projectsText += `  Technologies: ${project.technologies.join(', ')}\n`;
      }
    });

    return projectsText;
  }

  getEducationInfo(): string {
    return `
EDUCATION:
- Triple major in Philosophy, German, and Spanish at Concordia College
- Master's in Religious History at Luther Seminary  
- Senior year at Friedrich Schiller Universität in Jena, Germany (coursework in German)
- Web Development bootcamp at Digitalhouse in Buenos Aires
- Conducted independent research on Maya sociopolitical history in Guatemala
`;
  }

  getExperienceInfo(): string {
    if (!this.background?.experience?.length) {
      return `
EXPERIENCE:
- TSI Incorporated: 2.5 years developing Vue.js/TypeScript Excel Add-in for data visualization, with JavaScript and GoLang APIs for cloud data querying and user subscriptions
- Science Museum of Minnesota: Interactive applications with React and Three.js  
- Best Buy: E-commerce analytics and tag management systems
- Specializes in Vue.js, React, Node.js, GoLang, and full-stack development
`;
    }

    let expText = '\nEXPERIENCE:\n';
    this.background.experience.forEach((exp) => {
      expText += `- ${exp.company}: ${exp.description || exp.role}\n`;
    });

    return expText;
  }

  getNameInfo(): string {
    return `
NAME DETAILS:
- Full name: Christine Woolf
- Nickname: Cici (she goes by both Christine and Cici)
- Last name: Woolf
- Professional name: Christine Woolf
- About the nickname: Cici is a friendly, personal nickname that friends and colleagues often use
`;
  }

  getDefaultContext(): string {
    return 'Christine Woolf is a Full Stack Developer passionate about building modern web applications with React, Vue.js, Node.js, and GraphQL. She specializes in UI/UX design and creating accessible, responsive web experiences.';
  }
}

// Export singleton
export const backgroundAPI = new BackgroundAPI();
export default backgroundAPI;
