'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bitcoin,
  Wallet,
  ArrowLeft,
  Check,
  Copy,
  Loader2,
  Upload,
  X,
  Info,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppLayout } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCryptoCoins,
  // fetchCryptoNetworks,
  startCryptoTrade,
  fetchCryptoRate,
  resetCurrentTrade,
  clearNetworks,
} from "@/store/slices/cryptoSlice";

const HARDCODED_ADDRESSES: Record<string, string> = {
  btc: "1LCsWQFKv5NUxkNi5hHFKFEWEz8oeGzE9Y",
  eth: "0x31CbBbb58bCa0E091B99Ae9427E777819ff790D8",
  usdt_trc20: "TYuHyss71JMVfvuv1v7d5tohqaNfimkmgd",
  usdt_erc20: "0x31CbBbb58bCa0E091B99Ae9427E777819ff790D8",
  usdt_bep20: "0x31CbBbb58bCa0E091B99Ae9427E777819ff790D8",
};

const HARDCODED_NETWORKS = [
  { name: "TRC20 (Tron)", _id: "trc20" },
  { name: "ERC20 (Ethereum)", _id: "erc20" },
  { name: "BEP20 (BSC)", _id: "bep20" },
];
import { useAuth } from "@/hooks/useAuth";

// Steps:
// 1. select   — pick a coin (auto-advance)
// 2. wallet   — network selection (if USDT) + wallet address + QR code + amount input
// 3. upload   — proof of transaction
// 4. success  — confirmation screen
type Step = "select" | "wallet" | "upload" | "success";

const COIN_ICONS: Record<string, React.ReactNode> = {
  btc: <Bitcoin className="w-6 h-6" />,
  eth: <Wallet className="w-6 h-6" />,
  usdt: <span className="text-sm font-bold">₮</span>,
};

const COIN_COLORS: Record<string, string> = {
  btc: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  eth: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  usdt: "bg-green-500/10 text-green-500 border-green-500/20",
};

const STEP_LABELS: Record<Step, string> = {
  select: "Select Coin",
  wallet: "Send Crypto",
  upload: "Upload Proof",
  success: "Done",
};

