'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, CreditCard, Shield, Bell, Moon, LogOut, Camera, ChevronRight, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile, updateUserProfile } from "@/store/slices/authSlice";
import { fetchBanks, validateBankAccount, addBankAccount, fetchBankAccounts } from "@/store/slices/walletSlice";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Profile() {
  /* ---------------- HOOKS ---------------- */
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  console.log("Profile User:", user);

  /* ---------------- STATE ---------------- */
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedBankName, setSelectedBankName] = useState("");
  const [validatedAccountName, setValidatedAccountName] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  
  // Initialize form data with user details or defaults
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    accountNumber: "",
    username: "",
  });
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false });

  const { banks, bankAccounts } = useAppSelector((state) => state.wallet);

  // Fetch profile and banks on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (user?.userid) {
        try {
          const result = await dispatch(fetchUserProfile(user.userid)).unwrap();
          setProfileData(result);
          
          // Update form with fetched data
          setFormData({
            fullName: `${result.firstname || result.firstName || ''} ${result.lastname || result.lastName || ''}`.trim() || result.username || "",
            email: result.email || "",
            phone: result.phoneNumber || result.phone || "",
            accountNumber: "",
            username: result.username || "",
          });

          // Fetch banks and bank accounts
          dispatch(fetchBanks());
          dispatch(fetchBankAccounts(user.userid));
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      }
    };
    
    loadProfile();
  }, [dispatch, user?.userid]);

  const handleSavePersonal = async () => {
    if (!user?.userid || !profileData) return;
    
    try {
      const [firstName, ...lastNameParts] = formData.fullName.split(' ');
      const lastName = lastNameParts.join(' ');
      const {email, ...profileDataWithoutEmail} = profileData;
      
      // Send all existing data plus the new changes
      await dispatch(updateUserProfile({
        ...profileDataWithoutEmail,
        id: user.userid,
        firstname: firstName,
        lastname: lastName,
        phoneNumber: formData.phone,
      })).unwrap();
      
      toast({ title: "Profile Updated", description: "Your personal details have been saved." });
      setIsEditingPersonal(false);
      
      // Refresh profile data
      const result = await dispatch(fetchUserProfile(user.userid)).unwrap();
      setProfileData(result);
    } catch (error: any) {
      toast({ 
        title: "Update Failed", 
        description: error || "Failed to update profile",
        variant: "destructive" 
      });
    }
  };

  const handleValidateAccount = async () => {
    if (!selectedBank || !formData.accountNumber || !user?.userid) {
      toast({
        title: "Missing Information",
        description: "Please select a bank and enter account number",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    try {
      const trackingReference = `${Date.now()}${Math.random().toString(36).substring(7)}`;
      const result = await dispatch(
        validateBankAccount({
          bankCode: selectedBank,
          accountNumber: formData.accountNumber,
          trackingReference,
        })
      ).unwrap();

      setValidatedAccountName(result.bankAccountName || "");
      toast({
        title: "Account Validated",
        description: `Account Name: ${result.bankAccountName}`,
      });
    } catch (error: any) {
      toast({
        title: "Validation Failed",
        description: error || "Failed to validate account",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveBank = async () => {
    if (!user?.userid || !selectedBank || !formData.accountNumber || !validatedAccountName) {
      toast({
        title: "Validation Required",
        description: "Please validate your account first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await dispatch(
        addBankAccount({
          id: user.userid,
          bankName: selectedBankName,
          accountNumber: formData.accountNumber,
          accountName: validatedAccountName,
          data: { [selectedBankName]: selectedBank },
        })
      ).unwrap();
      
      toast({ title: "Bank Account Added", description: "Your bank account has been saved successfully." });
      setIsEditingBank(false);
      
      // Reset form
      setSelectedBank("");
      setSelectedBankName("");
      setFormData({ ...formData, accountNumber: "" });
      setValidatedAccountName("");
      
      // Refresh bank accounts
      dispatch(fetchBankAccounts(user.userid));
    } catch (error: any) {
      toast({ 
        title: "Save Failed", 
        description: error || "Failed to save bank account",
        variant: "destructive" 
      });
    }
  };


  const handleLogout = () => {
    logout();
    toast({ title: "Logged Out", description: "See you soon!" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
          </div>
          <h1 className="font-display font-bold">Profile Settings</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* User Info Card */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-bold uppercase">
                {formData.username.substring(0, 2)}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-display font-bold">{formData.fullName}</h2>
              <p className="text-muted-foreground">{formData.email}</p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1",
                  user?.isVerified ? "bg-success/10 text-success" : "bg-yellow-500/10 text-yellow-500"
                )}>
                  {user?.isVerified ? <Check className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
                  {user?.isVerified ? "Verified" : "Pending Verification"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Personal Details
            </h3>
            <Button 
              variant={isEditingPersonal ? "gradient" : "outline"} 
              size="sm" 
              onClick={isEditingPersonal ? handleSavePersonal : () => setIsEditingPersonal(true)}
              disabled={isLoading}
            >
              {isEditingPersonal ? "Save Changes" : "Edit"}
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} disabled={!isEditingPersonal} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={formData.email} disabled className="h-12 rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={!isEditingPersonal} className="h-12 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Bank Accounts
            </h3>
            {!isEditingBank && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditingBank(true)}
                disabled={isLoading}
              >
                Add Account
              </Button>
            )}
          </div>

          {/* List of Saved Bank Accounts */}
          <div className="space-y-4 mb-6">
            {bankAccounts.map((account) => (
              <div key={account._id} className="p-4 rounded-xl border border-border bg-muted/30 flex justify-between items-center">
                <div>
                  <p className="font-medium">{account.bankName}</p>
                  <p className="text-sm text-muted-foreground">{account.accountNumber} - {account.accountName}</p>
                </div>
                <div className="text-success text-xs font-medium px-2 py-1 rounded-full bg-success/10 border border-success/20">
                  Active
                </div>
              </div>
            ))}
            {bankAccounts.length === 0 && !isEditingBank && (
              <p className="text-center text-muted-foreground py-4 text-sm">No bank accounts added yet.</p>
            )}
          </div>

          {/* Add New Bank Account Form */}
          {isEditingBank && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label>Select Bank</Label>
                <Select 
                  value={selectedBank} 
                  onValueChange={(val) => {
                    setSelectedBank(val);
                    const bank = banks.find(b => b.code === val);
                    if (bank) setSelectedBankName(bank.name);
                    setValidatedAccountName(""); // Reset validation when bank changes
                  }}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank.code} value={bank.code}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Account Number</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="0000000000"
                    value={formData.accountNumber} 
                    onChange={(e) => {
                      setFormData({ ...formData, accountNumber: e.target.value });
                      setValidatedAccountName(""); // Reset validation when number changes
                    }} 
                    className="h-12 rounded-xl flex-1" 
                  />
                  <Button 
                    type="button"
                    variant="secondary" 
                    className="h-12 rounded-xl"
                    onClick={handleValidateAccount}
                    disabled={isValidating || !selectedBank || formData.accountNumber.length !== 10}
                  >
                    {isValidating ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              </div>

              {validatedAccountName && (
                <div className="p-4 rounded-xl bg-success/5 border border-success/20 space-y-1">
                  <p className="text-xs text-muted-foreground">Account Name</p>
                  <p className="font-semibold text-success">{validatedAccountName}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 rounded-xl"
                  onClick={() => setIsEditingBank(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="gradient" 
                  className="flex-1 h-12 rounded-xl"
                  onClick={handleSaveBank}
                  disabled={!validatedAccountName || isLoading}
                >
                  {isLoading ? "Saving..." : "Save Account"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-primary" /> Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-primary" />
                <span>Dark Mode</span>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>Email Notifications</span>
              </div>
              <Switch checked={notifications.email} onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <span>Push Notifications</span>
              </div>
              <Switch checked={notifications.push} onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })} />
            </div>
          </div>
        </div>

        {/* Logout */}
        <Button variant="destructive" size="lg" className="w-full" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>
    </div>
  );
}
