/**
 * Chatbot Service
 * Handles API calls for chatbot FAQ and message processing
 * Currently uses mock data - will be replaced with real API calls
 */

import axiosInstance from './axiosInstance';
import type { FaqItem, BotMessage, BotResponse } from '@/types/chatbot.types';
import {
  FAQ_DATA,
  INITIAL_MESSAGE,
  BOT_FALLBACK_TEXT,
} from '@/shared/mock/progressMockData';

// Mock data will be fetched from progressMockData

class ChatbotService {
  /**
   * Get all FAQ items
   * TODO: Replace with API call to GET /api/chatbot/faq
   */
  async getFaqData(): Promise<FaqItem[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      // In production:
      // const response = await axiosInstance.get('/api/chatbot/faq');
      // return response.data;

      return FAQ_DATA.map((faq, index) => ({
        id: String(index + 1),
        ...faq,
      })) as FaqItem[];
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
      throw error;
    }
  }

  /**
   * Get initial bot message
   * TODO: Replace with API call if needed
   */
  getInitialMessage(): BotMessage {
    return {
      ...INITIAL_MESSAGE,
      sender: INITIAL_MESSAGE.sender as 'bot' | 'user',
    } as BotMessage;
  }

  /**
   * Process user message and get bot response
   * TODO: Replace with API call to POST /api/chatbot/message
   */
  async sendMessage(userMessage: string): Promise<BotResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In production:
      // const response = await axiosInstance.post('/api/chatbot/message', {
      //   message: userMessage
      // });
      // return response.data;

      const query = userMessage.toLowerCase();
      let responseText = BOT_FALLBACK_TEXT;
      let showFaqButtons = false;

      // 1. Primary exact or partial match search
      const matchedFaq = FAQ_DATA.find(
        (faq) =>
          faq.question.toLowerCase() === query ||
          faq.question.toLowerCase().includes(query)
      );

      if (matchedFaq) {
        responseText = matchedFaq.answer;
      } else {
        // 2. Secondary keyword-based search
        if (query.includes('hour') || query.includes('time')) {
          responseText = FAQ_DATA[0].answer;
        } else if (
          query.includes('contact') ||
          query.includes('teacher') ||
          query.includes('message')
        ) {
          responseText = FAQ_DATA[1].answer;
        } else if (query.includes('discount') || query.includes('sibling')) {
          responseText = FAQ_DATA[2].answer;
        } else if (query.includes('pay') || query.includes('tuition')) {
          responseText = FAQ_DATA[3].answer;
        } else if (query.includes('absent') || query.includes('sick')) {
          responseText = FAQ_DATA[4].answer;
        } else {
          // 3. Fallback with suggestions
          responseText = BOT_FALLBACK_TEXT;
          showFaqButtons = true;
        }
      }

      return {
        id: Date.now(),
        text: responseText,
        showFaqButtons,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    } catch (error) {
      console.error('Error processing chatbot message:', error);
      throw error;
    }
  }

  /**
   * Get fallback message text
   */
  getFallbackText(): string {
    return BOT_FALLBACK_TEXT;
  }
}

export default new ChatbotService();
