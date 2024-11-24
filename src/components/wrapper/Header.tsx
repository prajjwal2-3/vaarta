import LogoutButton from "../Logout"
import { ModeToggle } from "../ui/ModeToggle"

export default function Header() {
  return (
    <div className="fixed h-20 bg-foreground flex p-4 items-center justify-between w-full">
      {/* <ModeToggle/> */}
      <p className="text-primary font-bold text-xl">MESSAGE</p>
      <LogoutButton/>
    </div>
  )
}
