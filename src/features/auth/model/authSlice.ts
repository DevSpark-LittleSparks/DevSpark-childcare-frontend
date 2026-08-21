import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * User type stored in Redux auth state
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: string | null;
  parentId?: string | null;
  accountId?: string | null;
}

/**
 * Auth state structure
 */
interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Set logged-in user
     */
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.error = null;
    },

    /**
     * Loading state for login/register
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Error handling
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Logout user
     */
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;

/**
 * ✅ SELECTOR (THIS FIXES YOUR ERROR)
 * Used in Sidebar.tsx -> useSelector(selectUser)
 */
export const selectUser = (state: any) => state.auth.user;