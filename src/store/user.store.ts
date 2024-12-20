import { create } from "zustand";
interface onlineUserStore {
    onlineUsers: string[],
    setOnlineUsers: (users: string[]) => void
}
interface typingUserStore {
    typingUsers: string[],
    setTypingUsers: (users: string[]) => void
}
export const OnlineUser = create<onlineUserStore>((set) => ({
  onlineUsers: [],

  setOnlineUsers: (newUsers) =>
    set(() => ({
      onlineUsers: [...new Set(newUsers)],
    })),
}));

export const useTypingUser = create<typingUserStore>((set) => ({
    typingUsers: [],

  setTypingUsers: (newUsers) =>
    set((state) => ({
      typingUsers: [
        ...new Map(
          [...state.typingUsers, ...newUsers].map((user) => [user, user])
        ).values(),
      ],
    })),
}));
