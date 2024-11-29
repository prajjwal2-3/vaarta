"use server"
import prisma from "@/lib/db";
import { DefaultSession } from "next-auth";
export async function getRooms(currentUser:DefaultSession){
    const rooms = await prisma.room.findMany({
        where: {
          users: {
            has: currentUser?.user?.id,
          },
        },
        select: {
          id: true,
          name: true,
          roomImage: true,
          roomType: true,
        },
      });
      console.log(rooms)
      return rooms
}