'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, CreditCard, Shield, Bell, Moon, Sun, LogOut, Camera, ChevronRight, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile, updateUserProfile, sendPinOtp, setPin } from "@/store/slices/authSlice";
import { fetchBanks, validateBankAccount, addBankAccount, fetchBankAccounts } from "@/store/slices/walletSlice";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Profile() {
  /* ---------------- HOOKS ---------------- */
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  // console.log("Profile User:", user);

  /* ---------------- STATE ---------------- */
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [pinStep, setPinStep] = useState<"PASSWORD" | "OTP_AND_PIN">("PASSWORD");
  const [pinPassword, setPinPassword] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinOtp, setPinOtp] = useState("");

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedBankName, setSelectedBankName] = useState("");
  const [validatedAccountName, setValidatedAccountName] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSettingPin, setIsSettingPin] = useState(false);
  
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

  const handleSendPinOtp = async () => {
    if (!user?.userid || !pinPassword) {
      toast({ title: "Password Required", description: "Please enter your password to continue.", variant: "destructive" });
      return;
    }
    
    setIsSendingOtp(true);
    try {
      await dispatch(sendPinOtp({ id: user.userid, password: pinPassword })).unwrap();
      toast({ title: "OTP Sent", description: "Please check your email for the OTP code." });
      setPinStep("OTP_AND_PIN");
    } catch (error: any) {
      toast({ title: "Failed to Send OTP", description: typeof error === 'string' ? error : error?.message || "Invalid password or network error.", variant: "destructive" });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSetNewPin = async () => {
    if (!user?.userid || !newPin || !confirmPin || !pinOtp) {
      toast({ title: "Incomplete Fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    if (newPin !== confirmPin) {
      toast({ title: "PIN Mismatch", description: "Your new PIN and confirmation do not match.", variant: "destructive" });
      return;
    }
    if (newPin.length < 4) {
      toast({ title: "Invalid PIN", description: "PIN must be at least 4 digits.", variant: "destructive" });
      return;
    }

    setIsSettingPin(true);
    try {
      await dispatch(setPin({ id: user.userid, pin: newPin, token: pinOtp })).unwrap();
      toast({ title: "PIN Updated", description: "Your withdrawal PIN has been set successfully." });
      
      // Reset Pin flow
      setIsChangingPin(false);
      setPinStep("PASSWORD");
      setPinPassword("");
      setNewPin("");
      setConfirmPin("");
      setPinOtp("");
    } catch (error: any) {
      toast({ title: "PIN Update Failed", description: typeof error === 'string' ? error : error?.message || "Failed to verify OTP and set PIN.", variant: "destructive" });
    } finally {
      setIsSettingPin(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Logged Out", description: "See you soon!" });
    router.push("/login");
  };

  const primaryAccount = bankAccounts.length > 0 ? bankAccounts[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pb-12 relative overflow-hidden flex flex-col items-center">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#b32488] to-[#6b2c91] text-white shadow-md">
        <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => router.push('/dashboard')} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">My Profile</h1>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 -mr-2 hover:bg-white/10 rounded-full transition-colors">
            {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </button>
        </div>
      </header>
      
      {/* Background extension for gradient top */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-r from-[#b32488] to-[#6b2c91] z-0"></div>

      <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl mx-auto px-4 pt-6 md:pt-10 relative z-10 flex-grow">
        
        {/* User Info Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 md:p-8 mb-8 shadow-sm md:shadow-md border border-gray-100 dark:border-gray-800 relative flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[19px] md:text-2xl font-extrabold text-gray-900 dark:text-white mb-1.5 md:mb-2">{formData.fullName || 'User'}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-[15px] md:text-base mb-1.5 md:mb-2">@{formData.username || 'user'}</p>
            <p className="text-gray-500 dark:text-gray-400 text-[15px] md:text-base mb-1.5 md:mb-2">{formData.email}</p>
            <p className="text-gray-500 dark:text-gray-400 text-[15px] md:text-base">{formData.phone || 'No phone added'}</p>
          </div>
          
          <button 
            onClick={() => setIsEditingPersonal(true)}
            className="absolute bottom-5 right-5 md:static md:mt-0 text-sm md:text-base font-bold text-[#b32488] dark:text-[#d44ca7] uppercase tracking-wider hover:opacity-80 transition-opacity md:bg-pink-50 md:dark:bg-pink-900/30 md:px-6 md:py-3 md:rounded-xl"
          >
            UPDATE
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="flex flex-col">
            {/* Bank Details Section */}
            <h3 className="text-center md:text-left font-bold text-[#b32488] dark:text-[#d44ca7] mb-3 uppercase text-[13px] tracking-wide">Bank Details</h3>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 mb-8 shadow-sm border border-pink-100 dark:border-pink-900/30">
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center sm:items-start sm:flex-col gap-1">
              <span className="text-gray-400 dark:text-gray-500 text-sm">Account Name</span>
              <span className="font-bold text-[13px] sm:text-sm text-gray-900 dark:text-gray-100 uppercase text-right sm:text-left">{primaryAccount?.accountName || '---'}</span>
            </div>
            <div className="flex justify-between items-center sm:items-start sm:flex-col gap-1">
              <span className="text-gray-400 dark:text-gray-500 text-sm">Account Number</span>
              <span className="font-bold text-[13px] sm:text-sm text-gray-900 dark:text-gray-100 uppercase text-right sm:text-left">{primaryAccount?.accountNumber || '---'}</span>
            </div>
            <div className="flex justify-between items-center sm:items-start sm:flex-col gap-1">
              <span className="text-gray-400 dark:text-gray-500 text-sm">Bank Name</span>
              <span className="font-bold text-[13px] sm:text-sm text-gray-900 dark:text-gray-100 uppercase text-right sm:text-left">{primaryAccount?.bankName || '---'}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-1">
            <button 
              onClick={() => {
                 // Typically you'd open a modal to view all banks here. For now, we reuse the edit flag or open a view modal
                 setIsEditingBank(true);
              }} 
              className="text-[13px] font-bold text-[#b32488] dark:text-[#d44ca7] uppercase tracking-wider hover:opacity-80"
            >
              VIEW ACCOUNT
            </button>
            <button 
              onClick={() => setIsEditingBank(true)} 
              className="text-[13px] font-bold text-[#b32488] dark:text-[#d44ca7] uppercase tracking-wider hover:opacity-80"
            >
              ADD NEW
            </button>
          </div>
        </div>

          </div>

          <div className="flex flex-col">
            {/* Security Section */}
            <h3 className="text-center md:text-left font-bold text-[#b32488] dark:text-[#d44ca7] mb-3 uppercase text-[13px] tracking-wide">Security</h3>
        <div className="flex flex-col gap-3 mb-8">
          <div 
            onClick={() => setIsChangingPin(true)}
            className="bg-white dark:bg-gray-900 rounded-xl p-4 flex justify-between items-center shadow-sm border border-pink-100 dark:border-pink-900/30 hover:border-pink-200 cursor-pointer transition-colors"
          >
            <span className="font-bold text-[15px] text-gray-900 dark:text-gray-100">Update PIN</span>
            <ChevronRight className="text-[#b32488] dark:text-[#d44ca7] w-5 h-5" />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 flex justify-between items-center shadow-sm border border-pink-100 dark:border-pink-900/30">
            <div>
              <p className="font-bold text-[15px] text-gray-900 dark:text-gray-100">Push Notifications</p>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Receive updates about your transactions</p>
            </div>
            <Switch checked={notifications.push} onCheckedChange={(c) => setNotifications({...notifications, push: c})} />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 flex justify-between items-center shadow-sm border border-pink-100 dark:border-pink-900/30">
            <div>
              <p className="font-bold text-[15px] text-gray-900 dark:text-gray-100">2FA</p>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Two-factor authentication</p>
            </div>
            <Switch />
          </div>

          <div 
            onClick={() => setIsChangingPassword(true)}
            className="bg-white dark:bg-gray-900 rounded-xl p-4 flex justify-between items-center shadow-sm border border-pink-100 dark:border-pink-900/30 hover:border-pink-200 cursor-pointer transition-colors"
          >
            <span className="font-bold text-[15px] text-gray-900 dark:text-gray-100">Change Password</span>
            <ChevronRight className="text-[#b32488] dark:text-[#d44ca7] w-5 h-5" />
          </div>
        </div>

            {/* Support Section */}
            <div className="mt-8 mb-12 flex flex-col items-center md:items-start md:mt-auto md:pt-8 border-t-0 md:border-t md:border-gray-200 md:dark:border-gray-800">
              <button className="font-bold text-[13px] md:text-sm text-[#b32488] dark:text-[#d44ca7] uppercase tracking-wider mb-8 hover:opacity-80">
                Support
              </button>
              
              <Button variant="outline" size="lg" className="w-full md:w-auto md:min-w-[200px] border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals Implemented with Dialog for proper accessible z-indexing */}
      {/* Editing Personal Details Modal */}
      <Dialog open={isEditingPersonal} onOpenChange={setIsEditingPersonal}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white dark:bg-gray-900 max-h-[90vh] flex flex-col rounded-2xl">
          <DialogHeader className="bg-gradient-to-r from-[#b32488] to-[#6b2c91] text-white p-4 m-0 shadow-sm flex-shrink-0">
             <DialogTitle className="text-center text-lg font-bold">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-6 overflow-y-auto w-full">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="h-14 rounded-xl text-base" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-14 rounded-xl text-base" />
              </div>
              <div className="space-y-2 opacity-60">
                <Label>Email (Read Only)</Label>
                <Input value={formData.email} disabled className="h-14 rounded-xl text-base" />
              </div>
            </div>
            <div className="pt-4 pb-2">
               <Button onClick={handleSavePersonal} size="xl" disabled={isLoading} className="w-full bg-[#b32488] hover:bg-[#8f1d6d] h-14 rounded-full text-lg shadow-md">
                 {isLoading ? "Saving..." : "Save Details"}
               </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Adding/Editing Bank Modal */}
       <Dialog open={isEditingBank} onOpenChange={setIsEditingBank}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white dark:bg-gray-900 max-h-[90vh] flex flex-col rounded-2xl">
          <DialogHeader className="bg-gradient-to-r from-[#b32488] to-[#6b2c91] text-white p-4 m-0 shadow-sm flex-shrink-0">
             <DialogTitle className="text-center text-lg font-bold">Manage Banks</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-8 overflow-y-auto w-full">
            {/* Existing Banks */}
            {bankAccounts.length > 0 && (
              <div>
                <Label className="text-gray-500 mb-3 block text-sm">Saved Accounts</Label>
                <div className="space-y-3">
                  {bankAccounts.map((account) => (
                    <div key={account._id} className="p-4 rounded-xl border border-pink-200 dark:border-pink-900/30 bg-pink-50/50 dark:bg-gray-800 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{account.bankName}</p>
                        <p className="text-sm text-gray-500">{account.accountNumber} - <span className="text-xs uppercase">{account.accountName}</span></p>
                      </div>
                      <Check className="text-green-500 w-5 h-5 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          
            {/* Add New */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-5 relative">
              <h3 className="font-bold text-[15px] text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">Add New Bank Account</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Bank</Label>
                  <Select 
                    value={selectedBank} 
                    onValueChange={(val) => {
                      setSelectedBank(val);
                      const bank = banks.find(b => b.code === val);
                      if (bank) setSelectedBankName(bank.name);
                      setValidatedAccountName("");
                    }}
                  >
                    <SelectTrigger className="h-14 rounded-xl bg-white dark:bg-gray-900 text-base">
                      <SelectValue placeholder="Choose your bank" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4} className="max-h-[300px]">
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
                        setValidatedAccountName("");
                      }} 
                      className="h-14 rounded-xl bg-white dark:bg-gray-900 text-base flex-1" 
                    />
                    <Button 
                      type="button"
                      variant="secondary" 
                      className="h-14 rounded-xl px-6"
                      onClick={handleValidateAccount}
                      disabled={isValidating || !selectedBank || formData.accountNumber.length !== 10}
                    >
                      {isValidating ? "..." : "Verify"}
                    </Button>
                  </div>
                </div>

                {validatedAccountName && (
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 space-y-1">
                    <p className="text-xs text-green-700 dark:text-green-400">Account Name Found</p>
                    <p className="font-bold text-green-800 dark:text-green-300 uppercase">{validatedAccountName}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 pb-2 mt-auto">
               <Button 
                 onClick={handleSaveBank} 
                 size="xl" 
                 disabled={!validatedAccountName || isLoading} 
                 className="w-full bg-[#b32488] hover:bg-[#8f1d6d] h-14 rounded-full text-lg shadow-md"
               >
                 {isLoading ? "Saving..." : "Save Account"}
               </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update PIN Modal proper implementation */}
      <Dialog 
        open={isChangingPin} 
        onOpenChange={(isOpen) => {
          setIsChangingPin(isOpen);
          if (!isOpen) {
            // reset on close
            setPinStep("PASSWORD");
            setPinPassword("");
            setNewPin("");
            setConfirmPin("");
            setPinOtp("");
          }
        }}
      >
         <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl">
           <DialogHeader className="bg-gradient-to-r from-[#b32488] to-[#6b2c91] text-white p-4 m-0 shadow-sm flex-shrink-0">
             <DialogTitle className="text-center font-bold">Update PIN</DialogTitle>
           </DialogHeader>
           
           {pinStep === "PASSWORD" ? (
             <div className="p-6 space-y-6">
               <p className="text-sm text-gray-500 text-center">For security, please enter your password to receive an OTP.</p>
               <div className="space-y-4">
                 <div>
                   <Label>Current Password</Label>
                   <Input 
                     type="password" 
                     placeholder="Enter your login password" 
                     value={pinPassword}
                     onChange={(e) => setPinPassword(e.target.value)}
                     className="h-14 mt-2 rounded-xl" 
                   />
                 </div>
                 <Button 
                   className="w-full bg-[#b32488] hover:bg-[#8f1d6d] h-14 rounded-full text-lg mt-4 shadow-md" 
                   onClick={handleSendPinOtp}
                   disabled={isSendingOtp}
                 >
                   {isSendingOtp ? "Sending OTP..." : "Continue"}
                 </Button>
               </div>
             </div>
           ) : (
             <div className="p-6 space-y-5">
               <div className="text-center space-y-2">
                 <p className="text-sm font-semibold text-[#b32488]">OTP Code Sent!</p>
                 <p className="text-xs text-gray-500">Check your email and enter the code below with your new PIN.</p>
               </div>
               
               <div className="space-y-3">
                 <div>
                   <Label className="text-xs text-gray-500">OTP Code</Label>
                   <Input 
                     type="text" 
                     placeholder="Enter 6-digit OTP" 
                     value={pinOtp}
                     onChange={(e) => setPinOtp(e.target.value)}
                     className="h-12 tracking-widest text-center mt-1 rounded-lg" 
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                   <div>
                     <Label className="text-xs text-gray-500">New PIN</Label>
                     <Input 
                       type="password" 
                       placeholder="****" 
                       maxLength={4} 
                       value={newPin}
                       onChange={(e) => setNewPin(e.target.value)}
                       className="h-12 text-center text-xl tracking-[0.5em] mt-1 rounded-lg" 
                     />
                   </div>
                   <div>
                     <Label className="text-xs text-gray-500">Confirm PIN</Label>
                     <Input 
                       type="password" 
                       placeholder="****" 
                       maxLength={4} 
                       value={confirmPin}
                       onChange={(e) => setConfirmPin(e.target.value)}
                       className="h-12 text-center text-xl tracking-[0.5em] mt-1 rounded-lg" 
                     />
                   </div>
                 </div>
                 
                 <Button 
                   className="w-full bg-[#b32488] hover:bg-[#8f1d6d] h-14 rounded-full text-lg mt-6 shadow-md" 
                   onClick={handleSetNewPin}
                   disabled={isSettingPin}
                 >
                   {isSettingPin ? "Verifying..." : "Save New PIN"}
                 </Button>
               </div>
             </div>
           )}
         </DialogContent>
      </Dialog>

      {/* Change Password Modal placeholder */}
      <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
         <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl">
           <DialogHeader className="bg-gradient-to-r from-[#b32488] to-[#6b2c91] text-white p-4 m-0 shadow-sm flex-shrink-0">
             <DialogTitle className="text-center font-bold">Change Password</DialogTitle>
           </DialogHeader>
           <div className="p-6 space-y-4">
             <div>
               <Label>Current Password</Label>
               <Input type="password" placeholder="Enter current password" className="h-12 rounded-xl" />
             </div>
             <div>
               <Label>New Password</Label>
               <Input type="password" placeholder="Enter new password" className="h-12 rounded-xl" />
             </div>
             <div>
               <Label>Confirm New Password</Label>
               <Input type="password" placeholder="Confirm new password" className="h-12 rounded-xl" />
             </div>
             <div className="pt-4">
               <Button className="w-full bg-[#b32488] hover:bg-[#8f1d6d] h-14 rounded-full text-lg shadow-md" onClick={() => setIsChangingPassword(false)}>
                 Update Password
               </Button>
             </div>
           </div>
         </DialogContent>
      </Dialog>
    </div>
  );
}
