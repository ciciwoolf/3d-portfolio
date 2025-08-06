import { pipeline } from '@xenova/transformers';
import backgroundAPI from './background-api.js';

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

    const prompt = `You are Christine Woolf's helpful AI assistant. Answer questions about Christine professionally and enthusiastically.

${context}

User Question: ${userQuestion}

Answer as Christine's assistant (keep it concise and helpful):`;

    return prompt;
  }

  /**
   * Generate response with AI model or fallback
   */
  async generateResponse(userQuestion) {
    try {
      const generator = await this.initializeModel();

      if (!generator) {
        console.log('AI model unavailable, using fallback');
        return this.getFallbackResponse(userQuestion);
      }

      const prompt = this.createPersonalizedPrompt(userQuestion);
      console.log('Using prompt preview:', prompt.substring(0, 150) + '...');

      const result = await generator(prompt, {
        max_length: 150,
        temperature: 0.7,
        do_sample: true,
        top_p: 0.9,
        pad_token_id: 50256,
      });

      let response = result[0].generated_text.replace(prompt, '').trim();
      response = this.cleanResponse(response);

      if (!response || response.length < 10) {
        console.log('AI response too short, using fallback');
        return this.getFallbackResponse(userQuestion);
      }

      console.log('AI response generated successfully');
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

    // Use the same keyword detection as backgroundAPI
    if (question.includes('skill') || question.includes('tech') || question.includes('programming')) {
      return "Christine specializes in React, Vue.js, Node.js, TypeScript, and modern web development. She has extensive experience with IoT data platforms, 3D web graphics using Three.js, and building accessible, responsive applications!";
    }

    if (question.includes('education') || question.includes('study') || question.includes('school') || question.includes('college')) {
      return "Christine has a fascinating educational journey! She studied Philosophy, German, and Spanish at Concordia College, completed her senior year in Germany, earned a Master's in Religious History, and transitioned to web development through a bootcamp in Buenos Aires.";
    }

    if (question.includes('project') || question.includes('work') || question.includes('portfolio')) {
      return "Christine has built impressive projects including her 3D interactive portfolio using React and Three.js, IoT data platforms for environmental monitoring, and interactive museum applications. Check out her work at christinewoolf.com!";
    }

    if (question.includes('experience') || question.includes('job') || question.includes('career')) {
      return "Christine has 3+ years of full-stack development experience! She spent 2.5 years at TSI building IoT data platforms, worked on interactive applications at the Science Museum of Minnesota, and contributed to e-commerce analytics at Best Buy.";
    }

    if (question.includes('name') || question.includes('woolf')) {
      return "Her full name is Christine Woolf - last name Woolf. She's a Full Stack Developer passionate about creating amazing web experiences!";
    }

    if (question.includes('contact') || question.includes('reach') || question.includes('connect')) {
      return "You can connect with Christine on LinkedIn at https://www.linkedin.com/in/christinewoolf/ or visit her portfolio at christinewoolf.com to see her work and get in touch!";
    }

    // Default response
    return "I'm Christine's AI assistant! I can tell you about her skills in React, Vue.js, and Node.js, her educational background, professional projects, or how to get in touch. What would you like to know?";
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