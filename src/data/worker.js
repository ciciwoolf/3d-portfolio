import { openRouter } from '../lib/ai.js';
import { generateText } from 'ai';
import backgroundAPI from './background-api.js';

class AIService {
  constructor() {
    this.apiKey = !!import.meta.env.VITE_OPENROUTER_API_KEY;
    this.model = 'openai/gpt-oss-20b:free';
  }

  async generateResponse(userQuestion) {
    if (!this.apiKey) {
      console.log('OpenRouter API key not set, using fallback');
      return this.getFallbackResponse(userQuestion);
    }
    try {
      const context = backgroundAPI.getContextForAI(userQuestion);
      const result = await generateText({
        model: openRouter(this.model),
        prompt: userQuestion,
        system: `You are Christine's AI assistant. Always speak about Christine in third person (she/her). Never use first person language like "I", "me", or "call me". When someone mentions "Cici" or "Christine" or asks about names, always provide biographical information about Christine Woolf rather than treating it as a greeting. Keep responses under 150 words and always end with complete sentences. Use the following information: ${context}`,
        temperature: 0.7,
        maxTokens: 400,
      });

      let response = result.text.trim();
      response = this.cleanResponse(response);
      if (
        !response ||
        response.length < 5 ||
        response.toLowerCase().includes('please answer') ||
        response.toLowerCase().includes('below') ||
        (response.toLowerCase().includes('question') && response.length < 20)
      ) {
        return this.getFallbackResponse(userQuestion);
      }

      return response;
    } catch (error) {
      console.error('AI generation error:', error);
      return this.getFallbackResponse(userQuestion);
    }
  }

  cleanResponse(response) {
    let cleaned = response
      .split('\n')[0]
      .replace(/^(Answer:|Response:|A:|Q:)/i, '')
      .replace(/Please answer.*$/i, '')
      .replace(/below[!.]*/i, '')
      .trim()
      .replace(/[.]{2,}/g, '.')
      .replace(/^\W+/, '')
      // Remove Markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold** formatting
      .replace(/\*(.*?)\*/g, '$1') // Remove *italic* formatting
      .replace(/`(.*?)`/g, '$1') // Remove `code` formatting
      .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Remove [link](url) formatting

    // Find the last complete sentence within 400 characters (matching maxTokens)
    if (cleaned.length <= 400) {
      return cleaned;
    }

    // Truncate to 400 chars first, then find last complete sentence
    let truncated = cleaned.substring(0, 400);

    // Find the last sentence ending (., !, or ?) but avoid breaking on .js tech terms
    // This regex looks for sentence endings that are NOT followed by 'js'
    const sentenceEndingMatch = truncated.match(/.*[.!?](?!js\b)/);

    if (sentenceEndingMatch) {
      // Return up to and including the last full sentence with ending
      return sentenceEndingMatch[0].trim();
    } else {
      // No complete sentence found, return the truncated text
      // but try to avoid cutting off mid-word
      const lastSpaceIndex = truncated.lastIndexOf(' ');
      if (lastSpaceIndex > 200) {
        // Only if we have a reasonable amount of text
        return truncated.substring(0, lastSpaceIndex).trim() + '...';
      }
      return truncated.trim();
    }
  }

  /**
   * Fallback responses using the same context system
   */
  getFallbackResponse(userQuestion) {
    console.log('Using fallback response for:', userQuestion);

    const question = userQuestion.toLowerCase();

    // Education questions - very specific matching
    if (
      question.includes('education') ||
      question.includes('study') ||
      question.includes('school') ||
      question.includes('college') ||
      question.includes('university') ||
      question.includes('degree') ||
      question.includes('learn') ||
      question.includes('graduate')
    ) {
      return "Christine has a diverse educational background! She completed a triple major in Philosophy, German, and Spanish at Concordia College, spent her senior year studying in Germany at Friedrich Schiller Universität, earned a Master's in Religious History at Luther Seminary, and later transitioned to web development through a bootcamp at Digitalhouse in Buenos Aires.";
    }

    // Experience/work questions
    if (
      question.includes('experience') ||
      question.includes('job') ||
      question.includes('career') ||
      question.includes('work') ||
      question.includes('company') ||
      question.includes('role')
    ) {
      return 'Christine has 3+ years of professional development experience! She spent 2.5 years at TSI Incorporated developing a Vue.js/TypeScript Excel Add-in for data visualization, building JavaScript and GoLang APIs for cloud data querying and user subscriptions. She also worked on interactive applications with React and Three.js at the Science Museum of Minnesota, and contributed to e-commerce analytics and tag management systems at Best Buy.';
    }

    // Skills/tech questions
    if (
      question.includes('skill') ||
      question.includes('tech') ||
      question.includes('programming') ||
      question.includes('language') ||
      question.includes('framework') ||
      question.includes('tool')
    ) {
      return "Christine specializes in React, Vue.js, Node.js, TypeScript, JavaScript, and GoLang. She has extensive experience with IoT data platforms, 3D web graphics using Three.js, GraphQL APIs, and building accessible, responsive applications. She's passionate about creating intuitive user interfaces!";
    }

    // Project questions
    if (
      question.includes('project') ||
      question.includes('portfolio') ||
      question.includes('build') ||
      question.includes('made') ||
      question.includes('created')
    ) {
      return 'Christine has built impressive projects including this 3D interactive portfolio using React and Three.js, IoT data platforms for environmental monitoring, interactive museum applications, and e-commerce analytics systems. Check out her work at christinewoolf.com!';
    }

    // Contact questions
    if (
      question.includes('contact') ||
      question.includes('reach') ||
      question.includes('connect') ||
      question.includes('email') ||
      question.includes('linkedin')
    ) {
      return 'You can connect with Christine on LinkedIn at https://www.linkedin.com/in/christinewoolf/ or visit her portfolio at christinewoolf.com to see her work and get in touch!';
    }

    // Name questions
    if (
      question.includes('name') ||
      question.includes('woolf') ||
      question.includes('christine') ||
      question.includes('cici')
    ) {
      return "Her full name is Christine Woolf - she also goes by Cici. She's a Full Stack Developer passionate about creating amazing web experiences with modern technologies!";
    }

    // Location/origin questions
    if (
      question.includes('where') ||
      question.includes('from') ||
      question.includes('location') ||
      question.includes('live') ||
      question.includes('based') ||
      question.includes('located')
    ) {
      return 'Christine is based in the United States! She has an international background though - she studied in Germany during college and completed a web development bootcamp in Buenos Aires, Argentina. This global experience gives her a unique perspective on creating inclusive, accessible web applications.';
    }

    // General questions about Christine - catch broader inquiries
    if (
      question.includes('tell me about') ||
      question.includes('what else') ||
      question.includes('more about') ||
      question.includes('about christine') ||
      question.includes('about her') ||
      question.includes('who is') ||
      question.includes('describe') ||
      question.includes('background')
    ) {
      return "Christine is a Full Stack Developer with a fascinating journey! She has a triple major in Philosophy, German, and Spanish, studied in Germany, earned a Master's in Religious History, then pivoted to web development. She's worked at TSI on IoT platforms, the Science Museum on interactive apps, and Best Buy on analytics. She specializes in React, Vue.js, Node.js, and Three.js - creating beautiful, accessible web experiences!";
    }

    // Default response
    return "I'm Christine's AI assistant! I can tell you about her skills in React, Vue.js, and Node.js, her diverse educational background, professional experience at companies like TSI and the Science Museum, or how to get in touch. What would you like to know?";
  }
}

// Export singleton
export const aiService = new AIService();
export default aiService;
