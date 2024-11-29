import { OnlineUser,useTypingUser } from "@/store/user.store"


export function setOnline(users:string[]){
    const {setOnlineUsers}=OnlineUser()
    setOnlineUsers(users)
}


