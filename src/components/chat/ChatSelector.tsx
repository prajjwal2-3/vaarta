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
    names: string[];
    roomImages: (string | null)[];
    roomType: "SINGLE" | "GROUP";
    createdBy: string;
    users:string[]
  };
  currentUser: DefaultSession;
}

export default function ChatSelector({ user, currentUser }: ChatSelectorProps) {
  const { setRoom, room: present } = useUserStore();
  const isSingleRoom = user.roomType === "SINGLE";
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
      {user.roomImages && user.roomImages.length > 0 ? (
        <div className="relative w-2/12">
          <div className="w-10 h-10 rounded-full border object-contain overflow-clip">
            <img
            //@ts-ignore
              src={
                user.createdBy === currentUser?.user?.id
                  ? user.roomImages[0] 
                  : user.roomImages[1] 
              }
              alt={`${user.names[0]}'s profile`}
            />
          </div>
        </div>
      ) : (
        <div className="w-2/12">
          <div className="flex items-center justify-center h-10 w-10 bg-primary rounded-full text-white">
            {user.names[0].charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      <div className="flex  gap-2 w-fit relative">
        <p className="font-medium">
          {user.createdBy === currentUser?.user?.id
            ? user.names[0]
            : user.names[1]}
          {isCurrentUser && (
            <span className="text-muted-foreground">(You)</span>
          )}
        </p>
      </div>
    </div>
  );
}
