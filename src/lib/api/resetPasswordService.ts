export interface ResetPasswordPayload {
  reset_token: string;
  newPassword: string;
}

export const resetPasswordService = {
  resetPassword: (data: ResetPasswordPayload): Promise<void> => {
    // This is mock data (TECHDEBT)
    // apiService.post({ endpoint: Endpoint.AUTH.RESET_PASSWORD, data }),
    void data;
    return Promise.resolve();
  },
};
