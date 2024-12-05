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
  id:string,
  content:string,
  senderId:string,
  createdAt:Date,
  roomId:string
}
export default function Rooms({
  currentUser,
}: {
  currentUser: DefaultSession;
}) {
  const { ws, setws } = useWebsocket();
  const { onlineUsers, setOnlineUsers } = OnlineUser();

  useEffect(() => {
    const socket = new WebSocket("wss://chatapp.prajjwal.dev/chat");
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
            (oldMessages: message[]) => [...(oldMessages || []), parsedMessage.newMessage]
          );
          break;

        default:
          break;
      }
    };


    return () => {
      console.log("Closing WebSocket connection.");
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
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
console.log(onlineUsers)
  return (
    <div className="grid gap-4 my-5">
      {isLoading && <div>Loading rooms...</div>}
      {data &&
        data
          .filter((user) => user.id !== currentUser?.user?.id)
          .map((user) => (
            <ChatSelector key={user.id} user={user} currentUser={currentUser} />
          ))}
    </div>
  );
}
