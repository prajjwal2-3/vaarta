import { auth } from "@/auth"
import LogoutButton from "../Logout"


export default async function Header() {
  const user = await auth()
  return (
    <div className="fixed h-20 bg-foreground flex p-4 items-center justify-between w-full max-w-screen-2xl">
      {/* <ModeToggle/> */}
     <p className="text-white"> logged in as {user?.user.email}</p>
      <p className="text-primary font-bold text-xl">MESSAGE</p>
      <LogoutButton/>
    </div>
  )
}
