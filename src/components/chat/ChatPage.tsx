"use client";
import useUserStore from "@/store/chat.store";
import { Input } from "../ui/input";
import { DefaultSession } from "next-auth";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { usersInRoom } from "@/actions/user.action";
import { getMessages } from "@/actions/message.action";
import { OnlineUser } from "@/store/user.store";
export default function ChatPage({
  currentUser,
}: {
  currentUser: DefaultSession;
}) {
  const { room } = useUserStore();
  const {onlineUsers}=OnlineUser()
  const { data, isLoading } = useQuery({
    queryKey: ["usersInRoom", room?.id],
    queryFn: async () => {
      if (!room?.id) return [];
      return await usersInRoom(room.id);
    },
    enabled: !!room?.id,
  });
  const { data: message, isLoading: messageLoading } = useQuery({
    queryKey: ["messages", room?.id],
    queryFn: async () => {
      if (!room?.id) return [];
      return await getMessages(room.id);
    },
  });


  if (!room)
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center">
        No user selected
      </div>
    );
    const users = data?.map((e)=>e.id).filter((p)=>p!==currentUser.user?.id)
    const participantImage = data?.map((e)=>e.image).filter((p)=>p!==currentUser.user?.image)[0]
    const isOnline = users?.some(user=>onlineUsers.includes(user))
  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <section className="p-2 border-b flex items-center gap-2 shadow-md z-10">
        
        
            
      {room.roomImages && room.roomImages.length > 0 ? (
        <div className="relative ">
          <div className="w-10 h-10 rounded-full border object-contain overflow-clip">
            <img
            //@ts-ignore
              src={
                room.createdBy === currentUser?.user?.id
                  ? room.roomImages[0] 
                  : room.roomImages[1] 
              }
              alt={`${room.names[0]}'s profile`}
            />
          </div>
          {
            isOnline && 
            <div className="absolute right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full bottom-1"></div>
          }
        </div>
      ) : (
        <div className="">
          <div className="flex items-center justify-center h-10 w-10 bg-primary rounded-full text-white">
            {room.names[0].charAt(0).toUpperCase()}
          </div>
        </div>
      )}
      
        <div>
          <p className="font-semibold">
          {room.createdBy === currentUser?.user?.id
            ? room.names[0]
            : room.names[1]}
          </p>
          {isLoading ? (
            <p className="text-xs">Loading users...</p>
          ) : data && data.length > 0 ? (
            <div className="flex flex-row text-xs gap-2">
              {data.map((user) => (
                <p key={user.id}>
                  {user.name === currentUser.user?.name ? "You" : user.name}
                </p>
              ))}
            </div>
          ) : (
            <p>No users in this room</p>
          )}
        </div>
      </section>
      <section className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {message?.map((e) => (
            <section
              key={e.id}
              className={
                e.senderId === currentUser.user?.id
                  ? "bg-primary p-2 rounded-lg w-fit ml-auto"
                  : "bg-foreground p-2 rounded-lg w-fit"
              }
            >
              {e.content}
            </section>
          ))}
          {message?.length === 0 && (
            <div className="mx-auto text-white/50">No Conversation yet.</div>
          )}
        </div>
      </section>
      <section className="p-4 border-t flex gap-2 z-10">
        <Input placeholder="Type your message..." />
        <Button>Send</Button>
      </section>
    </div>
  );
}
