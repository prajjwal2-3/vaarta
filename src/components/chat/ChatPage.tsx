"use client";
import useUserStore from "@/store/chat.store";
import Image from "next/image";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { getSentMessages, sendMessages } from "@/actions/message.action";
import { DefaultSession } from "next-auth";
import { Button } from "../ui/button";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  sent: boolean;
  delivered: boolean;
  read: boolean;
}

export default function ChatPage({
  currentUser,
}: {
  currentUser: DefaultSession;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useUserStore();
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages
  useEffect(() => {
    async function fetchMessages() {
      try {
        const sentMessages = await getSentMessages(
          currentUser.user?.id!,
          user?.id!
        );
        const receivedMessages = await getSentMessages(
          user?.id!,
          currentUser.user?.id!
        );

        // Combine sent and received messages and sort them by time
        const allMessages = [...sentMessages, ...receivedMessages].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        setMessages(allMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    }

    if (user) fetchMessages();
  }, [user]);

  // Send a new message
  async function sendMessage() {
    if (newMessage.trim() === "") return;
    try {
      await sendMessages(currentUser.user?.id!, user?.id!, newMessage);

      // Append the new message to the list
      const newMessageObject: Message = {
        id: crypto.randomUUID(), // Temporary ID for UI
        senderId: currentUser.user?.id!,
        receiverId: user?.id!,
        createdAt: new Date(),
        updatedAt: new Date(),
        content: newMessage,
        sent: true,
        delivered: false,
        read: false,
      };
      setMessages((prev) => [...prev, newMessageObject]);

      // Clear the input
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }

  if (!user)
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center">
        No user selected
      </div>
    );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <section className="p-2 border-b flex items-center gap-2 shadow-md z-10">
        {user.image ? (
          <div className="relative">
            <Image
              width={40}
              height={40}
              className="rounded-full"
              src={user.image}
              alt={`${user.name}'s profile`}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-10 w-10 bg-primary rounded-full text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <p className="font-semibold">{user.name}</p>
      </section>

      {/* Messages */}
      <section className="flex-1 overflow-y-auto px-4 py-2">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-center ${
                message.senderId === currentUser.user?.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-md mb-2 max-w-xs ${
                  message.senderId === currentUser.user?.id
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
      </section>

      {/* Input */}
      <section className="p-4 border-t flex gap-2 z-10">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button onClick={sendMessage}>Send</Button>
      </section>
    </div>
  );
}
