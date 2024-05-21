import Header from "@/components/header";
import "@/app/globals.css";
import Sidebar from "@/components/sideBar";
import { ReactNode } from "react";
import { UserProvider } from "@/contexts/UserContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <div className="flex  mt-2 scroll-smooth">
        <Sidebar />

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
