import prisma from "@/lib/db";
import ChatSelector from "../chat/ChatSelector";
import { auth } from "@/auth";
export default async function Sidebar() {
  const currentUser = await auth()
  const users = await prisma.user.findMany({
    select: {
      name: true,
      image: true,
      id: true,
    },
  });

  return (
    <div className="fixed p-4 min-h-screen w-[calc(100vw/6)] text-white border-r ">
      <p className="font-semibold text-xl">Friends</p>
      <div className="grid gap-4 my-5 ">
        {users.filter((user)=>user.id!==currentUser?.user.id).map((user) => (
          <ChatSelector user={user} currentUser={currentUser!}/>
        ))}
      </div>
    </div>
  );
}
