import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { forgotPasswordService } from '@/lib/api/forgotPasswordService';
import ThemeToggle from '@/components/ThemeToggle';
import AuthVisualPanel from '@/components/AuthVisualPanel';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
});
type FormData = z.infer<typeof schema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await forgotPasswordService.forgotPassword({ email: data.email! });
      // Always navigate — backend is anti-enumeration
      navigate('/verify-reset-otp', { state: { email: data.email } });
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
        eyebrow="Account recovery"
        title="Reset access without losing your place."
        description="A short verification flow gets you back to your workspace while keeping account recovery deliberate and secure."
        imageUrl="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80&auto=format&fit=crop"
        bullets={['Email code verification', 'Protected reset flow', 'Return to your workspace']}
      />

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background: 'var(--auth-bg)' }}>
      <Card className="w-full max-w-md border-0 shadow-none"
        style={{ background: 'var(--auth-card-bg)' }}>
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
          <CardDescription>
            Enter your email and we'll send you a code to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send reset code
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Remembered your password?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
