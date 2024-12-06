
import Header from '@/components/wrapper/Header';
import Sidebar from '@/components/wrapper/Sidebar';
export default async function RootLayout({ children }: { children: React.ReactNode; }) {
    return (
      <div className="max-w-screen-2xl shadow-xl border-x border-foreground w-full mx-auto">
        {/* <Header /> */}
        <div className="min-h-screen flex">
          <Sidebar />
          <div className=" ml-[calc(100vw/6)]  w-full">
            {children}
          </div>
        </div>
      </div>
    );
}