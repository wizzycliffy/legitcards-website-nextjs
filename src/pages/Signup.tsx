'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Gift,
  ArrowLeft,
  Check,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import gift from "@/assets/gift.png";

type SignupFormData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

/* ---------------- Sub-Components (Defined outside to prevent re-mounting and focus loss) ---------------- */

/* ---------------- Step 1: Signup Form ---------------- */
interface SignupFormProps {
  formData: SignupFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignupFormData>>;
  signup: (userData: any) => Promise<any>;
  isLoading: boolean;
  toast: any;
}

const SignupForm = ({ formData, setFormData, signup, isLoading, toast }: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const passwordRules = [
    { label: "At least 8 characters", valid: formData.password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(formData.password) },
    { label: "One number", valid: /[0-9]/.test(formData.password) },
  ];

  const isPasswordValid = passwordRules.every(rule => rule.valid);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      toast({ title: "Invalid Password", description: "Please follow the password requirements.", variant: "destructive" });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Passwords match error", variant: "destructive" });
      return;
    }
    try {
      await signup({
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phone,
      });
      toast({ title: "OTP Sent! 📧", description: "Please check your email for the activation code." });
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message || "Something went wrong", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSignupSubmit} className="space-y-4">
      <h1 className="text-3xl font-display font-bold text-center mb-2">Create Account</h1>
      <p className="text-muted-foreground text-center mb-6">Join thousands of traders on Legitcard</p>
      
      <div>
        <Label>Email</Label>
        <Input name="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
      </div>
      <div>
        <Label>Phone</Label>
        <Input name="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
      </div>
      <div>
        <Label>Password</Label>
        <div className="relative">
          <Input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {/* Password Rules */}
        <div className="mt-3 space-y-1.5">
          {passwordRules.map((rule, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${rule.valid ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                {rule.valid && <Check className="w-3 h-3" />}
              </div>
              <span className={rule.valid ? "text-success" : "text-muted-foreground"}>{rule.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label>Confirm Password</Label>
        <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
      </div>
      <div className="flex items-start gap-2">
        <Checkbox checked={agreeTerms} onCheckedChange={(v) => setAgreeTerms(Boolean(v))} />
        <Label className="text-sm">I agree to the Terms and Privacy Policy</Label>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || !agreeTerms}>
        {isLoading ? "Processing..." : "Create Account"}
      </Button>
    </form>
  );
};

/* ---------------- Step 2: Activation OTP ---------------- */
interface ActivationStepProps {
  tempEmail: string | null;
  otp: string;
  setOtp: (v: string) => void;
  activateAccount: (email: string, code: string) => Promise<any>;
  resendCode: (email: string) => Promise<any>;
  isLoading: boolean;
  toast: any;
}

const ActivationStep = ({ tempEmail, otp, setOtp, activateAccount, resendCode, isLoading, toast }: ActivationStepProps) => {
  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await activateAccount(tempEmail!, otp);
      toast({ title: "Account Activated! ✅", description: "Let's complete your profile." });
    } catch (err: any) {
      toast({ title: "Activation failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleActivate} className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-bold">Verify Email</h1>
        <p className="text-muted-foreground mt-2">Enter the code sent to <span className="text-foreground font-medium">{tempEmail}</span></p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit code" className="text-center text-2xl tracking-widest h-14" required />
      </div>

      <Button type="submit" className="w-full h-12" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify & Continue"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Didn't receive the code?{" "}
        <button type="button" onClick={() => resendCode(tempEmail!)} className="text-primary font-semibold hover:underline" disabled={isLoading}>Resend</button>
      </p>
    </form>
  );
};

/* ---------------- Step 3: Profile Setup ---------------- */
interface ProfileStepProps {
  profileData: any;
  setProfileData: (v: any) => void;
  updateProfile: (data: any) => Promise<any>;
  tempEmail: string | null;
  tempUserId: string | null;
  phone: string;
  isLoading: boolean;
  toast: any;
}

const ProfileStep = ({ profileData, setProfileData, updateProfile, tempEmail, tempUserId, phone, isLoading, toast }: ProfileStepProps) => {
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        ...profileData,
        email: tempEmail,
        userid: tempUserId,
        phoneNumber: phone,
      });
      toast({ title: "Profile Updated! ✨" });
    } catch (err: any) {
      toast({ title: "Profile update failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleProfileSubmit} className="space-y-4">
      <h1 className="text-3xl font-display font-bold text-center mb-2">Complete Profile</h1>
      <p className="text-muted-foreground text-center mb-6">Tell us a bit more about yourself</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input value={profileData.firstname} onChange={(e) => setProfileData({...profileData, firstname: e.target.value})} required />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input value={profileData.lastname} onChange={(e) => setProfileData({...profileData, lastname: e.target.value})} required />
        </div>
      </div>
      <div>
        <Label>Username</Label>
        <Input value={profileData.username} onChange={(e) => setProfileData({...profileData, username: e.target.value})} required />
      </div>
      <div>
        <Label>Gender</Label>
        <select 
          className="w-full h-10 px-3 rounded-md border border-input bg-background"
          value={profileData.gender}
          onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <Button type="submit" className="w-full h-12" disabled={isLoading}>
        {isLoading ? "Saving..." : "Continue to Security"}
      </Button>
    </form>
  );
};

/* ---------------- Step 4: PIN Choice ---------------- */
interface PinChoiceStepProps {
  sendPinOtp: (v: any) => Promise<any>;
  tempUserId: string | null;
  password: string;
  isLoading: boolean;
  toast: any;
  navigate: any;
}

const PinChoiceStep = ({ sendPinOtp, tempUserId, password, isLoading, toast, navigate }: PinChoiceStepProps) => {
  const handleSetupNow = async () => {
    try {
      await sendPinOtp({ id: tempUserId!, password: password });
      toast({ title: "OTP Sent!", description: "A verification code has been sent for PIN setup." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <ShieldCheck className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-3xl font-display font-bold">Secure Your Account</h1>
      <p className="text-muted-foreground">Set up a transaction PIN to secure your trades and withdrawals.</p>
      
      <div className="space-y-3">
        <Button onClick={handleSetupNow} className="w-full h-12" disabled={isLoading}>
          {isLoading ? "Initializing..." : "Set Up PIN Now"}
        </Button>
        <Button variant="ghost" onClick={() => navigate("/login")} className="w-full h-12">
          Skip for Later
        </Button>
      </div>
    </div>
  );
};

/* ---------------- Step 5: PIN Setup ---------------- */
interface PinSetupStepProps {
  setPin: (v: any) => Promise<any>;
  tempUserId: string | null;
  pin: string;
  setPinValue: (v: string) => void;
  pinToken: string;
  setPinToken: (v: string) => void;
  isLoading: boolean;
  toast: any;
}

const PinSetupStep = ({ setPin, tempUserId, pin, setPinValue, pinToken, setPinToken, isLoading, toast }: PinSetupStepProps) => {
  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setPin({
        id: tempUserId!,
        pin: pin,
        token: pinToken,
      });
    } catch (err: any) {
      toast({ title: "PIN Setup failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSetPin} className="space-y-4 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <KeyRound className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-3xl font-display font-bold text-center mb-2">Create PIN</h1>
      <p className="text-muted-foreground text-center mb-6">Create a 4-digit PIN for transactions</p>
      
      <div className="space-y-4">
        <div>
          <Label>Verification Code</Label>
          <Input value={pinToken} onChange={(e) => setPinToken(e.target.value)} placeholder="6-digit code" className="text-center tracking-widest h-12" required />
        </div>
        <div>
          <Label>4-Digit PIN</Label>
          <Input 
            type="password" 
            value={pin} 
            onChange={(e) => setPinValue(e.target.value)} 
            maxLength={4} 
            placeholder="****" 
            className="text-center text-2xl h-14" 
            required 
          />
        </div>
      </div>
      <Button type="submit" className="w-full h-12" disabled={isLoading}>
        {isLoading ? "Saving..." : "Complete Registration"}
      </Button>
    </form>
  );
};

export default function Signup() {
  const { 
    signup, 
    activateAccount, 
    resendCode, 
    updateProfile, 
    sendPinOtp, 
    setPin, 
    registrationStep, 
    tempEmail, 
    tempUserId,
    isLoading 
  } = useAuth();
  
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [pin, setPinValue] = useState("");
  const [pinToken, setPinToken] = useState("");
  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    gender: "male",
  });

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (registrationStep === 'completed') {
      toast({
        title: "Registration Complete! ✅",
        description: "Your account is now fully set up. Please login.",
      });
      router.push("/login");
    }
  }, [registrationStep, router, toast]);

  const renderStep = () => {
    switch (registrationStep) {
      case 'signup': 
        return <SignupForm formData={formData} setFormData={setFormData} signup={signup} isLoading={isLoading} toast={toast} />;
      case 'activation': 
        return <ActivationStep tempEmail={tempEmail} otp={otp} setOtp={setOtp} activateAccount={activateAccount} resendCode={resendCode} isLoading={isLoading} toast={toast} />;
      case 'profile': 
        return (
          <ProfileStep 
            profileData={profileData} 
            setProfileData={setProfileData} 
            updateProfile={updateProfile} 
            tempEmail={tempEmail} 
            tempUserId={tempUserId} 
            phone={formData.phone} 
            isLoading={isLoading} 
            toast={toast} 
          />
        );
      case 'pin': 
        if (pinToken !== "") {
          return (
            <PinSetupStep 
              setPin={setPin} 
              tempUserId={tempUserId} 
              pin={pin} 
              setPinValue={setPinValue} 
              pinToken={pinToken} 
              setPinToken={setPinToken} 
              isLoading={isLoading} 
              toast={toast} 
            />
          );
        }
        return <PinChoiceStep sendPinOtp={sendPinOtp} tempUserId={tempUserId} password={formData.password} isLoading={isLoading} toast={toast} navigate={router.push} />;
      default: 
        return <SignupForm formData={formData} setFormData={setFormData} signup={signup} isLoading={isLoading} toast={toast} />;
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex">
      {/* Left Panel */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 md:p-12 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Gift className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">Legitcard</span>
          </Link>
        </div>

        {registrationStep === 'signup' && (
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        )}

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            {renderStep()}
            
            {registrationStep === 'signup' && (
              <p className="text-center text-sm mt-6 text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center" style={{ backgroundImage: `url(${gift})` }}>
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-lg text-center text-white p-8">
           <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
             <Gift className="w-12 h-12" />
           </div>
           <h2 className="text-4xl font-display font-bold mb-4">Secure & Simple</h2>
           <p className="text-white/80 text-lg mb-8">Convert your gift cards to cash instantly with the best rates in the market.</p>
           <div className="space-y-4 text-left inline-block">
             <div className="flex items-center gap-3">
               <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"><Check className="w-4 h-4 text-green-500" /></div>
               <span>Instant Payment</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"><Check className="w-4 h-4 text-green-500" /></div>
               <span>Safe & Secure</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
