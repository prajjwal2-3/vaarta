
import { auth } from "@/auth";
import ChatPage from "@/components/chat/ChatPage";
export default async function Home() {
  return (
    <div className="grid items-center text-white justify-items-center  font-[family-name:var(--font-geist-sans)]">
     <ChatPage/>
    </div>
  );
}