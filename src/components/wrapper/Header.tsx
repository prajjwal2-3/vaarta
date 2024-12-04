import { auth } from "@/auth";
import LogoutButton from "../Logout";

export default async function Header() {
  const user = await auth();
  return (
    <div className="fixed h-20 bg-foreground flex p-4 items-center justify-between w-full max-w-screen-2xl">
      <div className="flex gap-4 items-center">
        <img
          src={user?.user.image!}
          alt=""
          className="w-10 h-10 rounded-full"
        />
        <p className="text-white">{user?.user.name}</p>
      </div>
      <LogoutButton />
    </div>
  );
}
