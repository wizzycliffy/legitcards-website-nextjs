import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://legitcards-api.onrender.com/api';

interface Wallet {
  balance: number;
  currency: string;
}

interface Bank {
  code: string;
  name: string;
}

interface Withdrawal {
  _id: string;
  amount: number;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  status: string;
  createdAt: string;
}

interface BankAccount {
  _id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode?: string;
}

interface WalletState {
  wallet: Wallet | null;
  banks: Bank[];
  withdrawals: Withdrawal[];
  bankAccounts: BankAccount[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  wallet: null,
  banks: [],
  withdrawals: [],
  bankAccounts: [],
  isLoading: false,
  error: null,
};

export const fetchWallet = createAsyncThunk(
  'wallet/fetch',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/wallet/users/get?id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch wallet');
      const [mainWallet] = data.data;
      return mainWallet;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBanks = createAsyncThunk(
  'wallet/fetchBanks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/withdraw/banks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch banks');
      return data.bank_list?.Result || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWithdrawals = createAsyncThunk(
  'wallet/fetchWithdrawals',
  async ({ userId, page = 1, size = 20 }: { userId: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/withdraw/user/${userId}?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch withdrawals');
      return data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface WithdrawPayload {
  bankCode: string;
  bankName: string;
  bankAccountNumber: string;
  amount: number;
  email: string;
  user_id: string;
  bankAccountName: string;
  nameEnquiryId: string;
  senderName: string;
  id: string;
}

export const initiateWithdrawal = createAsyncThunk(
  'wallet/withdraw',
  async (payload: WithdrawPayload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to initiate withdrawal');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addBankAccount = createAsyncThunk(
  'wallet/addBankAccount',
  async (accountData: { 
    id: string; 
    bankName: string; 
    accountNumber: string; 
    accountName: string; 
    data: { [key: string]: string };
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/banks/users/accounts/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(accountData),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to add bank account');
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBankAccounts = createAsyncThunk(
  'wallet/fetchBankAccounts',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/banks/users/get/id?id=${userId}&bankid=100004`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch bank accounts');
      return data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const validateBankAccount = createAsyncThunk(
  'wallet/validateBankAccount',
  async (payload: { bankCode: string; accountNumber: string; trackingReference: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/withdraw/validateAccount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || 'Failed to validate account');
      return data.bankAccountDetails;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWalletError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wallet = action.payload;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBanks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBanks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banks = action.payload;
      })
      .addCase(fetchBanks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWithdrawals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWithdrawals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.withdrawals = action.payload;
      })
      .addCase(fetchWithdrawals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(initiateWithdrawal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initiateWithdrawal.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(initiateWithdrawal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addBankAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addBankAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.bankAccounts.push(action.payload);
        }
      })
      .addCase(addBankAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBankAccounts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBankAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bankAccounts = action.payload;
      })
      .addCase(fetchBankAccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(validateBankAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateBankAccount.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(validateBankAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWalletError } = walletSlice.actions;
export default walletSlice.reducer;
