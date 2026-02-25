import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Asset {
  _id: string;
  name: string;
  images: string[];
  trading_period_start: string;
  trading_period_stop: string;
  // Add other fields from API
}

interface RateAsset {
  _id: string;
  name: string;
  images: string[];
  cardActive: boolean;
  special_info?: string;
  id?: string;
}

interface CountryInfo {
  name: string;
}

interface Rate {
  _id: string;
  range_above: boolean;
  currency: string;
  country_info: CountryInfo;
  country: string;
  type: string;
  from: number;
  to: number;
  processing_time: string;
  rateActive: boolean;
  asset: RateAsset;
  note: string;
  rate: number;
  createdAt: string;
  updatedAt: string;
  admin: string;
}

interface AssetState {
  assets: Asset[];
  rates: Rate[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AssetState = {
  assets: [],
  rates: [],
  isLoading: false,
  error: null,
};

// const BASE_URL = 'http://localhost:7000/api';
const BASE_URL = 'https://legitcards-api.onrender.com/api';

export const fetchAssets = createAsyncThunk(
  'assets/fetchAll',
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/assets/users/get/all`, {
        method: 'GET', // Postman documentation showed POST for some users/get/all with ID in body
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch assets');
      return data.data; // Assuming it returns { data: [...] }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRates = createAsyncThunk(
  'assets/fetchRates',
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/rates/users/get/all?start=0&limit=1000`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch rates');
      return data.data; 
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const assetSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAssets.fulfilled, (state, action: PayloadAction<Asset[]>) => {
        console.log("Assets fetched successfully", action.payload);
        state.isLoading = false;
        state.assets = action.payload;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        console.log("Failed to fetch assets", action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRates.fulfilled, (state, action: PayloadAction<Rate[]>) => {
        state.isLoading = false;
        state.rates = action.payload;
      })
      .addCase(fetchRates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default assetSlice.reducer;
