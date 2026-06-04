import apiService from './apiService';
import { Endpoint } from './endpoints';
import { MOCK_STATS, MOCK_ACTIVITY, MOCK_RESOLUTIONS } from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export interface DashboardStats {
  total_resolutions: number;
  resolutions_this_month: number;
  most_used_tags: string[];
  open_issues: number;
}

export interface ActivityItem {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  action: string;
  resolution_id: string;
  resolution_title: string;
  created_at: string;
}

export interface Resolution {
  id: string;
  title: string;
  severity: string;
  tags: string[];
  hardware_reference: string;
  firmware_version: string;
  created_by: { id: string; name: string; email: string };
  created_at: string;
  updated_at: string;
}

export interface CreateResolutionPayload {
  title: string;
  problem: string;
  root_cause: string;
  solution: string;
  tags: string[];
  hardware_reference: string;
  firmware_version: string;
  extra_notes: string;
  severity: string;
}

export const dashboardService = {
  async createResolution(payload: CreateResolutionPayload): Promise<{ id: string }> {
    if (USE_MOCK) return { id: `mock-${Date.now()}` };
    const res = await apiService.post<{ data: { id: string } }>({
      endpoint: Endpoint.RESOLUTIONS.CREATE,
      data: payload,
    });
    return res.data;
  },

  async getStats(): Promise<DashboardStats> {
    if (USE_MOCK) return MOCK_STATS;
    const res = await apiService.get<{ data: DashboardStats }>({
      endpoint: Endpoint.DASHBOARD.STATS,
      params: {},
    });
    return res.data;
  },

  async getRecentActivity(limit = 5): Promise<ActivityItem[]> {
    if (USE_MOCK) return MOCK_ACTIVITY.slice(0, limit);
    const res = await apiService.get<{ data: ActivityItem[] }>({
      endpoint: Endpoint.ACTIVITY.RECENT,
      params: { page: 1, limit },
    });
    return res.data;
  },

  async getRecentResolutions(limit = 5): Promise<Resolution[]> {
    if (USE_MOCK) return MOCK_RESOLUTIONS.slice(0, limit);
    const res = await apiService.get<{ data: Resolution[] }>({
      endpoint: Endpoint.RESOLUTIONS.LIST,
      params: { page: 1, limit, sort_by: 'created_at', sort_order: 'desc' },
    });
    return res.data;
  },
};