export default function SellCrypto() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const {
    coins,
    networks,
    currentTrade,
    cryptoRate,
    isLoading,
    networksLoading,
    rateLoading,
  } = useAppSelector((state) => state.crypto);

  const [currentStep, setCurrentStep] = useState<Step>("select");
  const [selectedCoin, setSelectedCoin] = useState<any | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<any | null>(null);
  const [amount, setAmount] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Determine the USDT coin id from fetched list
  const isUsdt = selectedCoin?.name?.toLowerCase() === "usdt";

  // ── Steps to display in the progress bar ──
  const visibleSteps: Step[] = ["select", "wallet", "upload", "success"];

  const currentStepIndex = visibleSteps.indexOf(currentStep);

  useEffect(() => {
    dispatch(fetchCryptoCoins());
    return () => {
      dispatch(resetCurrentTrade());
      dispatch(clearNetworks());
    };
  }, [dispatch]);

  // When a USDT coin is selected, fetch its networks
  useEffect(() => {
    if (selectedCoin && isUsdt) {
      // dispatch(fetchCryptoNetworks(selectedCoin._id));
    }
    console.log({selectedCoin})
    console.log({user})

    // Fetch appropriate rate when coin or network changes
    if (selectedCoin && user?.userid) {
      const coinNameNormalized = selectedCoin.name.toLowerCase();
      let rateName = selectedCoin.name;

      if (coinNameNormalized === "usdt") {
        if (selectedNetwork) {
          rateName = `usdt_${selectedNetwork._id.toLowerCase()}`;
        } else {
          return;
        }
      }
      console.log({rateName})

      dispatch(fetchCryptoRate({ coinName: rateName, userId: user.userid }));
    }
  }, [selectedCoin, isUsdt, selectedNetwork, user?.userid, dispatch]);

  // Default network for USDT
  useEffect(() => {
    if (isUsdt && !selectedNetwork && currentStep === "wallet") {
      const defaultNet = networks.length > 0 ? networks[0] : HARDCODED_NETWORKS[0];
      setSelectedNetwork(defaultNet);
    }
  }, [isUsdt, selectedNetwork, currentStep, networks]);

  // ── Image helpers ──────────────────────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        if (newImages.length === files.length) {
          setUploadedImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) =>
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Address copied!" });
  };

  // ── Submit trade ──────────────────────────────────────────────────────────
  const handleSubmitTrade = async () => {
    if (!user?.userid) {
      toast({ title: "Not logged in", variant: "destructive" });
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    if (uploadedImages.length === 0) {
      toast({ title: "Please upload proof of transaction", variant: "destructive" });
      return;
    }
    try {
      const rateSpec = isUsdt && selectedNetwork
        ? selectedNetwork._id
        : selectedCoin._id;
      await dispatch(
        startCryptoTrade({
          id: user.userid,
          data: [{ rateSpec, userAmount: Number(amount), images: uploadedImages }],
        }),
      ).unwrap();
      setCurrentStep("success");
      toast({ title: "Trade submitted successfully!" });
    } catch (err: any) {
      toast({ title: err || "Failed to submit trade", variant: "destructive" });
    }
  };

  // ── Wallet address logic ───────────────────────────────────────────────────
  const getWalletAddress = () => {
    if (!selectedCoin) return "Loading...";
    const coinKey = selectedCoin.name.toLowerCase();
    
    if (coinKey === "btc") return HARDCODED_ADDRESSES.btc;
    if (coinKey === "eth") return HARDCODED_ADDRESSES.eth;
    if (coinKey === "usdt" && selectedNetwork) {
      // Extract trc20, erc20, or bep20 from the name or _id
      const netKey = `usdt_${selectedNetwork._id.toLowerCase()}`;
      return HARDCODED_ADDRESSES[netKey] || HARDCODED_ADDRESSES.usdt_trc20;
    }
    return "Loading address...";
  };

  const walletAddress = getWalletAddress();
  
  const parsedAmount = Number(amount) || 0;
  
  let activeRateValue = 0;
  let minAmount = 0;

  if (Array.isArray(cryptoRate) && cryptoRate.length > 0) {
    minAmount = cryptoRate[0].from;
    
    // Find the applicable rate based on amount
    const matchedRateObj = cryptoRate.find((r: any) => {
      if (r.range_above) {
        return parsedAmount >= r.from;
      }
      return parsedAmount >= r.from && parsedAmount <= r.to;
    });

    if (matchedRateObj) {
      activeRateValue = matchedRateObj.rate;
    } else {
      activeRateValue = cryptoRate[0].rate;
    }
  }

  const nairaAmount = amount && activeRateValue ? (parsedAmount * activeRateValue).toLocaleString() : "0";

  // ── QR code URL (using free qr.io service) ───────────────────────────────
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(walletAddress)}`;

  // ── Step renderers ────────────────────────────────────────────────────────
  const renderSelect = () => (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-display font-semibold">Select a Coin</h2>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coins.map((coin) => {
            const key = coin.name.toLowerCase();
            return (
              <button
                key={coin._id}
                onClick={() => {
                  setSelectedCoin(coin);
                  setSelectedNetwork(null);
                  setAmount("");
                  // Go to wallet step directly
                  setTimeout(() => {
                    setCurrentStep("wallet");
                  }, 300);
                }}
                className={cn(
                  "p-6 rounded-2xl border-2 transition-all text-left group",
                  selectedCoin?._id === coin._id
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border bg-card hover:border-primary/50",
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110",
                      COIN_COLORS[key] || "bg-muted text-muted-foreground border-border",
                    )}
                  >
                    {COIN_ICONS[key] ?? <Wallet className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg uppercase">{coin.name}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {key === "btc" ? "Bitcoin" : key === "eth" ? "Ethereum" : "Tether USD"}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderWallet = () => {
    const coinName = selectedCoin?.name?.toUpperCase() ?? "";
    const networkLabel = isUsdt && selectedNetwork
      ? ` (${selectedNetwork.name || selectedNetwork.symbol})`
      : "";

    return (
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        {/* Network Selection for USDT */}
        {isUsdt && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Select Network</Label>
            <div className="grid grid-cols-3 gap-2">
              {(networks.length > 0 ? networks : HARDCODED_NETWORKS).map((net) => (
                <button
                  key={net._id}
                  onClick={() => setSelectedNetwork(net)}
                  className={cn(
                    "py-2 px-3 rounded-xl border text-xs font-medium transition-all",
                    selectedNetwork?._id === net._id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card hover:border-primary/50",
                  )}
                >
                  {net.name?.split(" ")[0] || (net as any).symbol}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Address card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-display font-bold mb-1">
            Send {coinName}{networkLabel}
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Send your crypto to the address below and enter the amount you sent.
          </p>

          {/* QR code */}
          <div className="flex justify-center mb-5">
            <div className="p-3 rounded-2xl border border-border bg-white">
              <img
                key={walletAddress}
                src={qrUrl}
                alt="Wallet QR Code"
                className="w-44 h-44"
              />
            </div>
          </div>

          {/* Address */}
          <div className="relative bg-muted rounded-xl p-4 mb-4">
            <Label className="text-xs text-muted-foreground uppercase mb-1 block">
              Wallet Address
            </Label>
            <p className="font-mono text-sm break-all pr-10">{walletAddress}</p>
            <button
              onClick={() => copyToClipboard(walletAddress)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-border transition-colors"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="amount">Amount Sent (USD)</Label>
              {minAmount > 0 && (
                <span className="text-xs text-muted-foreground">Min Amount: ${minAmount}</span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                placeholder={minAmount ? `Min: ${minAmount}` : "0.00"}
                className="pl-8 h-12"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 rounded-xl bg-secondary/20 border border-border">
                <span className="text-sm text-muted-foreground">Current Rate</span>
                <div className="font-display font-bold">₦{activeRateValue || "0"}/$</div>
              </div>
              
              <div className="flex justify-between items-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                <span className="text-sm text-muted-foreground">You'll Receive (estimated)</span>
                <div className="text-right">
                  {rateLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary inline" />
                  ) : (
                    <div className="font-display font-bold text-primary">₦{nairaAmount}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Only send {coinName} to this address. Sending any other asset may result in permanent loss.
            </p>
          </div>
        </div>

        <Button
          variant="gradient"
          size="lg"
          className="w-full"
          onClick={() => {
            if (!amount || Number(amount) <= 0) {
              toast({ title: "Enter the amount you sent", variant: "destructive" });
              return;
            }
            setCurrentStep("upload");
          }}
        >
          I've Sent the Crypto
        </Button>
      </div>
    );
  };

  const renderUpload = () => (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
        <h2 className="text-lg font-display font-bold mb-1">Upload Proof of Transaction</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Upload a screenshot showing the transaction hash, amount, and recipient address.
        </p>

        {/* Upload area */}
        <label htmlFor="proof-upload" className="block cursor-pointer mb-4">
          <div className="border-2 border-dashed border-primary/30 rounded-2xl p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-all">
            <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-medium text-sm">Click to upload or drag & drop</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
          </div>
          <input
            id="proof-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>

        {/* Previews */}
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {uploadedImages.map((img, index) => (
              <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-border">
                <img src={img} alt={`Proof ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        variant="gradient"
        size="lg"
        className="w-full"
        onClick={handleSubmitTrade}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Check className="w-4 h-4 mr-2" />
            Submit Trade
          </>
        )}
      </Button>
    </div>
  );

  const renderSuccess = () => (
    <div className="max-w-md mx-auto animate-fade-in">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-card text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-xl font-display font-bold mb-2">Trade Submitted!</h2>
        <p className="text-muted-foreground mb-6">
          Your trade has been received and is under review. You'll be notified once processed.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button variant="gradient" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={() => router.push("/trade-history")}>
            View History
          </Button>
        </div>
      </div>
    </div>
  );

  const stepContent: Record<Step, () => React.ReactNode> = {
    select: renderSelect,
    wallet: renderWallet,
    upload: renderUpload,
    success: renderSuccess,
  };

  // Back handler
  const handleBack = () => {
    if (currentStep === "wallet") setCurrentStep("select");
    else if (currentStep === "upload") setCurrentStep("wallet");
    else router.push("/dashboard");
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-1">Sell Crypto</h1>
            <p className="text-muted-foreground text-sm">
              Convert your crypto to Naira — fast and secure
            </p>
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {visibleSteps.map((step) => (
              <div
                key={step}
                className={cn(
                  "rounded-full transition-all",
                  step === currentStep
                    ? "w-6 h-2.5 bg-primary"
                    : visibleSteps.indexOf(step) < currentStepIndex
                    ? "w-2.5 h-2.5 bg-primary/50"
                    : "w-2.5 h-2.5 bg-muted",
                )}
              />
            ))}
          </div>
        </div>

        {/* Step label */}
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
          Step {currentStepIndex + 1} of {visibleSteps.length} — {STEP_LABELS[currentStep]}
        </p>

        {/* Content */}
        <div className="mb-10">{stepContent[currentStep]()}</div>

        {/* Back navigation (hidden on select and success) */}
        {currentStep !== "select" && currentStep !== "success" && (
          <div className="pt-6 border-t border-border">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
