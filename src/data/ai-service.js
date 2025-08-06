import { pipeline } from '@xenova/transformers';
import backgroundAPI from './background-api.js';

/**
 * AI Service - Handles AI model interaction and response generation
 *
 * This service:
 * - Loads the AI model (Transformers.js)
 * - Combines user questions with Christine's context
 * - Generates personalized responses
 * - Handles fallback responses
 */

class AIService {
  constructor() {
    this.generator = null;
    this.isModelLoaded = false;
    this.modelName = 'Xenova/Phi-3-mini-4k-instruct';
  }

  /**
   * Initialize the AI model (lazy loading)
   */
  async initializeModel() {
    if (this.generator) return this.generator;

    try {
      this.generator = await pipeline('text-generation', this.modelName);
      this.isModelLoaded = true;
      return this.generator;
    } catch (error) {
      console.error('Failed to load AI model:', error);
      this.isModelLoaded = false;
      return null;
    }
  }

  /**
   * Create a personalized prompt using Christine's background
   * @param {string} userQuestion - The user's question
   * @returns {string} - Formatted prompt for the AI
   */
  createPersonalizedPrompt(userQuestion) {
    // Get relevant context from background base
    const context = backgroundAPI.getContextForAI(userQuestion);

    const prompt = `You are Christine Woolf's helpful AI assistant. Answer questions about Christine professionally and enthusiastically.

${context}

User Question: ${userQuestion}

Answer as Christine's assistant (keep it concise and helpful):`;

    return prompt;
  }

  /**
   * Generate AI response using the model and context
   * @param {string} userQuestion - User's question
   * @returns {Promise<string>} - AI generated response
   */
  async generateResponse(userQuestion) {
    try {
      // Initialize model if not loaded
      const generator = await this.initializeModel();

      if (!generator) {
        return this.getFallbackResponse(userQuestion);
      }

      // Create personalized prompt
      const prompt = this.createPersonalizedPrompt(userQuestion);
      console.log('Using prompt:', prompt.substring(0, 100) + '...');

      // Generate response
      const result = await generator(prompt, {
        max_length: 150,
        temperature: 0.7,
        do_sample: true,
        top_p: 0.9,
        pad_token_id: 50256,
      });

      // Extract and clean the response
      let response = result[0].generated_text.replace(prompt, '').trim();

      // Clean up the response
      response = this.cleanResponse(response);

      if (!response || response.length < 10) {
        return this.getFallbackResponse(userQuestion);
      }

      return response;
    } catch (error) {
      console.error('AI generation error:', error);
      return this.getFallbackResponse(userQuestion);
    }
  }

  /**
   * Clean and format the AI response
   * @param {string} response - Raw AI response
   * @returns {string} - Cleaned response
   */
  cleanResponse(response) {
    return response
      .split('\n')[0] // Take first line only
      .replace(/^(Answer:|Response:)/i, '') // Remove prefixes
      .trim()
      .replace(/[.]{2,}/g, '.') // Fix multiple periods
      .substring(0, 200); // Limit length
  }

  /**
   * Provide fallback responses when AI fails
   * @param {string} userQuestion - User's question
   * @returns {string} - Fallback response
   */
  getFallbackResponse(userQuestion) {
    const question = userQuestion.toLowerCase();

    // Education-related questions
    if (
      question.includes('school') ||
      question.includes('education') ||
      question.includes('study') ||
      question.includes('college') ||
      question.includes('university')
    ) {
      return "Christine has a diverse educational background! She studied Philosophy, German, and Spanish at Concordia College, completed her senior year in Germany, earned a Master's in Religious History at Luther Seminary, and transitioned to web development through a bootcamp at Digitalhouse in Buenos Aires.";
    }

    // Experience-related questions
    if (
      question.includes('experience') ||
      question.includes('job') ||
      question.includes('work') ||
      question.includes('company')
    ) {
      return 'Christine has great experience as a Full Stack Developer! She spent 2.5 years at TSI building IoT data platforms, worked at the Science Museum of Minnesota on interactive applications, and contributed to e-commerce analytics at Best Buy. She specializes in Vue.js, React, Node.js, and GoLang.';
    }

    // Simple keyword-based responses
    if (question.includes('skill') || question.includes('tech')) {
      return "Christine specializes in React, Vue.js, Node.js, and modern web development. She's passionate about creating accessible, responsive web applications!";
    }

    if (question.includes('project')) {
      return 'Christine has built impressive projects including her 3D interactive portfolio using React, Three.js, and modern web technologies. Check out her work at christinewoolf.com!';
    }

    if (question.includes('contact') || question.includes('reach')) {
      return 'You can connect with Christine on LinkedIn at https://www.linkedin.com/in/christinewoolf/ or visit her portfolio at christinewoolf.com!';
    }

    // Default response
    return "I'm Christine's AI assistant, just beginning to learn. Ask me about her skills, school, or professional experience!";
  }

  /**
   * Check if the AI model is ready
   * @returns {boolean}
   */
  isReady() {
    return this.isModelLoaded && this.generator !== null;
  }
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;
