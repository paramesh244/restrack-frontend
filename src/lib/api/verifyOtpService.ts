export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  token: string;
  user_id: string;
}

export const verifyOtpService = {
  verifyOtp: (data: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    // This is mock data (TECHDEBT)
    // apiService.post<VerifyOtpResponse>({ endpoint: Endpoint.AUTH.VERIFY_OTP, data }),
    void data;
    return Promise.resolve({
      token: 'mock-token-abc123',
      user_id: 'mock-user-001',
    });
  },

  resendOtp: (email: string): Promise<void> => {
    // This is mock data (TECHDEBT)
    // apiService.post({ endpoint: Endpoint.AUTH.RESEND_OTP, data: { email } }),
    void email;
    return Promise.resolve();
  },
};
