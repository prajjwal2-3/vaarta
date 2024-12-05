"use client";
import { useEffect, useState } from "react";
import useUserStore from "@/store/chat.store";
import { DefaultSession } from "next-auth";
import { useQuery } from "@tanstack/react-query";
import { usersInRoom } from "@/actions/user.action";
import { getMessages } from "@/actions/message.action";
import { OnlineUser } from "@/store/user.store";
interface ChatSelectorProps {
  user: {
    id: string;
    names: string[];
    roomImages: (string | null)[];
    roomType: "SINGLE" | "GROUP";
    createdBy: string;
    users: string[];
  };
  currentUser: DefaultSession;
}

export default function ChatSelector({ user, currentUser }: ChatSelectorProps) {
  const { setRoom, room: present } = useUserStore();
  const { onlineUsers } = OnlineUser();
  const isSingleRoom = user.roomType === "SINGLE";
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["usersInRoom", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await usersInRoom(user.id);
    },
    enabled: !!user?.id,
  });

  const { data: message, isLoading: messageLoading } = useQuery({
    queryKey: ["messages", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await getMessages(user.id);
    },
  });
  useEffect(() => {
    if (currentUser?.user?.id) {
      setIsCurrentUser(currentUser.user.id === user.id);
    }
  }, [user, currentUser]);
  const users = data
    ?.map((e) => e.id)
    .filter((p) => p !== currentUser.user?.id);
  const participantImage = data
    ?.map((e) => e.image)
    .filter((p) => p !== currentUser.user?.image)[0];
  const isOnline = users?.some((user) => onlineUsers.includes(user));
  const lastMessage = message?.slice(-1)[0];
  return (
    <div
      key={user.id}
      onClick={() => setRoom(user)}
      className={`flex items-center gap-3 lg:p-3 cursor-pointer rounded-lg ${
        present?.id === user.id ? "bg-foreground" : "hover:bg-foreground"
      } transition-colors`}
    >
      {user.roomImages && user.roomImages.length > 0 ? (
        <div className="relative flex-shrink-0 w-12 h-12">
          <img
            //@ts-ignore
            src={
              user.createdBy === currentUser?.user?.id
                ? user.roomImages[0]
                : user.roomImages[1]
            }
            alt={`${user.names[0]}'s profile`}
            className="w-full h-full rounded-full object-cover border"
          />
          {isOnline && (
            <div className="absolute right-1 w-1.5 h-1.5 bg-green-500 rounded-full bottom-1"></div>
          )}
        </div>
      ) : (
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-primary rounded-full text-white">
          {user.names[0].charAt(0).toUpperCase()}
        </div>
      )}
      <div className="lg:flex flex-col flex-grow hidden min-w-0">
        <p
          className="font-medium text-sm md:text-base truncate"
          title={
            isSingleRoom
              ? user.createdBy === currentUser?.user?.id
                ? user.names[0]
                : user.names[1]
              : user.names[0]
          }
        >
          {isSingleRoom
            ? user.createdBy === currentUser?.user?.id
              ? user.names[0]
              : user.names[1]
            : user.names[0]}
        </p>
        <p className="text-xs text-gray-500 truncate">{messageLoading?'loading...':lastMessage?.content}</p>
      </div>
    </div>
  );
}
