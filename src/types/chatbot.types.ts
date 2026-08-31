// ─────────────────────────────────────────────────────────────────────────────
// chatbot.types.ts
// All shared TypeScript types for the Universal Smart Assistant (Sprouty)
// Used by: chatbotSlice, UniversalSmartAssistant component
// ─────────────────────────────────────────────────────────────────────────────

// ── Single chat message ───────────────────────────────────────────────────────
export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string; // ISO string
  isLoading?: boolean; // true while awaiting bot reply
}

// ── User context sent with each message for role-aware responses ──────────────
export interface ChatUserContext {
  role: 'PARENT' | 'TEACHER' | 'ADMIN';
  name: string;
  currentPage: string; // e.g. "/teacher/dashboard", "/parent/progress"
}

// ── API request payload ────────────────────────────────────────────────────────
export interface ChatRequest {
  message: string;
  context: ChatUserContext;
  history: { role: MessageRole; content: string }[];
}

// ── API response payload ───────────────────────────────────────────────────────
export interface ChatResponse {
  success: boolean;
  reply: string;
}

// ── Redux state shape ─────────────────────────────────────────────────────────
export interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  error: string | null;
}
