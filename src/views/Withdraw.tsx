'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wallet, Building2, CreditCard, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWallet, fetchBanks, initiateWithdrawal, validateBankAccount, fetchBankAccounts } from "@/store/slices/walletSlice";
import { AppLayout } from "@/components/layout/AppLayout";
import { cn } from "@/lib/utils";

export default function Withdraw() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { wallet, banks, bankAccounts, isLoading } = useAppSelector((state) => state.wallet);

  const [selectedBank, setSelectedBank] = useState("");
  const [selectedBankName, setSelectedBankName] = useState("");
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  
  // Validation and Submission flow states
  const [isValidating, setIsValidating] = useState(false);
  const [currentStep, setCurrentStep] = useState<"FORM" | "PIN">("FORM");
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (!user) return;
    dispatch(fetchBankAccounts(user.userid));
    dispatch(fetchWallet(user.userid));
    dispatch(fetchBanks());
  }, [dispatch, user]);

  // Pre-fill account details from user profile
  useEffect(() => {
    if (user) {
      setAccountNumber(user.accountNumber || "");
      setAccountName(user.accountName || "");
    }
  }, [user]);

  const handleProceed = async () => {
    if (!selectedBank || !amount || !accountNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const withdrawAmount = Number(amount);
    if (withdrawAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (wallet && withdrawAmount > wallet.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    try {
      // 1. Validate the account number first
      const trackingReference = `${Date.now()}${Math.random().toString(36).substring(7)}`;
      const validationResult = await dispatch(
        validateBankAccount({
          bankCode: selectedBank,
          accountNumber,
          trackingReference,
        })
      ).unwrap();

      setAccountName(validationResult.bankAccountName || "");

      // 2. Move to PIN verification step
      setCurrentStep("PIN");
      
    } catch (error: any) {
      toast({
        title: "Account Validation Failed",
        description: typeof error === 'string' ? error : error?.message || "Could not verify this account at the selected bank.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleWithdrawSubmit = async () => {
    if (!pin || pin.length < 4) {
      toast({
        title: "PIN Required",
        description: "Please enter your withdrawal PIN",
        variant: "destructive",
      });
      return;
    }

    const withdrawAmount = Number(amount);
    const selectedBankData = banks.find((b) => b.code === selectedBank);
    if (!selectedBankData || !user) return;

    try {
      await dispatch(
        initiateWithdrawal({
          bankCode: selectedBank,
          bankName: selectedBankData.name,
          bankAccountNumber: accountNumber,
          amount: withdrawAmount,
          email: user.email,
          user_id: user.userid || user.id,
          bankAccountName: accountName,
          nameEnquiryId: "NA",
          senderName: accountName,
          id: user.userid || user.id,
          // TODO: Ensure backend uses the passsed PIN if required by your API implementation
          pin: pin 
        })
      ).unwrap();

      toast({
        title: "Withdrawal Initiated",
        description: "Your withdrawal request has been submitted successfully",
      });

      // Reset form
      setAmount("");
      setSelectedBank("");
      setSelectedBankName("");
      setAccountNumber("");
      setAccountName("");
      setPin("");
      setCurrentStep("FORM");

      // Refresh wallet balance
      dispatch(fetchWallet(user.userid));
    } catch (error: any) {
      toast({
        title: "Withdrawal Failed",
        description: typeof error === 'string' ? error : error?.message || "Failed to initiate withdrawal",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-display font-bold mb-2">Withdraw Funds</h1>
            <p className="text-muted-foreground">Transfer your balance to your bank account</p>
          </div>

          {/* Wallet Balance Card */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-display font-bold">
                  ₦{wallet?.balance?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </div>

          {/* Withdrawal Form */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 space-y-6">
            
            {/* NEW: Saved Bank Accounts */}
            {bankAccounts && bankAccounts.length > 0 && (
              <div className="space-y-3 mb-2">
                <Label>Saved Bank Accounts</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bankAccounts.map((account) => (
                    <div 
                      key={account._id}
                      onClick={() => {
                        const matchedBank = banks.find(b => b.name.toLowerCase() === account.bankName.toLowerCase() || b.code === account.bankCode);
                        if (matchedBank) {
                          setSelectedBank(matchedBank.code);
                          setSelectedBankName(matchedBank.name);
                        }
                        setAccountNumber(account.accountNumber);
                        setAccountName(account.accountName);
                      }}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group",
                        accountNumber === account.accountNumber 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50 bg-secondary/10"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{account.bankName}</p>
                          <p className="text-xs text-muted-foreground">{account.accountNumber}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground uppercase">Or enter new details</span>
                  <div className="flex-grow border-t border-border"></div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="bank">Select Bank</Label>
              <Select 
                value={selectedBank} 
                onValueChange={(val) => {
                  setSelectedBank(val);
                  const bank = banks.find(b => b.code === val);
                  if (bank) {
                     setSelectedBankName(bank.name);
                     setAccountName(""); // resets validation name if bank changes
                  }
                }}
              >
                <SelectTrigger id="bank" className="h-12 rounded-xl">
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
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                type="text"
                placeholder="0000000000"
                className="h-12 rounded-xl"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                  setAccountName(""); // resets validation name if number changes
                }}
              />
            </div>

            {/* Account Name is now verified by API, so we show it read-only if verification has already happened optionally*/}
            {accountName && (
              <div className="space-y-2">
                <Label>Verified Account Name</Label>
                <div className="p-3 bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-xl">
                  <p className="font-semibold text-green-800 dark:text-green-300 uppercase">{accountName}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="h-12 rounded-xl"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-info/5 border border-info/20">
              <AlertCircle className="w-5 h-5 text-info mt-0.5 shrink-0" />
              <p className="text-xs text-info/80">
                Withdrawals are processed within 24 hours. Make sure your account details are correct to avoid delays.
              </p>
            </div>

            <Button
              className="w-full h-12"
              onClick={handleProceed}
              disabled={isValidating || !selectedBank || !accountNumber || !amount}
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Verify & Proceed"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* PIN Verification Modal */}
      <Dialog open={currentStep === "PIN"} onOpenChange={(open) => !open && setCurrentStep("FORM")}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="bg-gradient-to-r from-[#b32488] to-[#6b2c91] text-white p-4 m-0 shadow-sm flex-shrink-0">
            <DialogTitle className="text-center font-bold">Confirm Withdrawal</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-6">
            <div className="bg-muted/50 p-4 rounded-xl space-y-2 border border-border">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold text-foreground">₦{Number(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Bank:</span>
                <span className="font-bold text-foreground">{selectedBankName}</span>
              </div>
              <div className="flex justify-between items-start text-sm">
                <span className="text-muted-foreground">Account:</span>
                <div className="text-right">
                  <span className="font-bold text-foreground block">{accountNumber}</span>
                  <span className="text-xs text-muted-foreground uppercase">{accountName}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Withdrawal PIN</Label>
                <Input 
                  type="password" 
                  placeholder="****" 
                  maxLength={4} 
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="h-14 text-center text-2xl tracking-[0.5em] rounded-xl mt-2" 
                />
              </div>
              <Button 
                className="w-full bg-[#b32488] hover:bg-[#8f1d6d] h-14 rounded-full text-lg mt-4 shadow-md" 
                onClick={handleWithdrawSubmit}
                disabled={isLoading || pin.length < 4}
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                ) : (
                  "Confirm Withdrawal"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </AppLayout>
  );
}
