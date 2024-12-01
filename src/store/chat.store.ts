import { create } from 'zustand';

interface Room {
  id: string;
    names: string[];
    roomImages: (string | null)[];
    roomType: "SINGLE" | "GROUP";
    createdBy: string;
    users: string[];
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

