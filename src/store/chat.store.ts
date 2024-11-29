import { create } from 'zustand';

interface Room {
  roomImage: string | null;
  id: string;
  name: string;
}

interface RoomStore {
  room: Room | null;
  setRoom: (room: Room) => void;
  clearRoom: () => void;       
}

const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  setRoom: (room) => set({ room }),   
  clearRoom: () => set({ room: null }), 
}));

export default useRoomStore;

