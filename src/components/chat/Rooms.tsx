"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "@/actions/room.action";
import { DefaultSession } from "next-auth";
import ChatSelector from "./ChatSelector";
import { useEffect } from "react";
import { OnlineUser } from "@/store/user.store";
import { useWebsocket } from "@/store/socket.store";
import queryClient from "@/lib/queryClient";
import { toast } from "sonner";
export default function Rooms({
  currentUser,
}: {
  currentUser: DefaultSession;
}) {
    const { ws, setws } = useWebsocket();
    const { onlineUsers, setOnlineUsers } = OnlineUser();
    useEffect(() => {
      const socket = new WebSocket("ws://localhost:8000/chat");
      setws(socket);
      socket.onopen = () => {
        console.log("connection to websocket done.");
        const message = JSON.stringify({
          type: "setMeOnline",
          userId: currentUser.user?.id,
        });
        socket.send(message);
      };
      socket.onmessage = (message) => {
        console.log(message.data);
        const parsedMessage = JSON.parse(message.data);
        switch (parsedMessage.type) {
          case "onlineUsers":
            setOnlineUsers(parsedMessage.users);
            break;
          case "newRoom":
            queryClient.invalidateQueries({queryKey:['rooms']})
            toast('Room has been created.')
        }
      };
    }, []);
  const { data, isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      if (!currentUser.user) return [];
      return await getRooms(currentUser);
    },
    enabled: !!currentUser.user,
  });
  return (
    <div className="grid gap-4 my-5 ">
      {isLoading && <div>Loading rooms..</div>}
      {data &&
        data
          .filter((user) => user.id !== currentUser?.user?.id)
          .map((user) => (
            <ChatSelector user={user} currentUser={currentUser!} />
          ))}
    </div>
  );
}
