"use client";
import { useEffect, useState } from "react";
import useUserStore from "@/store/chat.store";
import { DefaultSession } from "next-auth";
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
      className={`flex items-center md:gap-3 md:p-2 flex-col lg:flex-row justify-center cursor-pointer rounded-lg ${
        present?.id === user.id && "bg-foreground"
      } hover:bg-foreground transition-colors`}
    >
      {user.roomImages && user.roomImages.length > 0 ? (
        <div className="relative lg:w-2/12">
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
        <div className="lg:w-2/12">
          <div className="flex items-center justify-center h-10 w-10 bg-primary rounded-full text-white">
            {user.names[0].charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {
        isSingleRoom?
        <div className="md:flex hidden text-xs md:text-base gap-2 w-fit relative">
        <p className="font-medium">
          {user.createdBy === currentUser?.user?.id
            ? user.names[0]
            : user.names[1]}
        </p>
      </div>:
      <div className="text-xs md:flex hidden  md:text-base">
        {user.names[0]}
      </div>
      }
    </div>
  );
}
