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
  CHAT: {
    MESSAGE: 'chat/message',
    SUGGESTIONS: 'chat/suggestions',
    FEEDBACK: 'chat/feedback',
  },
  DASHBOARD: {
    STATS: 'dashboard/stats',
  },
  ACTIVITY: {
    RECENT: 'activity/recent',
  },
  RESOLUTIONS: {
    LIST: 'resolutions/list',
    CREATE: 'resolutions/create',
    GET: (id: string) => `resolutions/${id}`,
    UPDATE: (id: string) => `resolutions/${id}`,
    DELETE: (id: string) => `resolutions/${id}`,
  },
  USERS: {
    LIST: 'users/list',
    INVITE: 'users/invite',
    UPDATE: 'users/update',
    RESET_PASSWORD: 'users/reset-password',
    DELETE: 'users/delete',
  },
};
