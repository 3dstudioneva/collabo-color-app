import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (url: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!url) return;

    const socket = io(url, {
      transports: ['websocket'],
    });
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [url]);

  return socketRef.current;
};