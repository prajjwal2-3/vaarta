"use server";
import prisma from "@/lib/db";

interface userObj {
  id: string;
  name: string;
  image: string | null;
}

// Fetch user details
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
    // Fetch the room and retrieve the array of user IDs
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { users: true }, // Assuming `users` is an array of user IDs
    });
  
    if (!room || !room.users || room.users.length === 0) {
      return []; // Return empty array if room or users not found
    }
  
    // Fetch user details for all user IDs in one query
    const userInfo = await prisma.user.findMany({
      where: {
        id: {
          in: room.users, // Use `in` to fetch all users in the array
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
