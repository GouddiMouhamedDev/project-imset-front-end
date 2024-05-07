
import Header from "@/components/header";
import "@/app/globals.css";
import Sidebar from "@/components/sidebar";
import { ReactNode } from "react";


export default function DashboardLayout({ children }: { children: ReactNode }) {

  return (
    <>
        <Header />
        <div className="flex">
          <Sidebar/>
          <div className="md:w-5/6 w-full">
            {children}</div>
        </div>
    </>
  );
}
