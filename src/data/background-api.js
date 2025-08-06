import Fuse from 'fuse.js';

/**
 * Background API - Smart retrieval system for Background and Experience
 */

class BackgroundAPI {
  constructor() {
    this.background = null;
    this.fuse = null;
    this.isInitialized = false;
    this.loadBackground();
  }

  /**
   * Step 1: Load the data
   */
  async loadBackground() {
    console.log('loading background data...');

    try {
      await this.tryLoadMethods();

      if (!this.background) {
        throw new Error('Failed to load background data with any method');
      }

      console.log('Background data loaded successfully');
      console.log('Data structure:', Object.keys(this.background));

      this.setupSearch();
      this.isInitialized = true;
    } catch (error) {
      console.error('failed to load background data', error);
      this.setupFallback();
    }
  }

  async tryLoadMethods() {
    // First try dynamic import
    try {
      console.log('Trying dynamic import');
      const module = await import('./background.json');
      this.background = module.default || module;
      return;
    } catch (error) {
      console.log('Method 1 failed:', error.message);
    }

    try {
      const response = await fetch('/background.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this.background = await response.json();
      return;
    } catch (error) {
      console.log('Method 2 failed:', error.message);
    }

    try {
      console.log('Trying method 3: Static import with assertion...');
      const { default: data } = await import('./background.json', {
        assert: { type: 'json' },
      });
      this.background = data;
      console.log('  Method 3 successful');
      return;
    } catch (error) {
      console.log('  Method 3 failed:', error.message);
    }
  }

  /**
   * Step 2: Set up the search system
   */
  setupSearch() {
    console.log('Step 2: Setting up search system...');

    if (!this.background) {
      console.error('Cannot setup search: no background data');
      return;
    }

    // Validate data structure
    const requiredFields = ['faq', 'skills', 'projects', 'personal'];
    const missingFields = requiredFields.filter(
      (field) => !this.background[field]
    );

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      console.log('Available fields:', Object.keys(this.background));
      return;
    }

    // Create searchable content
    const searchableContent = this.createSearchableContent();
    console.log('Created searchable items:', searchableContent.length);

    // Configure fuzzy search
    const fuseOptions = {
      keys: ['content', 'keywords'],
      threshold: 0.4,
      includeScore: true,
    };

    this.fuse = new Fuse(searchableContent, fuseOptions);
    console.log('Search system initialized');
  }

  createSearchableContent() {
    const content = [];
    // FAQ entries
    if (this.background.faq && Array.isArray(this.background.faq)) {
      console.log(`  Adding ${this.background.faq.length} FAQ items`);
      content.push(
        ...this.background.faq.map((item) => ({
          type: 'faq',
          content: `${item.question} ${item.answer}`,
          data: item,
          keywords: item.keywords || [],
        }))
      );
    }

    // Skills
    if (this.background.skills) {
      console.log('Adding skills section');
      content.push({
        type: 'skills',
        content: `skills technologies frontend backend ${JSON.stringify(
          this.background.skills
        )}`,
        data: this.background.skills,
        keywords: ['skills', 'technologies', 'tech', 'programming'],
      });
    }

    // Education
    if (this.background.personal?.education) {
      console.log('Adding education section');
      content.push({
        type: 'education',
        content: `education school college university study ${JSON.stringify(
          this.background.personal.education
        )} philosophy german spanish classical studies concordia college luther seminary friedrich schiller universität jena germany digitalhouse buenos aires web development bootcamp`,
        data: this.background.personal.education,
        keywords: [
          'education',
          'school',
          'college',
          'university',
          'study',
          'degree',
          'graduate',
          'undergraduate',
        ],
      });
    }

    // Projects
    if (this.background.projects && Array.isArray(this.background.projects)) {
      console.log(`  Adding ${this.background.projects.length} project items`);
      content.push(
        ...this.background.projects.map((project) => ({
          type: 'project',
          content: `${project.name} ${project.description} ${
            project.technologies?.join(' ') || ''
          }`,
          data: project,
          keywords: [
            'projects',
            'work',
            'portfolio',
            ...(project.technologies || []),
          ],
        }))
      );
    }

    // Personal info
    if (this.background.personal) {
      console.log('  Adding personal info section');
      content.push({
        type: 'personal',
        content: `${this.background.personal.bio} ${
          this.background.personal.interests?.join(' ') || ''
        }`,
        data: this.background.personal,
        keywords: ['about', 'bio', 'background', 'personal'],
      });
    }

    return content;
  }

  setupFallback() {
    console.log('Setting up fallback data...');
    this.background = {
      personal: {
        name: 'Christine Woolf',
        bio: 'Full Stack Developer passionate about modern web applications',
      },
      faq: [],
      skills: { frontend: { frameworks: [] }, backend: { runtime: [] } },
      projects: [],
    };
    this.setupSearch();
  }

  /**
   * Wait for initialization before using
   */
  async waitForInitialization() {
    let attempts = 0;
    while (!this.isInitialized && attempts < 50) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    if (!this.isInitialized) {
      console.warn('Background API not ready after 5 seconds');
    }
    return this.isInitialized;
  }

