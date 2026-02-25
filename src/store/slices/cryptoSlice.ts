import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface CryptoCoin {
  _id: string;
  name: string;
  symbol?: string;
  images?: string[];
}

export interface CryptoNetwork {
  _id: string;
  name: string;
  symbol?: string;
  asset?: string;
}

export interface CryptoRateRange {
  from: number;
  to: number;
  rate: number;
  _id: string;
  range_above: boolean;
  asset?: any;
}

export interface CryptoTrade {
  _id: string;
  assetName: string;
  assetImage: string[];
  assetId: string;
  images: string[];
  status: string;
  createdAt: number;
  rate: number;
  userAmount: number;
  actualAmount: number;
  cost: number;
  rateInfo: {
    _id: string;
    rate: number;
    asset: string;
    currency: string;
  };
  dropped: boolean;
  image_prove: string[];
}

interface CryptoState {
  coins: CryptoCoin[];
  networks: CryptoNetwork[];
  cryptoTrades: CryptoTrade[];
  currentTrade: any | null;
  cryptoRate: CryptoRateRange[] | null;
  isLoading: boolean;
  networksLoading: boolean;
  rateLoading: boolean;
  error: string | null;
}

const initialState: CryptoState = {
  coins: [],
  networks: [],
  cryptoTrades: [],
  currentTrade: null,
  cryptoRate: null,
  isLoading: false,
  networksLoading: false,
  rateLoading: false,
  error: null,
};

const BASE_URL = 'https://legitcards-api.onrender.com/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// ── Fetch all crypto coins ──────────────────────────────────────────────────
export const fetchCryptoCoins = createAsyncThunk(
  'crypto/fetchCoins',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/crypto/users/get/all`, {
        method: 'GET',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch crypto coins');
      console.log('crypto coins', {data})
      return data.data as CryptoCoin[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ── Fetch networks for a specific coin (used for USDT multi-network) ────────
export const fetchCryptoNetworks = createAsyncThunk(
  'crypto/fetchNetworks',
  async (coinId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/crypto/rates/users/get/all`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ id: coinId }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch networks');
      console.log('crypto network', {data})
      return (data.data || []) as CryptoNetwork[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ── Fetch current rate for a specific coin ──────────────────────────────────
export const fetchCryptoRate = createAsyncThunk(
  'crypto/fetchRate',
  async ({ coinName, userId }: { coinName: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/crypto/rates/users/get/coin_name?coin_name=${coinName}`, {
        method: 'GET',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch crypto rate');
      console.log("rate", data)
      return data.data as CryptoRateRange[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ── Start a crypto trade ────────────────────────────────────────────────────
interface StartCryptoTradePayload {
  id: string;
  data: {
    rateSpec: string;
    userAmount: number;
    images: string[];
  }[];
}

export const startCryptoTrade = createAsyncThunk(
  'crypto/startTrade',
  async (payload: StartCryptoTradePayload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/crypto/trade/users/start`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to start crypto trade');
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ── Fetch user crypto trade history ────────────────────────────────────────
interface FetchCryptoTradesPayload {
  id: string;
  filter: { status: string };
  sort: string;
  start: string;
}

export const fetchCryptoTrades = createAsyncThunk(
  'crypto/fetchTrades',
  async (payload: FetchCryptoTradesPayload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/crypto/trade/users/get`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch crypto trades');
      return data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ── Slice ───────────────────────────────────────────────────────────────────
const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    clearCryptoError: (state) => {
      state.error = null;
    },
    resetCurrentTrade: (state) => {
      state.currentTrade = null;
    },
    clearNetworks: (state) => {
      state.networks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCryptoCoins
      .addCase(fetchCryptoCoins.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCryptoCoins.fulfilled, (state, action: PayloadAction<CryptoCoin[]>) => {
        state.isLoading = false;
        state.coins = action.payload;
      })
      .addCase(fetchCryptoCoins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // fetchCryptoNetworks
      .addCase(fetchCryptoNetworks.pending, (state) => { state.networksLoading = true; state.error = null; })
      .addCase(fetchCryptoNetworks.fulfilled, (state, action: PayloadAction<CryptoNetwork[]>) => {
        state.networksLoading = false;
        state.networks = action.payload;
      })
      .addCase(fetchCryptoNetworks.rejected, (state, action) => {
        state.networksLoading = false;
        state.error = action.payload as string;
      })

      // startCryptoTrade
      .addCase(startCryptoTrade.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(startCryptoTrade.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTrade = action.payload;
      })
      .addCase(startCryptoTrade.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // fetchCryptoTrades
      .addCase(fetchCryptoTrades.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCryptoTrades.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cryptoTrades = action.payload;
      })
      .addCase(fetchCryptoTrades.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // fetchCryptoRate
      .addCase(fetchCryptoRate.pending, (state) => { state.rateLoading = true; state.error = null; })
      .addCase(fetchCryptoRate.fulfilled, (state, action: PayloadAction<CryptoRateRange[]>) => {
        state.rateLoading = false;
        state.cryptoRate = action.payload;
      })
      .addCase(fetchCryptoRate.rejected, (state, action) => {
        state.rateLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCryptoError, resetCurrentTrade, clearNetworks } = cryptoSlice.actions;
export default cryptoSlice.reducer;
