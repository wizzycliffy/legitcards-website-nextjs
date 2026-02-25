'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Filter, CheckCircle, Clock, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTrades } from "@/store/slices/tradeSlice";
import { fetchRates } from "@/store/slices/assetSlice";
import { fetchCryptoTrades } from "@/store/slices/cryptoSlice";
import { cn } from "@/lib/utils";

export default function TradeHistory() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { trades, isLoading } = useAppSelector((state) => state.trades);
  const { cryptoTrades, isLoading: cryptoLoading } = useAppSelector((state) => state.crypto);

  console.log({cryptoTrades}, {trades});
  const { rates } = useAppSelector((state) => state.assets); // To get asset names

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0); 
  const [category, setCategory] = useState<"GIFTCARD" | "CRYPTO">("GIFTCARD");

  useEffect(() => {
    if (user?.userid) {
      dispatch(fetchRates(user.userid));
      loadTrades();
    }
  }, [dispatch, user?.userid, filterStatus, page, category,]);

  const loadTrades = () => {
    if (!user?.userid) return;
    if (category === "GIFTCARD") {
        dispatch(fetchTrades({
          id: user.userid,
          start: page * 20,
          filter: { status: filterStatus }
        }));
    } else {
        dispatch(fetchCryptoTrades({
            id: user.userid,
            filter: { status: filterStatus },
            sort: "desc",
            start: (page * 20).toString()
        }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-success/10 text-success border-success/20";
      case "PENDING": return "bg-warning/10 text-warning border-warning/20";
      case "PROCESSING": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "DECLINED": return "bg-destructive/10 text-destructive border-destructive/20";
      case "CANCELLED": return "bg-muted text-muted-foreground border-border"; 
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED": return <CheckCircle className="w-4 h-4" />;
      case "PENDING": return <Clock className="w-4 h-4" />;
      case "PROCESSING": return <Loader2 className="w-4 h-4 animate-spin" />;
      case "DECLINED": return <XCircle className="w-4 h-4" />;
      case "ATTENTION": return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  // Enhance trades with asset info (now directly available)
  const currentTrades = category === "GIFTCARD" ? trades : cryptoTrades;
  const isHistoryLoading = category === "GIFTCARD" ? isLoading : cryptoLoading;

  const enrichedTrades = currentTrades.filter(trade => 
    trade.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trade._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-display font-bold">Trade History</h1>
              <p className="text-muted-foreground">View and track all your trades</p>
            </div>
            
            <div className="flex bg-muted p-1 rounded-xl">
              <button
                onClick={() => { setCategory("GIFTCARD"); setPage(0); }}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-medium transition-all",
                  category === "GIFTCARD" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Gift Cards
              </button>
              <button
                onClick={() => { setCategory("CRYPTO"); setPage(0); }}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-medium transition-all",
                  category === "CRYPTO" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Crypto
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border border-border p-4 mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by asset name or ID..." 
                className="pl-9 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px] bg-background">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Trades</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="DECLINED">Declined</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trades List */}
          {isLoading && trades.length === 0 ? (
             <div className="flex justify-center items-center py-20">
               <Loader2 className="w-8 h-8 animate-spin text-primary" />
             </div>
          ) : enrichedTrades.length > 0 ? (
            <div className="space-y-4">
              {enrichedTrades.map((trade) => (
                <div 
                  key={trade._id} 
                  className="bg-card rounded-xl border border-border p-4 md:p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                         {category === "GIFTCARD" ? (
                           (Array.isArray(trade.assetImage) && trade.assetImage.length > 0) ? (
                             <img src={trade.assetImage[0]} alt="Trade" className="w-full h-full object-cover" />
                           ) : (
                             <span className="font-bold text-lg">{trade.assetName.charAt(0)}</span>
                           )
                         ) : (
                           category === "CRYPTO" && (trade as any).assetImage && (trade as any).assetImage.length > 0 ? (
                             <img src={(trade as any).assetImage[0]} alt="Trade" className="w-full h-full object-cover" />
                           ) : (
                             <span className="font-bold text-lg">{trade.assetName.charAt(0)}</span>
                           )
                         )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{trade.assetName}</h3>
                          {category === "GIFTCARD" && (
                            <Badge variant="outline" className="text-xs">
                              {(trade as any).quantity} card{(trade as any).quantity > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                          <span>Amount: <span className="text-foreground font-medium">${trade.userAmount}</span></span>
                          <span>Rate: <span className="text-foreground font-medium">₦{trade.rate}/{category === "GIFTCARD" ? "$" : (trade as any).assetName}</span></span>
                          <span>Date: {new Date(trade.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-2xl font-display font-bold gradient-text">
                        ₦{trade.cost?.toLocaleString() || (trade.userAmount * trade.rate).toLocaleString()}
                      </div>
                      <Badge className={cn("flex items-center gap-1", getStatusColor(trade.status))}>
                        {getStatusIcon(trade.status)}
                        {trade.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Expandable details could go here */}
                  {trade.status === "DECLINED" && (
                    <div className="mt-4 pt-4 border-t border-border text-sm text-destructive bg-destructive/5 p-3 rounded-lg">
                      <strong>Reason for decline:</strong> Please contact support for more details.
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-xl border border-border border-dashed">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No trades found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || filterStatus !== "ALL" 
                  ? "Try adjusting your filters or search terms" 
                  : "You haven't made any trades yet"}
              </p>
              {(searchTerm || filterStatus !== "ALL") && (
                <Button variant="outline" onClick={() => {setSearchTerm(""); setFilterStatus("ALL")}}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
          
          {/* Pagination Load More */}
           {/* Simple implementation: if we got exactly 20 items (or whatever fetch size is), show Load More */}
           {/* Since we don't have total count, we can guess if we should show load more */}
           {trades.length > 0 && trades.length % 20 === 0 && (
             <div className="mt-8 text-center bg-transparent">
               <Button 
                variant="outline" 
                onClick={() => setPage(p => p + 1)}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Load More
               </Button>
             </div>
           )}

        </div>
      </div>
    </AppLayout>
  );
}
