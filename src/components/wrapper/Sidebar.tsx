import prisma from "@/lib/db";
import LogoutButton from "../Logout";
import { auth } from "@/auth";
import { NewChatDialog } from "./createRoom";
import Rooms from "../chat/Rooms";
import { ScrollArea } from "../ui/scroll-area";
import UserSearchBar from "../wrapper/UserSearchBar";
export default async function Sidebar() {
  const currentUser = await auth();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    },
  });
  return (
    <div className="fixed p-1 md:p-4 min-h-screen w-[calc(100vw/6)] text-white border-r ">
      <div>
        <NewChatDialog users={users} currentUser={currentUser!}/>
      </div>
      {/* <UserSearchBar usernames={users.map((e)=>e.name)}/> */}
     <ScrollArea className="h-[80vh]">
     <Rooms currentUser={currentUser!}/>
     </ScrollArea>
     <LogoutButton/>
    </div>
  );
}
