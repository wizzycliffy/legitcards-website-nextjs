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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWallet, fetchBanks, initiateWithdrawal } from "@/store/slices/walletSlice";
import { AppLayout } from "@/components/layout/AppLayout";

export default function Withdraw() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { wallet, banks, isLoading } = useAppSelector((state) => state.wallet);

  const [selectedBank, setSelectedBank] = useState("");
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    dispatch(fetchWallet(user.userid));
    dispatch(fetchBanks());
  }, [dispatch]);

  // Pre-fill account details from user profile
  useEffect(() => {
    if (user) {
      setAccountNumber(user.accountNumber || "");
      setAccountName(user.accountName || "");
    }
  }, [user]);

  const handleWithdraw = async () => {
    if (!selectedBank || !amount || !accountNumber || !accountName) {
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
        })
      ).unwrap();

      toast({
        title: "Withdrawal Initiated",
        description: "Your withdrawal request has been submitted successfully",
      });

      // Reset form
      setAmount("");
      setSelectedBank("");

      // Refresh wallet balance
      dispatch(fetchWallet(user.userid));
    } catch (error: any) {
      toast({
        title: "Withdrawal Failed",
        description: error || "Failed to initiate withdrawal",
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
            <div className="space-y-2">
              <Label htmlFor="bank">Select Bank</Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
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
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                type="text"
                placeholder="John Doe"
                className="h-12 rounded-xl"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>

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
              onClick={handleWithdraw}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Withdraw Funds"
              )}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
