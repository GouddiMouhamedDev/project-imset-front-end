import Header from "@/components/header";
import "@/app/globals.css";
import Sidebar from "@/components/sideBar";
import { ReactNode } from "react";
import { UserProvider } from "@/contexts/UserContext";
import { Card } from "@/components/ui/card";
export default function DashboardLayout({ children }: { children: ReactNode }) {

  return (
    <UserProvider>
     
      <div className="flex  mt-2 scroll-smooth">
      <Card className="w-1/6 hidden md:flex flex-col p-3 shadow  sticky mt-3 ml-2 text-sm ">
        <Sidebar />
       </Card>  
        <div className="w-full flex flex-col mt-3">
          <div className="mx-3">
            <Header />
          </div>

          <div className="flex-1 m-3  ">{children}</div>
        </div>
      </div>
    </UserProvider>
  );
}