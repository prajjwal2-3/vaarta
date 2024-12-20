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
          names: true,
          roomType: true,
        roomImages:true,
        createdBy:true,
        users:true,
        createdAt:true
        },
      });
      return rooms
}

export async function deleteRoom(roomId:string){
  await prisma.room.delete({
    where:{
      id:roomId
    }
  })
}