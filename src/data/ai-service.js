import { pipeline } from '@xenova/transformers';
import backgroundAPI from './background-api.js';
window.backgroundAPI = backgroundAPI;
/**
 * AI Service - Simplified with better fallback integration
 */

class AIService {
  constructor() {
    this.generator = null;
    this.isModelLoaded = false;
    this.modelName = 'Xenova/gpt2';
  }

  /**
   * Initialize the AI model
   */
  async initializeModel() {
    if (this.generator) return this.generator;

    try {
      console.log('🤖 Loading AI model:', this.modelName);
      this.generator = await pipeline('text-generation', this.modelName);
      this.isModelLoaded = true;
      console.log('AI model loaded successfully');
      return this.generator;
    } catch (error) {
      console.error('Failed to load AI model:', error);
      this.isModelLoaded = false;
      return null;
    }
  }

  /**
   * Create personalized prompt with context
   */
  createPersonalizedPrompt(userQuestion) {
    const context = backgroundAPI.getContextForAI(userQuestion);

    const prompt = `I am Christine Woolf's AI assistant. I help people learn about Christine's background and experience.

${context}

Question: ${userQuestion}

Response:`;

    return prompt;
  }

  /**
   * Generate response with AI model or fallback
   */
  async generateResponse(userQuestion) {
    console.log('🤖 Generating response for:', userQuestion);

    // Set to false to use background API + AI model instead of hardcoded fallbacks
    const useFallbackFirst = false; // Changed to false to enable AI!

    if (useFallbackFirst) {
      const fallbackResponse = this.getFallbackResponse(userQuestion);
      if (
        fallbackResponse &&
        !fallbackResponse.includes("I'm Christine's AI assistant!")
      ) {
        console.log('✅Using targeted fallback response');
        return fallbackResponse;
      }
    }

    try {
      const generator = await this.initializeModel();

      if (!generator) {
        console.log('AI model unavailable, using fallback');
        return this.getFallbackResponse(userQuestion);
      }

      const prompt = this.createPersonalizedPrompt(userQuestion);
      console.log('Using prompt preview:', prompt.substring(0, 150) + '...');

      const result = await generator(prompt, {
        max_length: 200, // Longer responses for demo
        temperature: 0.6, // Slightly more creative
        do_sample: true,
        top_p: 0.85,
        pad_token_id: 50256,
        repetition_penalty: 1.1, // Reduce repetition
      });

      let response = result[0].generated_text.replace(prompt, '').trim();
      response = this.cleanResponse(response);

      if (!response || response.length < 5) {
        console.log('AI response too short, using fallback');
        return this.getFallbackResponse(userQuestion);
      }

      console.log('🤖 AI response generated successfully:', response);
      return response;
    } catch (error) {
      console.error('AI generation error:', error);
      return this.getFallbackResponse(userQuestion);
    }
  }

  /**
   * Clean the AI response
   */
  cleanResponse(response) {
    return response
      .split('\n')[0]
      .replace(/^(Answer:|Response:)/i, '')
      .trim()
      .replace(/[.]{2,}/g, '.')
      .substring(0, 200);
  }

  /**
   * Fallback responses using the same context system
   */
  getFallbackResponse(userQuestion) {
    console.log('🔄 Using fallback response for:', userQuestion);

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
      return 'Christine has 3+ years of professional development experience! She spent 2.5 years at TSI Incorporated building IoT data platforms for environmental monitoring, worked on interactive applications with React and Three.js at the Science Museum of Minnesota, and contributed to e-commerce analytics and tag management systems at Best Buy.';
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

    // Default response
    return "I'm Christine's AI assistant! I can tell you about her skills in React, Vue.js, and Node.js, her diverse educational background, professional experience at companies like TSI and the Science Museum, or how to get in touch. What would you like to know?";
  }

  /**
   * Check if AI is ready
   */
  isReady() {
    return this.isModelLoaded && this.generator !== null;
  }
}

// Export singleton
export const aiService = new AIService();
export default aiService;
