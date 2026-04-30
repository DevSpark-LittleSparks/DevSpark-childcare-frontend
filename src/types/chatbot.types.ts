/**
 * Chatbot Module Types
 * Defines types for UniversalSproutyAssistant
 */

export interface BotMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  showFaqButtons?: boolean;
}

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
}

export interface BotResponse {
  id: number;
  text: string;
  showFaqButtons: boolean;
  time: string;
}

export interface ChatbotState {
  isOpen: boolean;
  messages: BotMessage[];
  faqData: FaqItem[];
  inputValue: string;
  loading: boolean;
  error: string | null;
}

export interface InitialMessageData {
  id: number;
  sender: 'bot';
  text: string;
  time: string;
}
