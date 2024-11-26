
import { auth } from "@/auth";
import ChatPage from "@/components/chat/ChatPage";
export default async function Home() {
  const currentUser = await auth()
  return (
    <div className="grid  text-white  font-[family-name:var(--font-geist-sans)]">
     <ChatPage currentUser={currentUser!}/>
    </div>
  );
}