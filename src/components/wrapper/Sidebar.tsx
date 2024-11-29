import prisma from "@/lib/db";
import ChatSelector from "../chat/ChatSelector";
import { auth } from "@/auth";
import { NewChatDialog } from "./createRoom";
import Rooms from "../chat/Rooms";
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
    <div className="fixed p-4 min-h-screen w-[calc(100vw/6)] text-white border-r ">
      <div>
        <p className="font-semibold text-xl">Friends</p>
        <NewChatDialog users={users} currentUser={currentUser!}/>
      </div>
      <Rooms currentUser={currentUser!}/>
      
    </div>
  );
}
