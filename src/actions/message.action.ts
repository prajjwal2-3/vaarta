'use server'

import prisma from "@/lib/db"

export async function getMessages(roomId:string){
    const messages = await prisma.message.findMany({
        where:{
            roomId
        }
    })
    return messages
}

