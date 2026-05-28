import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { loginService } from '@/lib/api/loginService';
import ThemeToggle from '@/components/ThemeToggle';
import AuthVisualPanel from '@/components/AuthVisualPanel';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await loginService.signIn(data as { email: string; password: string; });
      if (response?.token) {
        const userData = {
          user_id: response.user_id,
          email: response.email,
          name: response.name || '',
          is_email_verified: response.is_email_verified ?? 1,
        };
        login(response.token, userData);
        // If email not verified, redirect to OTP verification
        if (response.is_email_verified === 0) {
          navigate('/verify-otp', { state: { email: data.email, name: userData.name } });
        } else {
          navigate('/dashboard');
        }
      }
    } catch {
      // error toast handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <ThemeToggle />
      <AuthVisualPanel
        appName="App"
        eyebrow="Your operating center"
        title="Pick up the work that matters most."
        description="A focused sign-in experience with your workspace, priorities, and next actions waiting on the other side."
        imageUrl="https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&q=80&auto=format&fit=crop"
        bullets={['Resume active workflows', 'Review key updates', 'Stay securely connected']}
      />

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6"
        style={{ background: 'var(--auth-bg)' }}>
        <Card className="w-full max-w-md border-0 shadow-none"
          style={{ background: 'var(--auth-card-bg)' }}>
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>

            <div className="mt-6 p-3 rounded-md bg-muted border border-border text-sm">
              <p className="font-medium mb-2 text-muted-foreground">Demo Credentials</p>
              <div className="flex flex-wrap gap-2">
                {([
                  { role: 'Super Admin', email: 'superadmin@demo.com' },
                  { role: 'Engineer', email: 'engineer@demo.com' },
                ] as const).map(({ role, email }) => (
                  <Button
                    key={role}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setValue('email', email);
                      setValue('password', 'Demo@1234');
                      localStorage.setItem('demo_current_role', role);
                    }}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
