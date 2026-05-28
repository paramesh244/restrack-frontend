export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyResetOtpResponse {
  reset_token: string;
}

export const verifyResetOtpService = {
  verifyResetOtp: (data: VerifyResetOtpPayload): Promise<VerifyResetOtpResponse> => {
    // This is mock data (TECHDEBT)
    // apiService.post<VerifyResetOtpResponse>({ endpoint: Endpoint.AUTH.VERIFY_RESET_OTP, data }),
    void data;
    return Promise.resolve({
      reset_token: 'mock-reset-token-xyz789',
    });
  },

  resendResetOtp: (email: string): Promise<void> => {
    // This is mock data (TECHDEBT)
    // apiService.post({ endpoint: Endpoint.AUTH.RESEND_RESET_OTP, data: { email } }),
    void email;
    return Promise.resolve();
  },
};
