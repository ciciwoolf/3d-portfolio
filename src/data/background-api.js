import Fuse from 'fuse.js';
import backgroundData from './background.json' with { type: 'json' };

/**
 * Background API - Smart retrieval system for Background and Experience Data
 *
 * This provides intelligent search and context retrieval for the AI chatbot
 * Instead of a database, we use JSON + fuzzy search for simplicity and speed
 */

class BackgroundAPI {
  constructor() {
    this.background = backgroundData;
    this.setupSearch();
  }

  setupSearch() {
    // Create searchable content from all sections
    const searchableContent = [
      // FAQ entries
      ...this.background.faq.map((item) => ({
        type: 'faq',
        content: `${item.question} ${item.answer}`,
        data: item,
        keywords: item.keywords,
      })),

      // Skills
      {
        type: 'skills',
        content: `skills technologies frontend backend ${JSON.stringify(
          this.background.skills
        )}`,
        data: this.background.skills,
        keywords: ['skills', 'technologies', 'tech', 'programming'],
      },

      // Education - Add dedicated education section
      {
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
      },

      // Projects
      ...this.background.projects.map((project) => ({
        type: 'project',
        content: `${project.name} ${
          project.description
        } ${project.technologies.join(' ')}`,
        data: project,
        keywords: ['projects', 'work', 'portfolio', ...project.technologies],
      })),

      // Personal info
      {
        type: 'personal',
        content: `${
          this.background.personal.bio
        } ${this.background.personal.interests.join(' ')}`,
        data: this.background.personal,
        keywords: ['about', 'bio', 'background', 'personal'],
      },
    ];

    // Configure fuzzy search
    const fuseOptions = {
      keys: ['content', 'keywords'],
      threshold: 0.4, // Lower = more strict matching
      includeScore: true,
    };

    this.fuse = new Fuse(searchableContent, fuseOptions);
  }

  /**
   * Find relevant context for a user question
   * @param {string} query - User's question/message
   * @param {number} maxResults - Maximum number of results to return
   * @returns {Array} Relevant context pieces
   */
  findRelevantContext(query, maxResults = 3) {
    const results = this.fuse.search(query, { limit: maxResults });

    return results.map((result) => ({
      type: result.item.type,
      data: result.item.data,
      relevanceScore: 1 - result.score, // Convert to 0-1 where 1 is perfect match
      content: result.item.content,
    }));
  }

  /**
   * Get context for AI prompt generation
   * @param {string} userQuestion - User's question
   * @returns {string} Formatted context string for AI
   */
  getContextForAI(userQuestion) {
    const question = userQuestion.toLowerCase();

    console.log('getContextForAI called with:', userQuestion);
    console.log('Lowercase question:', question);

    // Always include basic personal info
    let context = `
About Christine Woolf:
- Full name: Christine Woolf (last name: Woolf)
- Education: Triple major in Philosophy, German, and Spanish with minor in Classical Studies at Concordia College; Master's in Religious History at Luther Seminary; Senior year at Friedrich Schiller Universität in Jena, Germany; Web Development bootcamp at Digitalhouse in Buenos Aires
- Current role: Full Stack Developer
- Location: Based in the United States
`;

    // Add specific context based on question keywords
    if (
      question.includes('education') ||
      question.includes('study') ||
      question.includes('college') ||
      question.includes('university') ||
      question.includes('school') ||
      question.includes('degree') ||
      question.includes('studied') ||
      question.includes('learn') ||
      question.includes('go to')
    ) {
      console.log(
        'Education keywords detected, adding detailed education info'
      );
      context += `
Educational Details:
- Studied Philosophy, German, and Spanish at Concordia College
- Won music scholarship for saxophone performance
- Completed senior year in Germany (all coursework in German except Spanish literature)
- Studied Lutheran theology and Hegel's philosophy
- Conducted independent research on Maya sociopolitical history in Guatemala
- Master's in Religious History with expertise in classical Latin, Biblical Greek, and classical Arabic
- Career transition: Studied web development at Digitalhouse in Buenos Aires (2019)
`;
    }

    if (question.includes('name') || question.includes('woolf')) {
      context += `
Name Information:
- Full name: Christine Woolf
- Last name: Woolf
- Professional name: Christine Woolf
`;
    }

    // Get relevant dynamic content from existing search system
    const relevantInfo = this.findRelevantContext(userQuestion);
    console.log('Relevant info found:', relevantInfo.length, 'items');

    if (relevantInfo.length > 0) {
      context += '\nAdditional relevant information:\n';

      relevantInfo.forEach((info) => {
        console.log('Processing info type:', info.type);
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
            }\nTech: ${info.data.technologies.join(', ')}\n`;
            break;
          case 'personal':
            context += `\nABOUT: ${
              info.data.bio
            }\nInterests: ${info.data.interests.join(', ')}\n`;
            break;
        }
      });
    }

    console.log('Final context length:', context.length);
    return context;
  }

  formatSkills(skills) {
    return `Frontend: ${skills.frontend.frameworks.join(
      ', '
    )} | Backend: ${skills.backend.runtime.join(
      ', '
    )}, ${skills.backend.apis.join(
      ', '
    )} | Tools: ${skills.tools.development.join(', ')}`;
  }

  formatEducation(education) {
    return `Undergraduate: ${education.undergraduate} | Graduate: ${education.graduate} | International: ${education.international} | Bootcamp: ${education.bootcamp}`;
  }

  getDefaultContext() {
    return `Christine Woolf is a Full Stack Developer passionate about building modern web applications with React, Vue.js, Node.js, and GraphQL. She specializes in UI/UX design and creating accessible, responsive web experiences.`;
  }

  /**
   * Get all available information categories
   */
  getAvailableTopics() {
    return {
      skills: 'Technical skills and technologies',
      projects: 'Portfolio projects and work examples',
      experience: 'Professional background and approach',
      personal: 'Background and interests',
      contact: 'How to get in touch',
    };
  }
}

// Export singleton instance
export const knowledgeAPI = new BackgroundAPI();
export default knowledgeAPI;
