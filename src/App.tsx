import { Toaster } from '@/components/ui/toaster';
import { CustomToastProvider } from '@/components/ui/custom-toast-manager';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { MockAuthProvider } from '@/contexts/MockAuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import BuiltBy from '@/components/BuiltBy';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import AppLayout from '@/components/AppLayout';

import Dashboard from '@/pages/Dashboard';
import AIChat from '@/pages/AIChat';
import AdminPanel from '@/pages/AdminPanel';
import Team from '@/pages/Team';
import Settings from '@/pages/Settings';
import ResolutionDetail from '@/pages/ResolutionDetail';

import Login from '@/pages/Login';
import VerifyOtp from '@/pages/VerifyOtp';
import ForgotPassword from '@/pages/ForgotPassword';
import VerifyResetOtp from '@/pages/VerifyResetOtp';
import ResetPassword from '@/pages/ResetPassword';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <CustomToastProvider>
        <ThemeProvider>
          <AuthProvider>
            <MockAuthProvider>
              <ErrorBoundary>
                <BrowserRouter>
                  <Routes>
                    {/* Public auth routes — redirect to /dashboard if already authenticated */}
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />
                    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                    <Route path="/verify-reset-otp" element={<PublicRoute><VerifyResetOtp /></PublicRoute>} />
                    <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

                    {/* Protected app routes — wrapped in AppLayout (sidebar layout) */}
                    <Route
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <Outlet />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    >
                      {/* Accessible by both Super Admin and Engineer */}
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/ai-chat" element={<AIChat />} />

                      {/* Sub-page: Resolution Detail (not in nav menu) */}
                      <Route path="/resolutions/:resolutionId" element={<ResolutionDetail />} />

                      {/* Super Admin only routes */}
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute requiredRoles={["Super Admin"]}>
                            <AdminPanel />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/team"
                        element={
                          <ProtectedRoute requiredRoles={["Super Admin"]}>
                            <Team />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <ProtectedRoute requiredRoles={["Super Admin"]}>
                            <Settings />
                          </ProtectedRoute>
                        }
                      />
                    </Route>

                    {/* Default redirect to entry point */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                  </Routes>
                  <BuiltBy />
                </BrowserRouter>
              </ErrorBoundary>
            </MockAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </CustomToastProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
