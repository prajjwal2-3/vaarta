"use client";
import { useEffect, useState } from "react";
import useUserStore from "@/store/chat.store";
import Image from "next/image";
import { DefaultSession } from "next-auth";
import { useWebsocket } from "@/store/socket.store";
import { OnlineUser } from "@/store/user.store";
import queryClient from "@/lib/queryClient";
interface ChatSelectorProps {
  user: {
    id: string;
    name: string;
    roomImage: string | null;
    roomType: "SINGLE" | "GROUP";
  };
  currentUser: DefaultSession;
}

export default function ChatSelector({ user, currentUser }: ChatSelectorProps) {
  const { setRoom, room: present } = useUserStore();
  const isSingleRoom = user.roomType==='SINGLE'
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    if (currentUser?.user?.id) {
      setIsCurrentUser(currentUser.user.id === user.id);
    }
  }, [user, currentUser]);

  return (
    <div
      key={user.id}
      onClick={() => setRoom(user)}
      className={`flex items-center gap-3 p-2 cursor-pointer rounded-lg ${
        present?.id === user.id && "bg-foreground"
      } hover:bg-foreground transition-colors`}
    >
      {user.roomImage ? (
        <div className="relative  w-2/12">
        <div className="w-10 h-10 rounded-full border object-contain overflow-clip">
        <img
            src={user.roomImage}
            alt={`${user.name}'s profile`}
          />
        </div>
        </div>
      ) : (
        <div className="w-2/12">
          <div className="flex  items-center justify-center h-10 w-10 bg-primary rounded-full text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
      <div className="flex  gap-2 w-fit relative">
        <p className="font-medium">
          {user.name}
          {isCurrentUser && (
            <span className="text-muted-foreground">(You)</span>
          )}
        </p>
      </div>
    </div>
  );
}
