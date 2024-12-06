"use client";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "@/actions/room.action";
import { DefaultSession } from "next-auth";
import ChatSelector from "./ChatSelector";
import { OnlineUser } from "@/store/user.store";
import { useWebsocket } from "@/store/socket.store";
import queryClient from "@/lib/queryClient";
import { toast } from "sonner";

interface message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
  roomId: string;
}
export default function Rooms({
  currentUser,
}: {
  currentUser: DefaultSession;
}) {
  const { setws } = useWebsocket();
  const { onlineUsers, setOnlineUsers } = OnlineUser();
  const isProd = process.env.NODE_ENV === "production";
  useEffect(() => {
    const socket = new WebSocket(
      isProd ? "wss://chatapp.prajjwal.dev/chat" : "ws://localhost:8000/chat"
    );
    setws(socket);

    socket.onopen = () => {
      console.log("Connected to WebSocket.");
      const message = JSON.stringify({
        type: "setMeOnline",
        userId: currentUser.user?.id,
      });
      socket.send(message);
    };

    socket.onmessage = (message) => {
      // console.log(message.data);
      const parsedMessage = JSON.parse(message.data);

      switch (parsedMessage.type) {
        case "onlineUsers":
          setOnlineUsers(parsedMessage.users);
          break;

        case "newRoom":
          queryClient.invalidateQueries({ queryKey: ["rooms"] });
          toast("Room has been created.");
          break;

        case "newMessage":
          queryClient.setQueryData(
            ["messages", parsedMessage.newMessage.roomId],
            (oldMessages: message[]) => [
              ...(oldMessages || []),
              parsedMessage.newMessage,
            ]
          );
          break;
        default:
          break;
      }
    };

    return () => {
      console.log("Closing WebSocket connection.");
      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }
    };
  }, [currentUser.user?.id, setws, setOnlineUsers]);

  const { data, isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      if (!currentUser.user) return [];
      return await getRooms(currentUser);
    },
    enabled: !!currentUser.user,
  });
  console.log(data);
  return (
    <div className="grid gap-4 my-5">
      {isLoading &&
        [1, 2, 3, 4].map((e) => (
          <div key={e} className="bg-foreground  w-full h-16 p-2 flex gap-5 items-center rounded-lg">
            <div className="w-full lg:w-2/12">
              <div className="w-10 h-10 bg-background animate-pulse rounded-full mx-auto lg:mr-auto my-auto"></div>
            </div>
            <div className="w-8/12 hidden lg:grid gap-2">
              <div className="bg-background animate-pulse rounded-md w-full h-5"></div>
              <div className="bg-background animate-pulse rounded-md w-9/12 h-3"></div>
            </div>
          </div>
        ))}
      {data &&
        data.map((user) => (
          <ChatSelector key={user.id} user={user} currentUser={currentUser} />
        ))}
    </div>
  );
}
