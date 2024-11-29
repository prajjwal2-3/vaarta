import { create } from "zustand";
interface socketStore {
    ws: WebSocket | null,
    setws: (ws: WebSocket) => void
}
export const useWebsocket = create<socketStore>((set) => ({
    ws: null,
    setws: (ws) => set({ ws })
}))