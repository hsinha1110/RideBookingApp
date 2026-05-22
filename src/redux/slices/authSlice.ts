import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  signUpAsyncThunk,
  loginAsyncThunk,
  sendOtpAsyncThunk,
  verifyOtpAsyncThunk,
  allRiderRidesAsyncThunk,
} from '@/redux/thunk/thunk';

//================================================
// TYPES
//================================================

export interface AuthState {
  loading: boolean;

  user: any;

  token: string | null;

  isAuthenticated: boolean;

  error: string | null;

  userType: 'rider' | 'driver' | null;

  riderRides: any[];
  riderId: string | null;
}

//================================================
// INITIAL STATE
//================================================

const initialState: AuthState = {
  loading: false,

  user: null,

  token: null,

  isAuthenticated: false,

  error: null,

  userType: null,

  riderRides: [],

  riderId: null,
};
//================================================
// SLICE
//================================================

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    //============================================
    // SET AUTH
    //============================================

    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    //============================================
    // SET USER TYPE
    //============================================

    setUserType: (state, action: PayloadAction<'rider' | 'driver'>) => {
      state.userType = action.payload;
    },
    setRiderId: (state, action: PayloadAction<string | null>) => {
      state.riderId = action.payload;
    },
    //============================================
    // LOGOUT
    //============================================

    logout: state => {
      state.user = null;

      state.token = null;

      state.isAuthenticated = false;

      state.error = null;

      state.userType = null;
    },
  },

  extraReducers: builder => {
    //================================================
    // SIGNUP
    //================================================

    builder.addCase(signUpAsyncThunk.pending, state => {
      state.loading = true;

      state.error = null;
    });

    builder.addCase(
      signUpAsyncThunk.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;

        state.user = action.payload?.user || action.payload;

        state.userType =
          action.payload?.userType || action.payload?.user?.userType || null;

        state.token = null;

        state.isAuthenticated = false;
      },
    );

    builder.addCase(signUpAsyncThunk.rejected, (state, action) => {
      state.loading = false;

      state.error =
        (
          action.payload as {
            message?: string;
          }
        )?.message || 'Signup failed';
    });

    //================================================
    // LOGIN
    //================================================

    builder.addCase(loginAsyncThunk.pending, state => {
      state.loading = true;

      state.error = null;
    });

    builder.addCase(
      loginAsyncThunk.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;

        state.user = action.payload?.user || action.payload;

        state.userType =
          action.payload?.userType || action.payload?.user?.userType || null;

        state.token = null;

        state.isAuthenticated = false;
      },
    );

    builder.addCase(loginAsyncThunk.rejected, (state, action) => {
      state.loading = false;

      state.error =
        (
          action.payload as {
            message?: string;
          }
        )?.message || 'Login failed';
    });

    //================================================
    // SEND OTP
    //================================================

    builder.addCase(sendOtpAsyncThunk.pending, state => {
      state.loading = true;

      state.error = null;
    });

    builder.addCase(sendOtpAsyncThunk.fulfilled, state => {
      state.loading = false;

      state.isAuthenticated = false;
    });

    builder.addCase(sendOtpAsyncThunk.rejected, (state, action) => {
      state.loading = false;

      state.error =
        (
          action.payload as {
            message?: string;
          }
        )?.message || 'Send OTP failed';
    });

    //================================================
    // VERIFY OTP
    //================================================

    builder.addCase(verifyOtpAsyncThunk.pending, state => {
      state.loading = true;

      state.error = null;
    });
    builder.addCase(
      verifyOtpAsyncThunk.fulfilled,
      (state, action: PayloadAction<any>) => {
        const userData = action.payload?.data;

        console.log(userData, '======= USER DATA =======');

        state.loading = false;

        state.user = userData;

        state.token = userData?.token;

        state.userType = userData?.userType;

        state.isAuthenticated = true;

        // THIS IS THE ID
        state.riderId = userData?._id;

        console.log(state.riderId, '======= SAVED RIDER ID =======');

        state.error = null;
      },
    );
    builder.addCase(allRiderRidesAsyncThunk.pending, state => {
      state.loading = true;

      state.error = null;
    });

    builder.addCase(
      allRiderRidesAsyncThunk.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;

        state.riderRides = action.payload?.data || [];

        console.log(state.riderRides, '======= SAVED RIDES =======');
      },
    );

    builder.addCase(allRiderRidesAsyncThunk.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (
          action.payload as {
            message?: string;
          }
        )?.message || 'Failed to fetch rides';
    });
  },
});

//================================================
// EXPORTS
//================================================

export const { logout, setAuthenticated, setUserType, setRiderId } =
  authSlice.actions;

export default authSlice.reducer;
