import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import api from './api';

// UI State Slice
interface UIState {
  sidebarOpen: boolean;
  darkMode: boolean;
}

const initialState: UIState = {
  sidebarOpen: false,
  darkMode: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const uiReducer = uiSlice.reducer;
export const { toggleSidebar, closeSidebar, toggleDarkMode } = uiSlice.actions;

// Auth State Slice
interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
}

const getInitialAuthState = (): AuthState => {
  // Get token from sessionStorage on initial load (survives page refresh)
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
  const userStr = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;
  
  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuthState(),
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: any; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      // Store in sessionStorage (survives page refresh, cleared on browser close)
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Clear from sessionStorage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    },
  },
});

export const authReducer = authSlice.reducer;
export const { setCredentials, logout } = authSlice.actions;

// Store Configuration
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['ui/toggleSidebar', 'auth/setCredentials'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'meta.baseQueryMeta', 'payload.user'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user', 'auth.token'],
      },
    }).concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
