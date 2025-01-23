'use client'
import { createContext, ReactNode, useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import  useAuthStore  from '@/store/authStore';

interface SocketContextType {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextType>({ socket: null });

interface SocketContextProviderProps {
  children: ReactNode;
}

export const SocketContextProvider = ({ children }: SocketContextProviderProps) => {
  const { isAuthenticated ,user} = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io(process.env.NEXT_PUBLIC_API_URI || '',{
        query:{
          userId:user?.id 
        }
      });
      setSocket(newSocket);
      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [isAuthenticated, user?.id]);

  return (
    <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
  );
};