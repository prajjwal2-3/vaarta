"use client";
import useUserStore from "@/store/chat.store";
export default function ChatPage() {
  const { user } = useUserStore();
  return <div>
    {
        user?
        <p>{user.name}</p>:
        <p>No chat selected</p>
    }
  </div>;
}
