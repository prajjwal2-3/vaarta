"use client";
import useUserStore from "@/store/chat.store";
import Image from "next/image";
import { Input } from "../ui/input";
import { DefaultSession } from "next-auth";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { usersInRoom } from "@/actions/user.action";
export default function ChatPage({
  currentUser,
}: {
  currentUser: DefaultSession;
}) {
  const { room } = useUserStore();

  const { data, isLoading } = useQuery({
    queryKey: ["usersInRoom", room?.id],
    queryFn: async () => {
      if (!room?.id) return [];
      return await usersInRoom(room.id);
    },
    enabled: !!room?.id, 
  });

  if (!room)
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center">
        No user selected
      </div>
    );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <section className="p-2 border-b flex items-center gap-2 shadow-md z-10">
        {room.roomImage ? (
          <div className="relative">
            <Image
              width={40}
              height={40}
              className="rounded-full"
              src={room.roomImage}
              alt={`${room.name}'s profile`}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-10 w-10 bg-primary rounded-full text-white">
            {room.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold">{room.name}</p>
          {isLoading ? (
            <p>Loading users...</p>
          ) : data && data.length > 0 ? (
            <div className="flex flex-row text-xs gap-2">
              {data.map((user) => (
                <p key={user.id}>{user.name}</p>
              ))}
            </div>
          ) : (
            <p>No users in this room</p>
          )}
        </div>
      </section>
      <section className="flex-1"></section>
      <section className="p-4 border-t flex gap-2 z-10">
        <Input placeholder="Type your message..." />
        <Button>Send</Button>
      </section>
    </div>
  );
}
