export const Endpoint = {
  AUTH: {
    SIGNUP: 'auth/signup',
    SIGNIN: 'auth/signin',
    VERIFY_OTP: 'auth/verifyOtp',
    RESEND_OTP: 'auth/resendOtp',
    FORGOT_PASSWORD: 'auth/forgotPassword',
    VERIFY_RESET_OTP: 'auth/verifyResetOtp',
    RESET_PASSWORD: 'auth/resetPassword',
    RESEND_RESET_OTP: 'auth/resendResetOtp',
  },
  USER: {
    PROFILE: (userId: string) => `user/profile/${userId}`,
  },
};
