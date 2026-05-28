export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  user_id: string;
}

export const signupService = {
  signUp: (data: SignupPayload): Promise<SignupResponse> => {
    // This is mock data (TECHDEBT)
    // apiService.post<SignupResponse>({ endpoint: Endpoint.AUTH.SIGNUP, data }),
    void data;
    return Promise.resolve({
      user_id: 'mock-user-001',
    });
  },
};
