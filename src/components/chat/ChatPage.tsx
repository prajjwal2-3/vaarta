"use client";
import useUserStore from "@/store/chat.store";
import { Input } from "../ui/input";
import { DefaultSession } from "next-auth";
import { Trash2Icon, Info, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { OnlineUser } from "@/store/user.store";
import { useWebsocket } from "@/store/socket.store";
import { useEffect, useRef, useState } from "react";
import queryClient from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "../ui/separator";
import { deleteRoom } from "@/actions/room.action";
import { format } from "date-fns";
import { toast } from "sonner";
interface User {
  id: string;
  image: string | null;
  name: string;
}
interface Message {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  senderId: string;
  sent: boolean;
  delivered: boolean;
  read: boolean;
  roomId: string;
}
export default function ChatPage({
  currentUser,
}: {
  currentUser: DefaultSession;
}) {
  const { room, clearRoom } = useUserStore();
  const { onlineUsers } = OnlineUser();
  const [content, setContent] = useState("");
  const { ws } = useWebsocket();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const data = queryClient.getQueryData<User[]>(["usersInRoom", room?.id]);
  const { data: message } = useQuery<Message[]>({
    queryKey: ["messages", room?.id],
  });
  const isLoading = queryClient.getQueryState(["usersInRoom", room?.id]);
  useEffect(() => {
    scrollToBottom();
  }, [room, message]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!room)
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center">
        No user selected
      </div>
    );

  const users = data
    ?.map((e) => e.id)
    .filter((p) => p !== currentUser.user?.id);
  const isOnline = users?.some((user) => onlineUsers.includes(user));

  return (
    <div className="flex flex-col h-screen">
      <section className="p-2 border-b flex items-center gap-2 shadow-md z-10">
        {room.roomImages && room.roomImages.length > 0 ? (
          <div className="relative">
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
            {isOnline && (
              <div className="absolute right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full bottom-1"></div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-10 w-10 bg-primary rounded-full text-white">
            {room.names[0].charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold">
            {room.roomType === "SINGLE"
              ? room.createdBy === currentUser?.user?.id
                ? room.names[0]
                : room.names[1]
              : room.names[0]}
          </p>
          {!isLoading ? (
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
        <div className="ml-auto flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger>
              <div className="cursor-pointer text-white/60 hover:text-white">
                <Trash2Icon />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this room and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    if (
                      room.createdBy !== currentUser?.user?.id &&
                      room.roomType === "GROUP"
                    ) {
                      toast("Only Admin can delete group");
                      return;
                    }
                    await deleteRoom(room.id);
                    queryClient.invalidateQueries({ queryKey: ["rooms"] });
                    clearRoom();
                    toast("Room deleted successfully");
                  }}
                  className="bg-red-500 hover:bg-red-400"
                >
                  Delete Room
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Popover>
            {room.roomType === "GROUP" && (
              <PopoverTrigger>
                <Info />
              </PopoverTrigger>
            )}
            <PopoverContent className="bg-foreground space-y-3 mr-2">
              <div className="text-sm flex justify-between">
                <p>Group members</p>
                <div className="bg-primary/85 hover:bg-primary cursor-pointer text-xs flex gap-1 px-2 py-0.5 rounded-full w-fit">
                  <Users size={14} />
                  {room.users.length}
                </div>
              </div>
              <Separator />
              <div className="grid gap-2">
                {[...(data ?? [])].reverse().map((e) => (
                  <div key={e.id} className="flex gap-2 items-center">
                    <img
                      src={e.image!}
                      alt=""
                      className="w-6 h-6 rounded-full"
                    />
                    <p>{e.name}</p>
                    {e.id === room.createdBy && (
                      <Badge className="text-[9px] font-extralight rounded-full bg-red-700/40 text-red-500 py-[0px] px-2">
                        Admin
                      </Badge>
                    )}
                  </div>
                ))}
                <Separator />
                <p className="text-sm text-white/60">
                  Group created on {format(room.createdAt, "d MMMM, yyyy")}
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>
      <section className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {message?.map((e) => {
            const sender = data?.find((user) => user.id === e.senderId);
            return (
              <section
                key={e.id}
                className={
                  e.senderId === currentUser.user?.id
                    ? "bg-primary flex flex-col p-2 rounded-lg w-fit ml-auto"
                    : "bg-foreground flex flex-col p-2 rounded-lg w-fit"
                }
              >
                {room.roomType === "GROUP" && (
                  <span
                    className={
                      e.senderId === currentUser.user?.id
                        ? "text-xs text-white mb-1"
                        : "text-xs text-gray-500 mb-1"
                    }
                  >
                    {sender?.name || "Unknown User"}
                  </span>
                )}
                <p>{e.content}</p>
              </section>
            );
          })}

          {message?.length === 0 && (
            <div className="mx-auto text-white/50">No Conversation yet.</div>
          )}
          <div ref={messageEndRef} />
        </div>
      </section>

      <form
        className="p-4 border-t flex gap-2 z-10"
        onSubmit={(e) => {
          e.preventDefault();
          const newMessage = {
            type: "sendMessage",
            senderId: currentUser.user?.id,
            roomId: room.id,
            content,
          };
          ws?.send(JSON.stringify(newMessage));
          setContent("");
        }}
      >
        <Input
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
