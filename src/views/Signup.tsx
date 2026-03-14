'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Gift,
  ArrowLeft, Check, ShieldCheck, KeyRound, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import gift from '@/assets/gift.png';
import headerLogo from '@/assets/new header logo.png';

// ─────────────────────────────────────────────
// Step 1: Sign Up Form  (same as mobile step 1)
// ─────────────────────────────────────────────
interface SignupFormProps {
  onSuccess: (data: { email: string; phone: string; password: string; fullName: string }) => void;
  isLoading: boolean;
}

function SignupForm({ onSuccess, isLoading }: SignupFormProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { toast } = useToast();
  const { signup } = useAuth();

  const passwordRules = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One number', valid: /[0-9]/.test(password) },
  ];
  const isPasswordValid = passwordRules.every((r) => r.valid);

  // Validate full name (mobile requires >3 chars for first and last)
  const nameParts = fullName.trim().split(' ').filter(Boolean);
  const firstNameOk = (nameParts[0] ?? '').length >= 3;
  const lastNameOk = (nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0] ?? '').length >= 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstNameOk || !lastNameOk) {
      toast({ title: 'Invalid name', description: 'Please enter your full name (at least 3 characters each for first and last name).', variant: 'destructive' });
      return;
    }
    if (!isPasswordValid) {
      toast({ title: 'Invalid password', description: 'Please follow the password requirements.', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (!agreeTerms) {
      toast({ title: 'Please accept the terms and conditions', variant: 'destructive' });
      return;
    }

    try {
      await signup({ email, password, phoneNumber: phone.trim() || undefined, fullName });
      toast({ title: 'OTP Sent! 📧', description: 'Check your email for the 6-digit activation code.' });
      onSuccess({ email, phone: phone.trim(), password, fullName });
    } catch (err: any) {
      toast({ title: 'Signup failed', description: err.message || 'Something went wrong', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-display font-bold mb-1">Create Account</h1>
        <p className="text-muted-foreground text-sm">Join thousands of traders on Legitcard</p>
      </div>

      {/* Full Name */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1"><User className="w-3.5 h-3.5" />Full Name</Label>
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. John Doe"
          required
          autoComplete="name"
        />
        {fullName.trim() && (!firstNameOk || !lastNameOk) && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Enter your first and last name (min. 3 chars each)
          </p>
        )}
      </div>

      {/* Phone (optional) */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />Phone <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
          placeholder="e.g. 09012345678"
          autoComplete="tel"
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" />Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            required
            autoComplete="new-password"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {/* Password rules */}
        {password && (
          <div className="mt-2 space-y-1">
            {passwordRules.map((rule, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${rule.valid ? 'bg-green-500 text-white' : 'bg-muted'}`}>
                  {rule.valid && <Check className="w-2.5 h-2.5" />}
                </div>
                <span className={rule.valid ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>{rule.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label>Confirm Password</Label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
          required
          autoComplete="new-password"
        />
        {confirmPassword && password !== confirmPassword && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Passwords do not match
          </p>
        )}
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2 pt-1">
        <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(v) => setAgreeTerms(Boolean(v))} />
        <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer">
          By signing up, you have read and agreed to our{' '}
          <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
        </Label>
      </div>

      <Button type="submit" className="w-full h-12 text-base" disabled={isLoading || !agreeTerms}>
        {isLoading ? 'Creating account…' : 'Sign Up'}
      </Button>
    </form>
  );
}

// ─────────────────────────────────────────────
// Step 2: OTP Verification
// ─────────────────────────────────────────────
interface OtpStepProps {
  tempEmail: string | null;
  isLoading: boolean;
  onActivate: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
}

function OtpStep({ tempEmail, isLoading, onActivate, onResend }: OtpStepProps) {
  const [otp, setOtp] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendCountdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onActivate(otp.trim().toUpperCase());
  };

  const handleResend = async () => {
    if (!canResend) return;
    await onResend();
    setResendCountdown(60);
    setCanResend(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-bold">Verify Email</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Enter the 6-digit code sent to <span className="font-semibold text-foreground">{tempEmail}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">Check your spam folder if not in inbox.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="otp">Verification Code</Label>
        <Input
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\s/g, ''))}
          placeholder="Enter 6-digit code"
          className="text-center text-2xl tracking-[0.4em] h-14 font-mono"
          maxLength={6}
          required
          autoFocus
        />
      </div>

      <Button type="submit" className="w-full h-12" disabled={isLoading || otp.length < 6}>
        {isLoading ? 'Verifying…' : 'Verify & Continue'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Didn't receive the code?{' '}
        {canResend ? (
          <button type="button" onClick={handleResend} className="text-primary font-semibold hover:underline" disabled={isLoading}>
            Resend OTP
          </button>
        ) : (
          <span className="text-muted-foreground">Resend in {resendCountdown}s</span>
        )}
      </p>
    </form>
  );
}

// ─────────────────────────────────────────────
// Step 3: PIN Choice (optional — matches mobile)
// ─────────────────────────────────────────────
interface PinChoiceStepProps {
  tempUserId: string | null;
  password: string;
  isLoading: boolean;
  sendPinOtp: (v: any) => Promise<any>;
  toast: any;
  navigate: (p: string) => void;
}

function PinChoiceStep({ tempUserId, password, isLoading, sendPinOtp, toast, navigate }: PinChoiceStepProps) {
  const handleSetupNow = async () => {
    try {
      await sendPinOtp({ id: tempUserId!, password });
      toast({ title: 'OTP Sent!', description: 'A verification code has been sent for PIN setup.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <ShieldCheck className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-display font-bold">Secure Your Account</h1>
        <p className="text-muted-foreground mt-2 text-sm">Set up a 4-digit transaction PIN to secure your trades and withdrawals.</p>
      </div>
      <div className="space-y-3">
        <Button onClick={handleSetupNow} className="w-full h-12" disabled={isLoading}>
          {isLoading ? 'Initializing…' : 'Set Up PIN Now'}
        </Button>
        <Button variant="ghost" onClick={() => navigate('/login')} className="w-full h-12">
          Skip for Later
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 4: PIN Setup
// ─────────────────────────────────────────────
interface PinSetupStepProps {
  tempUserId: string | null;
  isLoading: boolean;
  setPin: (v: any) => Promise<any>;
  toast: any;
}

function PinSetupStep({ tempUserId, isLoading, setPin, toast }: PinSetupStepProps) {
  const [pinToken, setPinToken] = useState('');
  const [pin, setpinVal] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setPin({ id: tempUserId!, pin, token: pinToken });
    } catch (err: any) {
      toast({ title: 'PIN Setup failed', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
        <KeyRound className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-display font-bold">Create PIN</h1>
        <p className="text-muted-foreground mt-1 text-sm">Enter the code from your email and set a 4-digit PIN</p>
      </div>
      <div className="space-y-4 text-left">
        <div className="space-y-1.5">
          <Label>Verification Code</Label>
          <Input value={pinToken} onChange={(e) => setPinToken(e.target.value)} placeholder="6-digit code" className="text-center tracking-widest h-12" required />
        </div>
        <div className="space-y-1.5">
          <Label>4-Digit PIN</Label>
          <Input type="password" value={pin} onChange={(e) => setpinVal(e.target.value)} maxLength={4} placeholder="••••" className="text-center text-2xl h-14" required />
        </div>
      </div>
      <Button type="submit" className="w-full h-12" disabled={isLoading}>
        {isLoading ? 'Saving…' : 'Complete Registration'}
      </Button>
    </form>
  );
}

// ─────────────────────────────────────────────
// Main Signup Page
// ─────────────────────────────────────────────
export default function Signup() {
  const {
    signup, activateAccount, resendCode, updateProfile,
    sendPinOtp, setPin, registrationStep, tempEmail, tempUserId, isLoading,
  } = useAuth();

  const [localData, setLocalData] = useState({ email: '', phone: '', password: '', fullName: '' });
  const [pinToken, setPinToken] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  // Navigate on completion
  useEffect(() => {
    if (registrationStep === 'completed') {
      toast({ title: 'Registration Complete! ✅', description: 'Your account is fully set up. Please log in.' });
      router.push('/login');
    }
  }, [registrationStep, router, toast]);

  // After activation → auto-call updateProfile (no separate profile form, just like mobile)
  const handleActivate = async (otp: string) => {
    try {
      await activateAccount(tempEmail!, otp);
      toast({ title: 'Email Verified! ✅', description: 'Setting up your profile…' });

      // Immediately update profile like the mobile app does after OTP
      await updateProfile({ userid: tempUserId });
      toast({ title: 'Profile Ready! ✨', description: 'Your profile has been set up.' });
    } catch (err: any) {
      toast({ title: 'Verification failed', description: err.message || 'Invalid code', variant: 'destructive' });
    }
  };

  // tempUserId may not be in scope yet when activateAccount resolves — handled by redux state
  // We read tempUserId from redux directly above

  const handleResend = async () => {
    try {
      await resendCode(tempEmail!);
      toast({ title: 'Code resent!', description: 'Check your email again.' });
    } catch (err: any) {
      toast({ title: 'Resend failed', description: err.message, variant: 'destructive' });
    }
  };

  const renderStep = () => {
    switch (registrationStep) {
      case 'signup':
      default:
        return (
          <SignupForm
            isLoading={isLoading}
            onSuccess={(data) => setLocalData(data)}
          />
        );
      case 'activation':
        return (
          <OtpStep
            tempEmail={tempEmail}
            isLoading={isLoading}
            onActivate={handleActivate}
            onResend={handleResend}
          />
        );
      case 'pin':
        if (pinToken) {
          return <PinSetupStep tempUserId={tempUserId} isLoading={isLoading} setPin={setPin} toast={toast} />;
        }
        return (
          <PinChoiceStep
            tempUserId={tempUserId}
            password={localData.password}
            isLoading={isLoading}
            sendPinOtp={sendPinOtp}
            toast={toast}
            navigate={router.push}
          />
        );
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex">
      {/* Left panel — form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 md:p-12 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center">
            <Image
              src={headerLogo}
              alt="LegitCards"
              height={36}
              className="h-9 w-auto"
              priority
            />
          </Link>
        </div>

        {registrationStep === 'signup' && (
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        )}

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {(['signup', 'activation', 'pin'] as const).map((step, i) => {
            const steps = ['signup', 'activation', 'pin'];
            const currentIdx = steps.indexOf(registrationStep === 'profile' ? 'activation' : registrationStep);
            const isActive = i <= currentIdx;
            return (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-muted'}`} />
                {i < 2 && <div className={`h-px flex-1 w-8 transition-colors ${i < currentIdx ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            );
          })}
          <span className="text-xs text-muted-foreground ml-1">
            Step {(['signup', 'activation', 'pin'].indexOf(registrationStep === 'profile' ? 'activation' : registrationStep)) + 1} of 3
          </span>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-start justify-center">
          <div className="w-full max-w-md">
            {renderStep()}

            {registrationStep === 'signup' && (
              <p className="text-center text-sm mt-6 text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right panel — decorative */}
      <div
        className="hidden lg:flex w-1/2 relative items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${gift.src ?? gift})` }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-lg text-center text-white p-8">
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Gift className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-display font-bold mb-4">Secure &amp; Simple</h2>
          <p className="text-white/80 text-lg mb-8">Convert your gift cards to cash instantly with the best rates in the market.</p>
          <div className="space-y-4 text-left inline-block">
            {['Instant Payment', 'Safe & Secure', 'Best Rates Guaranteed'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
