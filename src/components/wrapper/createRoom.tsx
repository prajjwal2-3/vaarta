"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { useWebsocket } from "@/store/socket.store";
import { DefaultSession } from "next-auth";
import { toast } from "sonner";

interface user {
  id: string;
  name: string;
  image: string | null;
}

const formSchema = z.object({
  chatType: z.enum(["single", "group"]),
  friend: z.string().optional(),
  groupName: z.string().optional(),
  selectedUsers: z.array(z.string()).optional(),
});

export function NewChatDialog({
  users,
  currentUser,
}: {
  users: user[];
  currentUser: DefaultSession;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatType, setChatType] = useState<"single" | "group">("single");
  const { ws } = useWebsocket();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatType: "single",
      friend: "",
      groupName: "",
      selectedUsers: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.chatType === "single") {
      if (values.friend === "") {
        toast("No friend selected");
        return;
      }
      const message = {
        type: "createRoom",
        createdBy: currentUser.user?.id,
        users: [values.friend, currentUser.user?.id],
        roomType: "SINGLE",
        name: "single",
      };
      ws?.send(JSON.stringify(message));
    } else {
      if (values.groupName === "" || values.selectedUsers?.length === 0) {
        toast("No group name or users selected");
        return;
      }
      const message = {
        type: "createRoom",
        createdBy: currentUser.user?.id,
        users: [...(values.selectedUsers || []), currentUser.user?.id],
        name: values.groupName,
        roomType: "GROUP",
      };
      ws?.send(JSON.stringify(message));
    }

    toast.success("Chat created successfully!");
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mx-auto w-full bg-primary hover:bg-primary/80">
          <p className="flex items-center gap-2">
            <span className="hidden lg:block">New Chat</span>
            <Plus />
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[95%] rounded-lg">
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
          <DialogDescription>
            Choose chat type and select your contact(s)
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={chatType === "single" ? "default" : "outline"}
                onClick={() => {
                  setChatType("single");
                  form.setValue("chatType", "single");
                }}
                className="flex-1"
              >
                1 to 1 Chat
              </Button>
              <Button
                type="button"
                variant={chatType === "group" ? "default" : "outline"}
                onClick={() => {
                  setChatType("group");
                  form.setValue("chatType", "group");
                }}
                className="flex-1"
              >
                Group Chat
              </Button>
            </div>

            {chatType === "single" ? (
              <FormField
                control={form.control}
                name="friend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Friend</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a friend" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-foreground">
                        {users
                          .filter((e) => e.id !== currentUser?.user?.id)
                          .map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full overflow-clip">
                                  <img
                                    src={
                                      user.image ||
                                      "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                                    }
                                    alt="User"
                                  />
                                </div>
                                <p>{user.name}</p>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="groupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter group name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Card className="bg-transparent">
                  <CardHeader>
                    <CardTitle>Select Group Members</CardTitle>
                    <CardDescription>
                      Choose friends to add to the group
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-56">
                      {users
                        .filter((e) => e.id !== currentUser?.user?.id)
                        .map((user) => (
                          <div key={user.id} className="flex items-center space-x-2 mb-2">
                            <Checkbox
                              id={`user-${user.id}`}
                              onCheckedChange={(checked) => {
                                const currentUsers = form.getValues(
                                  "selectedUsers"
                                ) || [];
                                const newUsers = checked
                                  ? [...currentUsers, user.id]
                                  : currentUsers.filter((id) => id !== user.id);
                                form.setValue("selectedUsers", newUsers);
                              }}
                            />
                            <label
                              htmlFor={`user-${user.id}`}
                              className="text-sm font-medium"
                            >
                              {user.name}
                            </label>
                          </div>
                        ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </>
            )}
            <Button type="submit" className="w-full">
              Create Chat
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
