/**
 * Background API - Simple keyword-based retrieval system
 * No more Fuse.js complexity - just direct keyword matching
 */

class BackgroundAPI {
  constructor() {
    this.background = null;
    this.isInitialized = false;
    this.loadBackground();
  }

  /**
   * Load the background data
   */
  async loadBackground() {
    console.log('Loading background data...');

    try {
      await this.tryLoadMethods();

      if (!this.background) {
        throw new Error('Failed to load background data');
      }

      console.log('Background data loaded successfully');
      console.log('Data structure:', Object.keys(this.background));
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to load background data:', error);
      this.setupFallback();
    }
  }

  async tryLoadMethods() {
    // Method 1: Dynamic import
    try {
      console.log('  Trying dynamic import...');
      const module = await import('./background.json');
      this.background = module.default || module;
      console.log('  Dynamic import successful');
      return;
    } catch (error) {
      console.log('  Method 1 failed:', error.message);
    }

    // Method 2: Fetch from public folder
    try {
      console.log('  Trying fetch from /background.json...');
      const response = await fetch('/background.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this.background = await response.json();
      console.log('  ✅Fetch successful');
      return;
    } catch (error) {
      console.log('  Method 2 failed:', error.message);
    }
  }

  setupFallback() {
    console.log('Setting up fallback data...');
    this.background = {
      personal: {
        name: 'Christine Woolf',
        bio: 'Full Stack Developer passionate about modern web applications',
      },
      skills: {
        frontend: { frameworks: ['React', 'Vue.js'] },
        backend: { runtime: ['Node.js'] },
      },
      projects: [],
      experience: [],
    };
    this.isInitialized = true;
  }

  /**
   * Main method for getting context - Simple keyword matching
   */
  getContextForAI(userQuestion) {
    console.log('🤖 getContextForAI called with:', userQuestion);

    if (!this.isInitialized) {
      console.warn('API not ready, using fallback');
      return this.getDefaultContext();
    }

    const question = userQuestion.toLowerCase();
    let context = this.getBasicPersonalInfo();

    // Direct keyword matching - simple and reliable
    if (
      question.includes('skill') ||
      question.includes('tech') ||
      question.includes('programming')
    ) {
      console.log('Skills question detected');
      context += this.getSkillsInfo();
    }

    if (
      question.includes('project') ||
      question.includes('work') ||
      question.includes('portfolio')
    ) {
      console.log('Projects question detected');
      context += this.getProjectsInfo();
    }

    if (
      question.includes('education') ||
      question.includes('study') ||
      question.includes('school') ||
      question.includes('college')
    ) {
      console.log('Education question detected');
      context += this.getEducationInfo();
    }

    if (
      question.includes('experience') ||
      question.includes('job') ||
      question.includes('career')
    ) {
      console.log('Experience question detected');
      context += this.getExperienceInfo();
    }

    if (
      question.includes('name') ||
      question.includes('woolf') ||
      question.includes('cici') ||
      question.includes('christine')
    ) {
      console.log('Name question detected');
      context += this.getNameInfo();
    }

    console.log('Final context length:', context.length);
    return context;
  }

  getBasicPersonalInfo() {
    return `
About Christine Woolf (Cici):
- Full name: Christine Woolf
- Nickname: Cici (she goes by both names)
- Current role: Full Stack Developer  
- Location: Based in the United States
`;
  }

  getSkillsInfo() {
    if (!this.background?.skills) {
      return '\nSKILLS: React, Vue.js, Node.js, JavaScript, TypeScript\n';
    }

    const skills = this.background.skills;
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

  getProjectsInfo() {
    if (!this.background?.projects || this.background.projects.length === 0) {
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

  getEducationInfo() {
    return `
EDUCATION:
- Triple major in Philosophy, German, and Spanish at Concordia College
- Master's in Religious History at Luther Seminary  
- Senior year at Friedrich Schiller Universität in Jena, Germany (coursework in German)
- Web Development bootcamp at Digitalhouse in Buenos Aires
- Conducted independent research on Maya sociopolitical history in Guatemala
`;
  }

  getExperienceInfo() {
    if (
      !this.background?.experience ||
      this.background.experience.length === 0
    ) {
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
      if (exp.company) {
        expText += `- ${exp.company}: ${exp.description || exp.role}\n`;
      }
    });

    return expText;
  }

  getNameInfo() {
    return `
NAME DETAILS:
- Full name: Christine Woolf
- Nickname: Cici (she goes by both Christine and Cici)
- Last name: Woolf
- Professional name: Christine Woolf
- About the nickname: Cici is a friendly, personal nickname that friends and colleagues often use
`;
  }

  getDefaultContext() {
    return 'Christine Woolf is a Full Stack Developer passionate about building modern web applications with React, Vue.js, Node.js, and GraphQL. She specializes in UI/UX design and creating accessible, responsive web experiences.';
  }

  /**
   * Debug helper
   */
  debugState() {
    console.log('🔍 Background API Debug:');
    console.log('  Initialized:', this.isInitialized);
    console.log('  Has data:', !!this.background);
    if (this.background) {
      console.log('  Keys:', Object.keys(this.background));
    }
  }
}

// Export singleton
export const backgroundAPI = new BackgroundAPI();
export default backgroundAPI;
