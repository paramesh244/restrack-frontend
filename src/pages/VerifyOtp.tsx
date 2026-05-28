import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { verifyOtpService } from '@/lib/api/verifyOtpService';
import { toast } from '@/lib/toast';
import ThemeToggle from '@/components/ThemeToggle';
import AuthVisualPanel from '@/components/AuthVisualPanel';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email: string = location.state?.email ?? '';
  const name: string = location.state?.name ?? '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) navigate('/login');
  }, [email, navigate]);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const response = await verifyOtpService.verifyOtp({ email, otp });
      if (response?.token) {
        login(response.token, {
          user_id: response.user_id,
          email,
          name,
          is_email_verified: 1,
        });
        navigate('/dashboard');
      }
    } catch {
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await verifyOtpService.resendOtp(email);
      setCooldown(60);
    } catch {
      // error toast handled by interceptor
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <ThemeToggle />
      <AuthVisualPanel
        appName="App"
        eyebrow="Email verification"
        title="Confirm your account and unlock the workspace."
        description="Enter the code from your inbox so your account can move from setup to active collaboration."
        imageUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80&auto=format&fit=crop"
        bullets={['Six-digit verification', 'Secure onboarding', 'Access after confirmation']}
      />

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background: 'var(--auth-bg)' }}>
      <Card className="w-full max-w-md border-0 shadow-none"
        style={{ background: 'var(--auth-card-bg)' }}>
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
          <CardDescription>
            We sent a 6-digit code to{' '}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button className="w-full" onClick={handleVerify} disabled={loading || otp.length < 6}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify email
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Didn't receive the code?{' '}
            {cooldown > 0 ? (
              <span className="text-muted-foreground">Resend in {cooldown}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-primary hover:underline font-medium disabled:opacity-50"
              >
                {resending ? 'Sending…' : 'Resend code'}
              </button>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default VerifyOtp;
