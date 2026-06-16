
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user_id: string;
  email: string;
  name: string;
  is_email_verified: number;
  role?: string;
}

export const loginService = {
  signIn: (data: LoginPayload): Promise<LoginResponse> => {
    // This is mock data (TECHDEBT)
    // apiService.post<LoginResponse>({ endpoint: Endpoint.AUTH.SIGNIN, data }),
    void data;
    return Promise.resolve({
      token: 'mock-token-abc123',
      user_id: 'mock-user-001',
      email: data.email,
      name: 'Mock User',
      is_email_verified: 1,
    });
  },
};
