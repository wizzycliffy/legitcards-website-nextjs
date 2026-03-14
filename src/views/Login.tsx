"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import gift from "@/assets/gift.png";
import headerLogo from "@/assets/new header logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // OTP state — shown when API returns LOGIN_CODE_SENT (unverified account)
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resendCountdown, setResendCountdown] = useState(60);

  const router = useRouter();
  const { toast } = useToast();
  const { login, activateAccount, updateProfile, resendCode } = useAuth();

  // Countdown timer for OTP resend
  useEffect(() => {
    if (!showOtp || resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [showOtp, resendCountdown]);

  // ── Login submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast({ title: "Login Successful ✅", description: "Welcome back! Redirecting to dashboard..." });
      router.push("/dashboard");
    } catch (error: any) {
      if (error?.type === "LOGIN_CODE_SENT") {
        // Unverified account — API already sent them an OTP
        setUnverifiedEmail(error?.email || email);
        setShowOtp(true);
        setResendCountdown(60);
        toast({
          title: "Email not verified 📧",
          description: "A verification code has been sent to your email.",
        });
      } else {
        toast({
          title: "Login Failed ❌",
          description: typeof error === "string" ? error : error?.message || "Login details incorrect, try again",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP verification submit (unverified account coming from login) ──
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await activateAccount(unverifiedEmail, otp.trim());
      toast({ title: "Email Verified! ✅", description: "Completing your registration..." });
      await updateProfile({});
      toast({ title: "Account Ready!", description: "Please sign in to continue." });
      setShowOtp(false);
      setOtp("");
      setPassword("");
    } catch (err: any) {
      toast({ title: "Verification failed", description: err?.message || "Invalid code", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    try {
      await resendCode(unverifiedEmail);
      setResendCountdown(60);
      toast({ title: "Code resent!", description: "Check your email." });
    } catch (err: any) {
      toast({ title: "Resend failed", description: err?.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex">
      {/* Left Panel */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 md:p-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center group">
            <Image src={headerLogo} alt="LegitCards" height={36} className="h-9 w-auto" priority />
          </Link>
          <ThemeToggle />
        </div>

        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            {!showOtp ? (
              /* ── Login Form ── */
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Welcome Back!</h1>
                  <p className="text-muted-foreground">Sign in to your account to continue trading</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 sm:h-12 h-[42px] rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 sm:h-12 h-[42px] rounded-lg"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" variant="hero" size="xl" className="w-full h-12 rounded-lg" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <p className="text-center text-[15px] sm:text-base mt-8 text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
                </p>
              </>
            ) : (
              /* ── OTP Verification for unverified accounts ── */
              <form onSubmit={handleOtpSubmit} className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold">Verify Your Email</h1>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Enter the 6-digit code sent to{" "}
                    <span className="font-semibold text-foreground">{unverifiedEmail}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Check your spam folder if not in inbox.</p>
                </div>

                <div className="space-y-1.5 text-left">
                  <Label>Verification Code</Label>
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\s/g, ""))}
                    placeholder="Enter 6-digit code"
                    className="text-center text-2xl tracking-[0.4em] h-14 font-mono"
                    maxLength={6}
                    required
                    autoFocus
                  />
                </div>

                <Button type="submit" className="w-full h-12" disabled={isLoading || otp.length < 6}>
                  {isLoading ? "Verifying…" : "Verify & Continue"}
                </Button>

                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?{" "}
                  {resendCountdown > 0 ? (
                    <span>Resend in {resendCountdown}s</span>
                  ) : (
                    <button type="button" onClick={handleResend} className="text-primary font-semibold hover:underline">
                      Resend OTP
                    </button>
                  )}
                </p>

                <button
                  type="button"
                  onClick={() => { setShowOtp(false); setOtp(""); }}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to login
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div
        className="hidden lg:flex w-1/2 relative items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${gift.src ?? gift})` }}
      >
        <div className="absolute inset-0 bg-black/80" />
      </div>
    </div>
  );
}