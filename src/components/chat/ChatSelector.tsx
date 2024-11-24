"use client";

import useUserStore from "@/store/chat.store";
import Image from "next/image";
import { DefaultSession } from "next-auth";

interface ChatSelectorProps {
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  currentUser: DefaultSession & {
    user?: {
      id?: string;
    };
  };
}

export default function ChatSelector({ user, currentUser }: ChatSelectorProps) {
  const { setUser } = useUserStore();

  const isCurrentUser = currentUser.user?.id === user.id;

  return (
    <div
      key={user.id}
      onClick={() => setUser(user)}
      className="flex items-center gap-3 p-2 cursor-pointer rounded-lg hover:bg-foreground transition-colors"
    >
      {user.image ? (
        <div className="relative">
          <Image
          width={40}
          height={40}
          className="rounded-full "
          src={user.image}
          alt={`${user.name}'s profile`}
          
        />
        {isCurrentUser && <p className="text-xs absolute -bottom-2 right-0 bg-gray-400 p-0.5 rounded-md">You</p>}
        </div>
      ) : (
        <div className="flex items-center justify-center h-10 w-10 bg-primary rounded-full text-white font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex flex-row gap-2 w-fit relative">
        <p className="font-medium">{user.name}</p>
        
      </div>
    </div>
  );
}
