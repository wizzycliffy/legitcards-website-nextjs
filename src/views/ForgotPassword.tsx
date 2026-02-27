'use client';
import { useState } from "react";
import Link from "next/link";
import { Mail, Gift, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // API Placeholder - Replace with actual password reset
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      setIsSubmitted(true);
      toast({
        title: "Email Sent!",
        description: "Check your inbox for password reset instructions.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 md:p-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <Gift className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">GiftFlow</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            {!isSubmitted ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Forgot Password?</h1>
                  <p className="text-muted-foreground">
                    No worries! Enter your email and we'll send you reset instructions.
                  </p>
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
                        className="pl-10 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Reset Password"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Check Your Email</h1>
                <p className="text-muted-foreground mb-6">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsSubmitted(false)}
                  className="mb-4"
                >
                  Try a different email
                </Button>
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email?{" "}
                  <button
                    onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                    className="text-primary hover:underline"
                  >
                    Resend
                  </button>
                </p>
              </div>
            )}

            {/* Sign Up Link */}
            <p className="text-center mt-8 text-muted-foreground">
              Remember your password?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <div className="hidden lg:flex w-1/2 gradient-primary items-center justify-center p-12">
        <div className="max-w-lg text-center text-primary-foreground">
          <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Gift className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">
            Secure Account Recovery
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            We take your security seriously. Follow the link in your email to securely reset your password.
          </p>
        </div>
      </div>
    </div>
  );
}
