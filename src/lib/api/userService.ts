import apiService from './apiService';
import { Endpoint } from './endpoints';

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
    return apiService.get<UserListResponse>({
      endpoint: Endpoint.USERS.LIST,
      params: { page: 1, limit: 50, ...params },
    });
  },

  async invite(name: string, email: string, role: string): Promise<User> {
    const res = await apiService.post<{ data: User }>({
      endpoint: Endpoint.USERS.INVITE,
      data: { name, email, role },
    });
    return res.data;
  },

  async updateStatus(id: string, status: string): Promise<void> {
    await apiService.put({
      endpoint: Endpoint.USERS.UPDATE,
      data: { id, status },
    });
  },

  async resetPassword(id: string): Promise<void> {
    await apiService.post({
      endpoint: Endpoint.USERS.RESET_PASSWORD,
      data: { id },
    });
  },

  async deleteUser(id: string): Promise<void> {
    await apiService.delete({
      endpoint: Endpoint.USERS.DELETE,
      data: { id },
    });
  },
};
