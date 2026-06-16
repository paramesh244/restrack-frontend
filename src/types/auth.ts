// Shared RBAC role type. Sourced from the user's `role` field returned by
// the backend signin/verifyOtp responses and persisted in AuthContext.
export type AppRole = 'Super Admin' | 'Engineer';
