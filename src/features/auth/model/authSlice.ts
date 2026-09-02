import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * User type stored in Redux auth state
 * This defines what information we keep about the logged-in user
 */
export interface AuthUser {
  uid: string;                 // Unique ID from Firebase
  email: string | null;        // User's email address
  displayName: string | null;  // User's name
  photoURL: string | null;     // User's profile picture link
  role?: string | null;        // User's role (PARENT, TEACHER, or ADMIN)
  parentId?: string | null;
  accountId?: string | null;
}

/**
 * Auth state structure
 * This defines the shape of our authentication data in the store
 */
interface AuthState {
  user: AuthUser | null;  // The current user (null if not logged in)
  isLoading: boolean;     // True if we are currently logging in/out
  error: string | null;   // Any error message from the last auth attempt
}

const initialState: AuthState = {
  user: null,
  // Starts true: the app doesn't actually know the auth state until Firebase's
  // first onAuthStateChanged callback fires, which is async even on a fresh
  // page load. Pages must not fetch data before this flips to false, or their
  // request goes out with no token yet and silently comes back empty.
  isLoading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Set logged-in user
     * Saves the user's information to the global state
     */
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.error = null; // Clear any previous errors
    },

    /**
     * Loading state for login/register
     * Shows or hides the loading spinner
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Error handling
     * Saves an error message to show to the user
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Logout user
     * Clears all user data and resets the state
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
export const selectAuthLoading = (state: any) => state.auth.isLoading;