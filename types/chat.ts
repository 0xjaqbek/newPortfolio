export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  message: string;
  history: Message[];
}

export interface ChatResponse {
  message: string;
  error?: string;
}
