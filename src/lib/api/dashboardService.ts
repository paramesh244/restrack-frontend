import apiService from './apiService';
import { Endpoint } from './endpoints';
import { MOCK_STATS, MOCK_ACTIVITY, MOCK_RESOLUTIONS } from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const MOCK_STORAGE_KEY = 'restrack_mock_resolutions';

function loadMockResolutions(): ResolutionFull[] {
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ResolutionFull[];
  } catch { /* ignore */ }
  return [...MOCK_RESOLUTIONS];
}

function saveMockResolutions(list: ResolutionFull[]): void {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(list));
}

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

export interface ResolutionFull extends Resolution {
  problem: string;
  root_cause: string;
  solution: string;
  extra_notes: string;
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
    if (USE_MOCK) {
      const id = `mock-${Date.now()}`;
      const list = loadMockResolutions();
      list.unshift({
        id,
        title: payload.title,
        severity: payload.severity,
        tags: payload.tags,
        hardware_reference: payload.hardware_reference,
        firmware_version: payload.firmware_version,
        problem: payload.problem,
        root_cause: payload.root_cause,
        solution: payload.solution,
        extra_notes: payload.extra_notes,
        created_by: { id: 'usr-1', name: 'You', email: '' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      saveMockResolutions(list);
      return { id };
    }
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
    if (USE_MOCK) return loadMockResolutions().slice(0, limit);
    const res = await apiService.get<{ data: Resolution[] }>({
      endpoint: Endpoint.RESOLUTIONS.LIST,
      params: { page: 1, limit, sort_by: 'created_at', sort_order: 'desc' },
    });
    return res.data;
  },

  async getResolutions(params: { page?: number; limit?: number; search?: string; severity?: string } = {}): Promise<{ data: Resolution[]; total: number }> {
    if (USE_MOCK) {
      let results = loadMockResolutions();
      if (params.search) {
        const q = params.search.toLowerCase();
        results = results.filter((r) =>
          r.title.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.hardware_reference.toLowerCase().includes(q)
        );
      }
      if (params.severity) {
        results = results.filter((r) => r.severity === params.severity);
      }
      return { data: results, total: results.length };
    }
    const res = await apiService.get<{ data: Resolution[]; total: number }>({
      endpoint: Endpoint.RESOLUTIONS.LIST,
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        sort_by: 'created_at',
        sort_order: 'desc',
        ...(params.search ? { search: params.search } : {}),
        ...(params.severity ? { severity: params.severity } : {}),
      },
    });
    return res;
  },

  async getResolutionById(id: string): Promise<ResolutionFull> {
    if (USE_MOCK) {
      const list = loadMockResolutions();
      const found = list.find((r) => r.id === id);
      if (!found) throw new Error('Resolution not found');
      return found;
    }
    const res = await apiService.get<{ data: ResolutionFull }>({
      endpoint: Endpoint.RESOLUTIONS.GET(id),
      params: {},
    });
    return res.data;
  },

  async updateResolution(id: string, payload: CreateResolutionPayload): Promise<void> {
    if (USE_MOCK) {
      const list = loadMockResolutions();
      const idx = list.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error('Resolution not found');
      list[idx] = {
        ...list[idx],
        title: payload.title,
        severity: payload.severity,
        tags: payload.tags,
        hardware_reference: payload.hardware_reference,
        firmware_version: payload.firmware_version,
        problem: payload.problem,
        root_cause: payload.root_cause,
        solution: payload.solution,
        extra_notes: payload.extra_notes,
        updated_at: new Date().toISOString(),
      };
      saveMockResolutions(list);
      return;
    }
    await apiService.put<void>({
      endpoint: Endpoint.RESOLUTIONS.UPDATE(id),
      data: payload,
    });
  },

  async deleteResolution(id: string): Promise<void> {
    if (USE_MOCK) {
      const list = loadMockResolutions().filter((r) => r.id !== id);
      saveMockResolutions(list);
      return;
    }
    await apiService.delete<void>({
      endpoint: Endpoint.RESOLUTIONS.DELETE(id),
      data: {},
    });
  },
};
