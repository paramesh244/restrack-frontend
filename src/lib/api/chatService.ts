import apiService from './apiService';
import { Endpoint } from './endpoints';
import { MOCK_SUGGESTIONS, getMockChatResponse } from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export interface ChatSource {
  id: string;
  title: string;
  excerpt: string;
}

export interface ChatMessageResponse {
  message_id: string;
  response: string;
  sources: ChatSource[];
}

export interface ChatSuggestion {
  id: string;
  question: string;
}

export const chatService = {
  async sendMessage(message: string, chat_history: object): Promise<ChatMessageResponse> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 900));
      return getMockChatResponse(message);
    }
    const res = await apiService.post<{ data: ChatMessageResponse }>({
      endpoint: Endpoint.CHAT.MESSAGE,
      data: { message, chat_history },
    });
    return res.data;
  },

  async getSuggestions(): Promise<ChatSuggestion[]> {
    if (USE_MOCK) return MOCK_SUGGESTIONS;
    const res = await apiService.get<{ data: ChatSuggestion[] }>({
      endpoint: Endpoint.CHAT.SUGGESTIONS,
      params: {},
    });
    return res.data;
  },

  async sendFeedback(message_id: string, rating: 'up' | 'down'): Promise<void> {
    if (USE_MOCK) return;
    await apiService.post({
      endpoint: Endpoint.CHAT.FEEDBACK,
      data: { message_id, rating },
    });
  },
};
