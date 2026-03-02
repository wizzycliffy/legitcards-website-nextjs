"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Upload,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Check,
  Image,
  X,
  Loader2,
  Receipt,
} from "lucide-react";
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
import { AppLayout } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAssets, fetchRates } from "@/store/slices/assetSlice";
import { startTrade } from "@/store/slices/tradeSlice";
import { useAuth } from "@/hooks/useAuth";

type Step = "select" | "details" | "review";

const BRAND_COLORS = [
  "from-orange-400 to-orange-600",
  "from-pink-400 to-pink-600",
  "from-blue-400 to-blue-600",
  "from-green-400 to-green-600",
  "from-blue-500 to-indigo-600",
  "from-rose-400 to-rose-600",
];

export default function SellGiftCard() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const {
    assets,
    rates,
    isLoading: assetsLoading,
  } = useAppSelector((state) => state.assets);
  const { isLoading: tradeLoading } = useAppSelector((state) => state.trades);

  const [currentStep, setCurrentStep] = useState<Step>("select");
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [selectedRate, setSelectedRate] = useState<any | null>(null);
  const [cardType, setCardType] = useState("");
  const [country, setCountry] = useState("");
  const [amount, setAmount] = useState("");
  const [cardCode, setCardCode] = useState("");
  const [cardPin, setCardPin] = useState("");
  const [comments, setComments] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [receiptImages, setReceiptImages] = useState<string[]>([]);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAssets(user?.userid));
    dispatch(fetchRates(user?.userid));
  }, [dispatch, user?.userid]);

  const steps = [
    { id: "select", label: "Select Card", icon: CreditCard },
    { id: "details", label: "Card Details", icon: Upload },
    { id: "review", label: "Review", icon: Check },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  // All rates that belong to the selected asset
  const assetRates = useMemo(() => {
    if (!selectedAsset) return [];
    return rates.filter(
      (r) => r.asset?._id === selectedAsset._id && r.rateActive !== false,
    );
  }, [rates, selectedAsset]);

  // Available countries – always the full list for the selected asset
  const availableCountries = useMemo(() => {
    return [...new Set(assetRates.map((r) => r.country))].sort();
  }, [assetRates]);

  // Available types – filtered by the selected country (country must be chosen first)
  const availableTypes = useMemo(() => {
    if (!country) return [];
    const pool = assetRates.filter((r) => r.country === country);
    return [...new Set(pool.map((r) => r.type))].sort();
  }, [assetRates, country]);

  // Resolve the matched rate whenever both type and country are set
  useEffect(() => {
    if (!cardType || !country) {
      setSelectedRate(null);
      return;
    }
    const match = assetRates.find(
      (r) => r.type === cardType && r.country === country,
    );
    setSelectedRate(match || null);
  }, [cardType, country, assetRates]);

  // "no receipt" types contain the word receipt but explicitly mean no receipt is needed.
  // Only trigger receipt upload when "receipt" appears WITHOUT the "no" prefix.
  const requiresReceipt = cardType
    ? /\breceipt\b/i.test(cardType) && !/\bno\s+receipt\b/i.test(cardType)
    : false;

  const calculatedAmount =
    selectedRate && amount ? Number(amount) * selectedRate.rate : 0;

  const amountPlaceholder = selectedRate
    ? `$${selectedRate.from} – $${selectedRate.to}`
    : "Enter card amount";


  // ---- Image handlers ----
  const readFiles = (
    files: FileList,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    existing: string[],
  ) => {
    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        if (newImages.length === files.length) {
          setter([...existing, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) readFiles(e.target.files, setUploadedImages, uploadedImages);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) readFiles(e.target.files, setReceiptImages, receiptImages);
  };

  const removeImage = (index: number) =>
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));

  const removeReceipt = (index: number) =>
    setReceiptImages(receiptImages.filter((_, i) => i !== index));

  // ---- Navigation ----
  const handleNext = () => {
    if (currentStep === "details") {
      if (!cardType || !country || !amount) {
        toast({ title: "Please fill all required fields", variant: "destructive" });
        return;
      }
      if (uploadedImages.length === 0) {
        toast({ title: "Please upload at least one card image", variant: "destructive" });
        return;
      }
      if (requiresReceipt && receiptImages.length === 0) {
        toast({ title: "Please upload your receipt", variant: "destructive" });
        return;
      }
    }
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id as Step);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id as Step);
    }
  };

  const handleSubmit = async () => {
    if (!user?.userid) return;
    try {
      const allImages = [...uploadedImages, ...receiptImages];
      await dispatch(
        startTrade({
          id: user.userid,
          data: [
            {
              rateSpec: selectedRate?._id,
              images: allImages,
              userAmount: Number(amount),
              quantity: 1,
              comments,
              cardType,
            },
          ],
        }),
      ).unwrap();

      toast({
        title: "Trade Submitted!",
        description:
          "Your trade has been submitted for review. You'll be notified once it's processed.",
      });

      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  // ---- Upload section reused in step 2 and review ----
  const UploadSection = ({
    label,
    description,
    images,
    onUpload,
    onRemove,
    inputId,
  }: {
    label: string;
    description: string;
    images: string[];
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: (i: number) => void;
    inputId: string;
  }) => (
    <div className="space-y-3">
      <Label>{label}</Label>
      <p className="text-sm text-muted-foreground">{description}</p>
      <label htmlFor={inputId} className="block cursor-pointer">
        <div className="border-2 border-dashed border-primary/30 rounded-2xl p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-all">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <Image className="w-6 h-6 text-primary" />
          </div>
          <p className="font-medium text-sm mb-1">Click to upload or drag & drop</p>
          <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
        </div>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          onChange={onUpload}
          className="hidden"
        />
      </label>
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-xl border border-border"
              />
              <button
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-80px)] gradient-hero py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Sell Gift Card
            </h1>
            <p className="text-muted-foreground">
              Convert your gift cards to cash in just a few steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all",
                        index <= currentStepIndex
                          ? "gradient-primary text-primary-foreground shadow-glow"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {index < currentStepIndex ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs mt-2 hidden md:block",
                        index <= currentStepIndex
                          ? "text-primary font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-16 md:w-32 h-0.5 mx-2",
                        index < currentStepIndex ? "bg-primary" : "bg-muted",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl border border-border shadow-card p-6 md:p-8">

              {/* ── Step 1: Select Card ── */}
              {currentStep === "select" && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-display font-semibold mb-6">
                    Select Gift Card Brand
                  </h2>
                  {assetsLoading ? (
                    <div className="flex justify-center p-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[...assets]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((asset) => {
                          const hasRates = rates.some(
                            (r) => r.asset?._id === asset._id,
                          );
                          return (
                            <button
                              key={asset._id}
                              onClick={() => {
                                setSelectedAsset(asset);
                                setSelectedRate(null);
                                setCardType("");
                                setCountry("");
                                setAmount("");
                                setUploadedImages([]);
                                setReceiptImages([]);
                                if (hasRates) {
                                  setTimeout(
                                    () => setCurrentStep("details"),
                                    300,
                                  );
                                } else {
                                  toast({
                                    title: "No rates available",
                                    description:
                                      "This card has no active rates at the moment.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              className={cn(
                                "flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 text-left",
                                selectedAsset?._id === asset._id
                                  ? "border-primary bg-primary/5 shadow-glow"
                                  : "border-border hover:border-primary/50",
                              )}
                            >
                              <div className="w-24 h-12 rounded-xl flex items-center justify-center mb-3">
                                {asset.images?.[0] ? (
                                  <img
                                    src={asset.images[0]}
                                    alt={asset.name}
                                    className="w-32 h-12 object-cover rounded-md"
                                  />
                                ) : (
                                  <span className="text-xl font-bold text-muted-foreground">
                                    {asset.name.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div className="font-medium text-center text-sm">
                                {asset.name.toUpperCase()}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 2: Card Details + Upload ── */}
              {currentStep === "details" && (
                <div className="animate-fade-in space-y-6">
                  <h2 className="text-xl font-display font-semibold mb-2">
                    Card Details
                  </h2>

                  {/* Selected asset badge */}
                  {selectedAsset && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                      {selectedAsset.images?.[0] ? (
                        <img
                          src={selectedAsset.images[0]}
                          alt={selectedAsset.name}
                          className="w-10 h-10 object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {selectedAsset.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-semibold">
                        {selectedAsset.name.toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Country – must be selected first */}
                    <div className="space-y-2">
                      <Label>Country *</Label>
                      <Select
                        value={country}
                        onValueChange={(val) => {
                          setCountry(val);
                          setCardType(""); // reset card type when country changes
                        }}
                      >
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCountries.length > 0 ? (
                            availableCountries.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="__none" disabled>
                              No countries available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Card Type – disabled until country is selected */}
                    <div className="space-y-2">
                      <Label className={cn(!country && "text-muted-foreground")}>Card Type *</Label>
                      <Select
                        value={cardType}
                        onValueChange={(val) => setCardType(val)}
                        disabled={!country}
                      >
                        <SelectTrigger className={cn("h-12 rounded-xl", !country && "opacity-50 cursor-not-allowed")}>
                          <SelectValue placeholder={country ? "Select card type" : "Select country first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTypes.length > 0 ? (
                            availableTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="__none" disabled>
                              No types available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label>
                      Card Amount{" "}
                      {selectedRate && (
                        <span className="text-xs text-muted-foreground font-normal">
                          (Acceptable range: ${selectedRate.from} – ${selectedRate.to})
                        </span>
                      )}{" "}
                      *
                    </Label>
                    <Input
                      type="number"
                      placeholder={amountPlaceholder}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>

                  {/* Card Code for e-code types */}
                  {cardType.toLowerCase().includes("e-code") && (
                    <>
                      <div className="space-y-2">
                        <Label>Card Code *</Label>
                        <Input
                          type="text"
                          placeholder="Enter gift card code"
                          value={cardCode}
                          onChange={(e) => setCardCode(e.target.value)}
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Card PIN (if applicable)</Label>
                        <Input
                          type="text"
                          placeholder="Enter PIN"
                          value={cardPin}
                          onChange={(e) => setCardPin(e.target.value)}
                          className="h-12 rounded-xl"
                        />
                      </div>
                    </>
                  )}

                  {/* Calculated payout */}
                  {amount && selectedRate && (
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">You will receive:</span>
                        <span className="text-2xl font-display font-bold gradient-text">
                          ₦{calculatedAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <hr className="border-border" />

                  {/* ── Receipt Upload (when type contains "receipt") ── */}
                  {requiresReceipt && (
                    <UploadSection
                      label="Receipt *"
                      description="Upload a clear photo of your receipt"
                      images={receiptImages}
                      onUpload={handleReceiptUpload}
                      onRemove={removeReceipt}
                      inputId="receipt-upload"
                    />
                  )}

                  {/* ── Card Image Upload ── */}
                  <UploadSection
                    label={requiresReceipt ? "Card Images (optional)" : "Card Images"}
                    description="Upload clear photos of the front and back of your gift card"
                    images={uploadedImages}
                    onUpload={handleImageUpload}
                    onRemove={removeImage}
                    inputId="card-upload"
                  />
                </div>
              )}

              {/* ── Step 3: Review ── */}
              {currentStep === "review" && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-display font-semibold mb-6">
                    Review Your Trade
                  </h2>

                  <div className="space-y-4">
                    {/* Card Info */}
                    <div className="p-4 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={cn(
                            "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center",
                            BRAND_COLORS[
                              assets.findIndex(
                                (a) => a._id === selectedAsset?._id,
                              ) % BRAND_COLORS.length
                            ],
                          )}
                        >
                          {selectedAsset?.images?.[0] ? (
                            <img
                              src={selectedAsset.images[0]}
                              alt={selectedAsset.name}
                              className="w-10 h-10 object-contain"
                            />
                          ) : (
                            <span className="text-xl font-bold text-white">
                              {selectedAsset?.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">
                            {selectedAsset?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {cardType}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Country:</span>
                          <div className="font-medium">{country}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <div className="font-medium">${amount}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rate:</span>
                          <div className="font-medium">₦{selectedRate?.rate}/$</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Processing Time:</span>
                          <div className="font-medium">
                            {selectedRate?.processing_time
                              ? `${selectedRate.processing_time} min`
                              : "—"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Images Preview */}
                    {uploadedImages.length > 0 && (
                      <div>
                        <Label className="mb-2 block">Card Images</Label>
                        <div className="flex gap-2 flex-wrap">
                          {uploadedImages.map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt={`Card ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border border-border"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Receipt Images Preview */}
                    {receiptImages.length > 0 && (
                      <div>
                        <Label className="mb-2 block">Receipt Images</Label>
                        <div className="flex gap-2 flex-wrap">
                          {receiptImages.map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt={`Receipt ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border border-border"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Total */}
                    <div className="p-5 rounded-xl gradient-primary text-primary-foreground">
                      <div className="flex items-center justify-between">
                        <span className="text-primary-foreground/80">
                          You will receive:
                        </span>
                        <span className="text-3xl font-display font-bold">
                          ₦{calculatedAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Navigation ── */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                {currentStepIndex > 0 ? (
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {/* No footer button on step 1; step 2 has Continue; step 3 has Submit */}
                {currentStep === "select" ? (
                  <div />
                ) : currentStep === "review" ? (
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={tradeLoading}
                  >
                    {tradeLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Trade
                        <Check className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button variant="gradient" size="lg" onClick={handleNext}>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
