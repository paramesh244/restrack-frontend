import apiService from './apiService';
import { Endpoint } from './endpoints';
import { MOCK_USERS } from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  date_joined: string;
  last_active: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  status?: string;
  role?: string;
  search?: string;
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const userService = {
  async list(params: UserListParams = {}): Promise<UserListResponse> {
    if (USE_MOCK) {
      let data = [...MOCK_USERS];
      if (params.search) {
        const q = params.search.toLowerCase();
        data = data.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
      }
      if (params.role) data = data.filter((u) => u.role === params.role);
      if (params.status) data = data.filter((u) => u.status === params.status);
      return { data, total: data.length, page: 1, limit: 50, totalPages: 1 };
    }
    return apiService.get<UserListResponse>({
      endpoint: Endpoint.USERS.LIST,
      params: { page: 1, limit: 50, ...params },
    });
  },

  async invite(name: string, email: string, role: string): Promise<User> {
    if (USE_MOCK) {
      return { id: `usr-${Date.now()}`, name, email, role, status: 'active', date_joined: new Date().toISOString(), last_active: '' };
    }
    const res = await apiService.post<{ data: User }>({
      endpoint: Endpoint.USERS.INVITE,
      data: { name, email, role },
    });
    return res.data;
  },

  async updateStatus(id: string, status: string): Promise<void> {
    if (USE_MOCK) return;
    await apiService.put({
      endpoint: Endpoint.USERS.UPDATE,
      data: { id, status },
    });
  },

  async resetPassword(id: string): Promise<void> {
    if (USE_MOCK) return;
    await apiService.post({
      endpoint: Endpoint.USERS.RESET_PASSWORD,
      data: { id },
    });
  },

  async deleteUser(id: string): Promise<void> {
    if (USE_MOCK) return;
    await apiService.delete({
      endpoint: Endpoint.USERS.DELETE,
      data: { id },
    });
  },
};
