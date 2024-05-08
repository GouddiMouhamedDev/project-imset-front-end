
import Header from "@/components/header";
import "@/app/globals.css";
import Sidebar from "@/components/sidebar";
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";


export default function DashboardLayout({ children }: { children: ReactNode }) {

  return (
    <>
    <div className="flex h-screen mt-2 scroll-smooth">
      
      <Sidebar />

      <div className="w-full flex flex-col mt-3">
        <div className="h-15">   <Header /></div>
     
        <div className="flex-1 m-3  ">
         {children}
        </div>
      </div>
    </div>
  </>
  );
}
