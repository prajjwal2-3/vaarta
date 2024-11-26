'use server'
import prisma from "@/lib/db"
export async function getSentMessages(user1Id:string,user2Id:string){
    const messages = await prisma.message.findMany({
            where:{
                receiverId:user2Id,
                senderId:user1Id
            }
    })
    return messages
}
export async function getRecievedMessages(user1Id:string,user2Id:string){
    const messages = await prisma.message.findMany({
            where:{
                receiverId:user1Id,
                senderId:user2Id
            }
    })
    return messages
}
export async function sendMessages(user1Id:string,user2Id:string,content:string) {
    const newMessage = await prisma.message.create({
        data:{
            
            senderId:user1Id,
            receiverId:user2Id,
            content
        }
    })
    console.log('new message created')
    return newMessage
}