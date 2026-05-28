import apiService from './apiService';
import { Endpoint } from './endpoints';

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

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const res = await apiService.get<{ data: DashboardStats }>({
      endpoint: Endpoint.DASHBOARD.STATS,
      params: {},
    });
    return res.data;
  },

  async getRecentActivity(limit = 5): Promise<ActivityItem[]> {
    const res = await apiService.get<{ data: ActivityItem[] }>({
      endpoint: Endpoint.ACTIVITY.RECENT,
      params: { page: 1, limit },
    });
    return res.data;
  },

  async getRecentResolutions(limit = 5): Promise<Resolution[]> {
    const res = await apiService.get<{ data: Resolution[] }>({
      endpoint: Endpoint.RESOLUTIONS.LIST,
      params: { page: 1, limit, sort_by: 'created_at', sort_order: 'desc' },
    });
    return res.data;
  },
};
