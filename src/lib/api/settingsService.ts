import apiService from './apiService';

export interface SettingsDetail {
  openai_api_key: string;
  sendgrid_api_key: string;
}

export interface SettingsUpdatePayload {
  openai_api_key: string;
  sendgrid_api_key: string;
}

export interface SettingsUpdateResponse {
  id: string;
}

export interface SettingsTestConnectionPayload {
  integration: 'openai' | 'sendgrid' | 'all';
}

export interface SettingsTestConnectionResponse {
  success: boolean;
  integration: string;
}

export const settingsService = {
  async detail(): Promise<SettingsDetail> {
    const res = await apiService.get<{ data: SettingsDetail }>({
      endpoint: 'settings/detail',
      params: {},
    });
    return res.data;
  },

  async update(payload: SettingsUpdatePayload): Promise<SettingsUpdateResponse> {
    const res = await apiService.put<{ data: SettingsUpdateResponse }>({
      endpoint: 'settings/update',
      data: payload,
    });
    return res.data;
  },

  async testConnection(payload: SettingsTestConnectionPayload): Promise<SettingsTestConnectionResponse> {
    const res = await apiService.post<{ data: SettingsTestConnectionResponse }>({
      endpoint: 'settings/test-connection',
      data: payload,
    });
    return res.data;
  },
};
