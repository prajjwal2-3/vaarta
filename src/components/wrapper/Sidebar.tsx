import prisma from "@/lib/db";
import ChatSelector from "../chat/ChatSelector";
import { auth } from "@/auth";
import { NewChatDialog } from "./createRoom";
export default async function Sidebar() {
  const currentUser = await auth()
  const rooms = await prisma.room.findMany({
    where:{
      users:{
        has:currentUser?.user.id
      }
    },
    select:{
      id:true,
      name:true,
      roomImage:true,
      roomType:true
    }
  })
const users = await prisma.user.findMany({
select:{
  id:true,
  name:true,
  image:true
}
})
  return (
    <div className="fixed p-4 min-h-screen w-[calc(100vw/6)] text-white border-r ">
    <div>
    <p className="font-semibold text-xl">Friends</p>
    <NewChatDialog users={users}/>
    </div>
      <div className="grid gap-4 my-5 ">
      {rooms.filter((user)=>user.id!==currentUser?.user.id).map((user) => (
          <ChatSelector user={user} currentUser={currentUser!}/>
        ))}
      </div>
    </div>
  );
}
