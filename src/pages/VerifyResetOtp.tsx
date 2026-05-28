import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { verifyResetOtpService } from '@/lib/api/verifyResetOtpService';
import { toast } from '@/lib/toast';
import ThemeToggle from '@/components/ThemeToggle';
import AuthVisualPanel from '@/components/AuthVisualPanel';

const VerifyResetOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email: string = location.state?.email ?? '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }
    setLoading(true);
    try {
      const response = await verifyResetOtpService.verifyResetOtp({ email, otp });
      if (response?.reset_token) {
        navigate('/reset-password', { state: { reset_token: response.reset_token } });
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
      await verifyResetOtpService.resendResetOtp(email);
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
        eyebrow="Recovery checkpoint"
        title="Verify the code before changing credentials."
        description="This extra checkpoint protects the account reset flow before a new password is created."
        imageUrl="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=1200&q=80&auto=format&fit=crop"
        bullets={['Reset code required', 'Identity check first', 'Password change next']}
      />

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background: 'var(--auth-bg)' }}>
      <Card className="w-full max-w-md border-0 shadow-none"
        style={{ background: 'var(--auth-card-bg)' }}>
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Enter reset code</CardTitle>
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
            Verify code
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
            <Link to="/forgot-password" className="text-primary hover:underline">
              Back
            </Link>
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default VerifyResetOtp;
