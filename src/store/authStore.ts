import { Interface } from 'readline'
import {create} from 'zustand'
import {devtools,persist} from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'

interface Authstate{
    user: any | null;
  token:string | null
  isAuthenticated: boolean;
  isLoading: boolean;
  setUserAuth: (admin: any, token:string) => void; 
  setUser: (admin: any) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
  checkTokenValidity: () => boolean;
}


const useAuthStore = create<Authstate>()(
    devtools(
        persist(
          (set, get) => ({
            user: null,
            token:null,
            isAuthenticated: false,
            isLoading: true,
            setUserAuth: (user, token) => {
              localStorage.setItem('user', JSON.stringify(user));
              localStorage.setItem('userAccessToken', token);
              set({ user,token, isAuthenticated: true, isLoading: false });
            },
            setUser: (user) => {
              set({ user });
            },
            logout: () => {
              localStorage.removeItem('user');
              localStorage.removeItem('userAccessToken');
              set({ user: null,token:null, isAuthenticated: false, isLoading: false });
            },
            initAuth: async () => {
              const user = JSON.parse(localStorage.getItem('user') || 'null');
              const token = localStorage.getItem('userAccessToken');
              if (user && token && get().checkTokenValidity()) {
                set({ user, isAuthenticated: true, isLoading: false });
              } else {
                get().logout();
              }
            },
            checkTokenValidity:()=>{
              const token = localStorage.getItem('userAccessToken')
              if(!token) return false
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
)