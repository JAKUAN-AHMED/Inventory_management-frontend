import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  notificationsOpen: boolean;
  toggleNotifications: () => void;
  closeNotifications: () => void;
}

export const useUIStore = create<UIState>()((set, get) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  openSidebar: () => set({ sidebarOpen: true }),
  darkMode: false, // ALWAYS default to light mode
  toggleDarkMode: () => {
    const newDarkMode = !get().darkMode;
    console.log('Toggling dark mode:', newDarkMode);
    // Apply to document immediately
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      console.log('Added dark class to html');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('Removed dark class from html');
    }
    set({ darkMode: newDarkMode });
  },
  notificationsOpen: false,
  toggleNotifications: () => set((state) => ({ notificationsOpen: !state.notificationsOpen })),
  closeNotifications: () => set({ notificationsOpen: false }),
}));

export default useUIStore;
