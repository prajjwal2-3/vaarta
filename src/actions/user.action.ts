"use server"
import prisma from "@/lib/db"
export default async function getUser(id: string) {
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            image: true
        }
    })

    return user
}

