import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface AuthUser {
  id?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
  image?: string | undefined;
  googleId?: string | undefined;
  access?: string | undefined;
  userData?: any;
  isExpert?: boolean | undefined;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerified?: number;
  setUserAuth: (user: AuthUser, token: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
  checkTokenValidity: () => boolean;
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        setUserAuth: (user, token) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userAccessToken', token);
          }
          set({ user, token, isAuthenticated: true, isLoading: false });
        },
        setUser: (user) => {
          set({ user });
        },
        logout: () => {
          if (typeof window !== 'undefined') {
            // localStorage.removeItem('user');
            // localStorage.removeItem('userAccessToken');
            localStorage.clear();
            sessionStorage.clear()
          }
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        },
        initAuth: async () => {
          if (typeof window !== 'undefined') {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            const token = localStorage.getItem('userAccessToken');
            if (user && token && get().checkTokenValidity()) {
              set({ user, token, isAuthenticated: true, isLoading: false });
            } else {
              get().logout();
            }
          }
        },
        checkTokenValidity: () => {
          if (typeof window === 'undefined') return false;
          const token = localStorage.getItem('userAccessToken');
          if (!token) return false;
          try {
            const decodedToken: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decodedToken.exp > currentTime;
          } catch (error) {
            console.error('Error decoding token:', error);
            return false;
          }
        }
      }),
      {
        name: 'auth-storage',
      }
    ),
    { name: "AuthStore" }
  )
);

export default useAuthStore;