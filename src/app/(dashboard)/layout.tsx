"use client";
import { getUserInfoFromStorage} from "@/api/auth";
import "@/app/globals.css";
import Header from "@/components/header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { ReactNode } from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaListOl } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { LuSettings } from "react-icons/lu";
import { MdCommute, MdLockReset } from "react-icons/md";
import { ThemeProvider } from "@/components/theme-provider"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const userRole = getUserInfoFromStorage()?.role;
  const isAdmin = ["super-admin", "admin","user"].includes(userRole!);


  return (
    <>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
    <Header />
    <div className="flex">
          {/*sideBar */}
          <div className=" w-1/6 hidden md:flex flex-col p-3 shadow  h-screen sticky top-0 ">
     <div className="flex items-center">
       <h2 className="text-xl font-bold">Sidebar</h2>
     </div>
     <br />
     <div className="space-y-3">
       <Accordion type="single" collapsible className="w-full">
         <AccordionItem value="item-0">
           <Link
             href="/dashboard"
             className="flex items-center space-x-2  hover:underline"
           >
             <AiOutlineDashboard />
             <span>Dash(dev)</span>
           </Link>
         </AccordionItem>
         
         <AccordionItem value="item-1">
       
           <AccordionTrigger>
             <div className="flex items-center space-x-2">
               <FiUsers />
               <span>User(test here)</span>
             </div>
           </AccordionTrigger>
          
           <AccordionContent>
           {isAdmin && ( // Vérifiez si l'utilisateur a le rôle 'super-admin'
            <>
            <Link
               href="/users"
               className="flex items-center p-2 space-x-2 rounded-md"
             >
               <FaListOl />
               &nbsp;Liste
             </Link>
          
               <>
                 <Link
                   href="/users/add"
                   className="flex items-center p-2 space-x-3 rounded-md"
                 >
                   <IoMdAddCircleOutline />
                   &nbsp;Ajouter
                 </Link>
               </>
               </>
              )} 
           </AccordionContent>
          
         </AccordionItem>
        
         <AccordionItem value="item-2">
           <AccordionTrigger>
             <div className="flex items-center space-x-2">
               <MdCommute />
               <span>Vehicules(test here)</span>
             </div>
           </AccordionTrigger>
           <AccordionContent>
             <Link
               href="/vehicles"
               className="flex items-center p-2 space-x-3 rounded-md"
             >
               <FaListOl /> &nbsp;List
             </Link>
           </AccordionContent>
         </AccordionItem>
         <AccordionItem value="item-3">
           <AccordionTrigger>
             <div className="flex items-center space-x-2">
               <MdCommute />
               <span>Clients(dev)</span>
             </div>
           </AccordionTrigger>
           <AccordionContent>
             <Link
               href="/clients"
               className="flex items-center p-2 space-x-3 rounded-md"
             >
               <FaListOl /> &nbsp;List
             </Link>
           </AccordionContent>
         </AccordionItem>
         <AccordionItem value="item-4">
           <AccordionTrigger>
           <div className="flex items-center space-x-2">
           <LuSettings />
             <span>Settings(dev)</span>
             </div>
           </AccordionTrigger>
           <AccordionContent>
             <Link
               href="/reset"
               className="flex items-center p-2 space-x-3 rounded-md"
             >
               <MdLockReset />
               &nbsp;Rst
             </Link>
           </AccordionContent>
         </AccordionItem>
         
       </Accordion>
      
     </div>
   </div>
    {/*contenu principal */}
    <div className="md:w-5/6  w-full " >
     
      {children}
    </div>
     
 
   </div>
   </ThemeProvider>
   </>
  );
}
