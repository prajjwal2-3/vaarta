import { create } from 'zustand';

type WebSocketStore = {
    socket: WebSocket | null;
    connect: (url: string) => void;
    disconnect: () => void;
};

const useWebSocketStore = create<WebSocketStore>((set, get) => ({
    socket: null,

   
    connect: (url: string) => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
            set({ socket });
            console.log('WebSocket connection established.');
        };

        socket.onclose = () => {
            set({ socket: null });
            console.log('WebSocket connection closed.');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    },

  
    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.close();
            set({ socket: null });
            console.log('WebSocket disconnected.');
        }
    },
}));

export default useWebSocketStore;