  /**
   * Find relevant context (with debug info)
   */
  findRelevantContext(query, maxResults = 3) {
    if (!this.fuse) {
      console.error('Search not available - fuse not initialized');
      return [];
    }

    console.log(`🔍 Searching for: "${query}"`);
    const results = this.fuse.search(query, { limit: maxResults });
    console.log(`📊 Found ${results.length} results`);

    return results.map((result) => {
      const relevanceScore = 1 - result.score;
      console.log(
        `  ${result.item.type}: ${relevanceScore.toFixed(2)} relevance`
      );

      return {
        type: result.item.type,
        data: result.item.data,
        relevanceScore,
        content: result.item.content,
      };
    });
  }

  /**
   * Get context for AI (with extensive debugging)
   */
  getContextForAI(userQuestion) {
    console.log('🤖 getContextForAI called with:', userQuestion);

    if (!this.isInitialized) {
      console.warn('⚠️ API not initialized, using fallback');
      return this.getDefaultContext();
    }

    const question = userQuestion.toLowerCase();
    console.log('🔤 Lowercase question:', question);

    // Always include basic personal info
    let context = this.getBasicPersonalInfo();

    // Add keyword-based context
    context += this.getKeywordBasedContext(question);

    // Get relevant dynamic content
    const relevantInfo = this.findRelevantContext(userQuestion);
    if (relevantInfo.length > 0) {
      context += this.formatRelevantInfo(relevantInfo);
    }

    console.log('📝 Final context length:', context.length);
    console.log('📄 Context preview:', context.substring(0, 200) + '...');

    return context;
  }

  getBasicPersonalInfo() {
    return `
About Christine Woolf:
- Full name: Christine Woolf (last name: Woolf)
- Current role: Full Stack Developer
- Location: Based in the United States
`;
  }

  getKeywordBasedContext(question) {
    let additionalContext = '';

    // Education keywords
    const educationKeywords = [
      'education',
      'study',
      'college',
      'university',
      'school',
      'degree',
      'studied',
      'learn',
      'go to',
    ];
    if (educationKeywords.some((keyword) => question.includes(keyword))) {
      console.log('🎓 Education keywords detected');
      additionalContext += `
Educational Details:
- Triple major in Philosophy, German, and Spanish at Concordia College
- Master's in Religious History at Luther Seminary
- Senior year at Friedrich Schiller Universität in Jena, Germany
- Web Development bootcamp at Digitalhouse in Buenos Aires
`;
    }

    // Name keywords
    if (question.includes('name') || question.includes('woolf')) {
      console.log('🏷️ Name keywords detected');
      additionalContext += `
Name Information:
- Full name: Christine Woolf
- Last name: Woolf
- Professional name: Christine Woolf
`;
    }

    return additionalContext;
  }

  formatRelevantInfo(relevantInfo) {
    let context = '\nAdditional relevant information:\n';

    relevantInfo.forEach((info) => {
      console.log(`📎 Processing info type: ${info.type}`);
      switch (info.type) {
        case 'faq':
          context += `\nQ: ${info.data.question}\nA: ${info.data.answer}\n`;
          break;
        case 'skills':
          context += `\nSKILLS: ${this.formatSkills(info.data)}\n`;
          break;
        case 'education':
          context += `\nEDUCATION: ${this.formatEducation(info.data)}\n`;
          break;
        case 'project':
          context += `\nPROJECT: ${info.data.name}\n${
            info.data.description
          }\nTech: ${info.data.technologies?.join(', ') || 'N/A'}\n`;
          break;
        case 'personal':
          context += `\nABOUT: ${info.data.bio}\nInterests: ${
            info.data.interests?.join(', ') || 'N/A'
          }\n`;
          break;
      }
    });

    return context;
  }

  formatSkills(skills) {
    const frontend = skills.frontend?.frameworks?.join(', ') || 'N/A';
    const backend = skills.backend?.runtime?.join(', ') || 'N/A';
    const apis = skills.backend?.apis?.join(', ') || 'N/A';
    const tools = skills.tools?.development?.join(', ') || 'N/A';

    return `Frontend: ${frontend} | Backend: ${backend}, ${apis} | Tools: ${tools}`;
  }

  formatEducation(education) {
    return `Undergraduate: ${education.undergraduate || 'N/A'} | Graduate: ${
      education.graduate || 'N/A'
    } | International: ${education.international || 'N/A'} | Bootcamp: ${
      education.bootcamp || 'N/A'
    }`;
  }

  getDefaultContext() {
    return `Christine Woolf is a Full Stack Developer passionate about building modern web applications with React, Vue.js, Node.js, and GraphQL. She specializes in UI/UX design and creating accessible, responsive web experiences.`;
  }

  /**
   * Debug method to inspect current state
   */
  debugState() {
    console.log('🔍 Background API Debug State:');
    console.log('  Initialized:', this.isInitialized);
    console.log('  Has background data:', !!this.background);
    console.log('  Has search (fuse):', !!this.fuse);

    if (this.background) {
      console.log('  Background keys:', Object.keys(this.background));
      console.log('  FAQ items:', this.background.faq?.length || 0);
      console.log('  Projects:', this.background.projects?.length || 0);
    }
  }
}

// Export singleton instance
export const backgroundAPI = new BackgroundAPI();
export default backgroundAPI;
