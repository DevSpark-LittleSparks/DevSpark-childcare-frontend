/**
 * Chatbot Service
 * Handles API calls for chatbot FAQ and message processing
 * Currently uses mock data - will be replaced with real API calls
 */

import axiosInstance from './axiosInstance';
import type { FaqItem, BotMessage, BotResponse } from '@/types/chatbot.types';

// Mock FAQ data - will be replaced with API calls
const MOCK_FAQ_DATA: FaqItem[] = [
  {
    id: '1',
    question: 'What are the operating hours?',
    answer:
      'Our facility operates Monday to Friday, 7:00 AM to 6:00 PM. We are closed on weekends and public holidays.',
  },
  {
    id: '2',
    question: 'How can I contact my child\'s teacher?',
    answer:
      'You can contact your child\'s teacher through the messaging feature in the parent app or by calling our main office during business hours.',
  },
  {
    id: '3',
    question: 'Do you offer sibling discounts?',
    answer:
      'Yes! We offer a 10% discount for the second child and 15% for the third child and onwards. Contact our office for more details.',
  },
  {
    id: '4',
    question: 'What is your payment policy?',
    answer:
      'Payments are due on the first day of each month. We accept credit cards, bank transfers, and cash. Late fees apply after the 5th of the month.',
  },
  {
    id: '5',
    question: 'What should I do if my child is sick?',
    answer:
      'Please inform us by 8:00 AM if your child won\'t be attending. Children with fever, cough, or other illness symptoms should not attend for the safety of others.',
  },
];

const INITIAL_MESSAGE: BotMessage = {
  id: Date.now(),
  sender: 'bot',
  text: 'Hello! 👋 Welcome to Sprouty Support. How can I help you today? Feel free to ask questions about our services, hours, payments, or anything else!',
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const BOT_FALLBACK_TEXT =
  'I didn\'t quite understand that. Could you rephrase your question? Here are some popular topics you might be interested in:';

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

      return MOCK_FAQ_DATA;
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
    return INITIAL_MESSAGE;
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
      const matchedFaq = MOCK_FAQ_DATA.find(
        (faq) =>
          faq.question.toLowerCase() === query ||
          faq.question.toLowerCase().includes(query)
      );

      if (matchedFaq) {
        responseText = matchedFaq.answer;
      } else {
        // 2. Secondary keyword-based search
        if (query.includes('hour') || query.includes('time')) {
          responseText = MOCK_FAQ_DATA[0].answer;
        } else if (
          query.includes('contact') ||
          query.includes('teacher') ||
          query.includes('message')
        ) {
          responseText = MOCK_FAQ_DATA[1].answer;
        } else if (query.includes('discount') || query.includes('sibling')) {
          responseText = MOCK_FAQ_DATA[2].answer;
        } else if (query.includes('pay') || query.includes('tuition')) {
          responseText = MOCK_FAQ_DATA[3].answer;
        } else if (query.includes('absent') || query.includes('sick')) {
          responseText = MOCK_FAQ_DATA[4].answer;
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
