import apiService from './apiService';
import { Endpoint } from './endpoints';

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
    const res = await apiService.post<{ data: ChatMessageResponse }>({
      endpoint: Endpoint.CHAT.MESSAGE,
      data: { message, chat_history },
    });
    return res.data;
  },

  async getSuggestions(): Promise<ChatSuggestion[]> {
    const res = await apiService.get<{ data: ChatSuggestion[] }>({
      endpoint: Endpoint.CHAT.SUGGESTIONS,
      params: {},
    });
    return res.data;
  },

  async sendFeedback(message_id: string, rating: 'up' | 'down'): Promise<void> {
    await apiService.post({
      endpoint: Endpoint.CHAT.FEEDBACK,
      data: { message_id, rating },
    });
  },
};
