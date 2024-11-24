

import Header from '@/components/wrapper/Header';

import Sidebar from '@/components/wrapper/Sidebar';

export default async function RootLayout({ children }: { children: React.ReactNode; }) {
    return (
      <div className="max-w-screen-2xl shadow-xl border-x border-foreground w-full mx-auto">
        <Header />
        <div className="min-h-screen flex pt-20">
          <Sidebar />
          <div className="xl:ml-[256px] ml-[calc(100vw/6)] p-2 sm:p-4 md:p-6 lg:p-8 w-full">
            {children}
          </div>
        </div>
      </div>
    );
   
}