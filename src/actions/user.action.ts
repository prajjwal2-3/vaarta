"use server";
import prisma from "@/lib/db";

interface userObj {
  id: string;
  name: string;
  image: string | null;
}

export async function getUser(id: string): Promise<userObj | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  return user;
}

export async function usersInRoom(roomId: string): Promise<userObj[]> {

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { users: true }, 
    });
  
    if (!room || !room.users || room.users.length === 0) {
      return []; 
    }
  

    const userInfo = await prisma.user.findMany({
      where: {
        id: {
          in: room.users, 
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });
  
    return userInfo;
  }
