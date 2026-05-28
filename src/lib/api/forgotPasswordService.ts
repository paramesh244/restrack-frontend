export interface ForgotPasswordPayload {
  email: string;
}

export const forgotPasswordService = {
  forgotPassword: (data: ForgotPasswordPayload): Promise<void> => {
    // This is mock data (TECHDEBT)
    // apiService.post({ endpoint: Endpoint.AUTH.FORGOT_PASSWORD, data }),
    void data;
    return Promise.resolve();
  },
};
