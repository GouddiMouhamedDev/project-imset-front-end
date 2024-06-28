"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaListOl } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdCommute } from "react-icons/md";
import { GiSteeringWheel } from "react-icons/gi";
import { FaRegUser } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";
import { getUserInfoFromStorage} from "@/api/auth";
import { FaFileAlt } from "react-icons/fa";
import { TfiUser } from "react-icons/tfi";
import { BsBuildingFillGear } from "react-icons/bs";
import { IoSettings } from "react-icons/io5";
import { GiFactory } from "react-icons/gi";
import { CiUser } from "react-icons/ci";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, removeStorage } from "@/api/auth";
export default function Sidebar() {
  

  const userRole = getUserInfoFromStorage()?.role;
  const router = useRouter();


  useEffect(() => {
          const isAuthenticated = auth(["admin", "super-admin","user"]);
          if (!isAuthenticated) {
            removeStorage();
            router.push("/login");
    }}, []);
  return (
   
      <div className="space-y-3">
        <Accordion type="single" collapsible className="w-full">
        
          <AccordionItem value="item-1" className="pb-4">
            <Link
              href="/dashboard"
              className=" text-sm font-medium flex items-center space-x-2 hover:underline"
            >
              <AiOutlineDashboard className="  fill-primary dark:fill-white"/>
              <span>Console</span>
            </Link> 
          </AccordionItem>
          {userRole && ['super-admin', 'admin'].includes(userRole) && (
          <AccordionItem value="item-2">  
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <IoSettings  className="fill-primary dark:fill-white"/>
                <span>Administration</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <>
              {userRole && userRole.includes('super-admin') && (
        <Link href="/societe" className="flex items-center p-2 space-x-3 rounded-md">
          <BsBuildingFillGear className="fill-primary dark:fill-white"/>
          &nbsp;Société
        </Link>
      )}
              <Link
                    href="/users"
                    className="flex items-center p-2 space-x-2 rounded-md"
                  >
                   <FaRegUser className="fill-primary dark:fill-white"/>
                    &nbsp;Utilisateurs
                  </Link>
                  </>
            </AccordionContent>
          </AccordionItem>
          )}
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <FaFileAlt className="fill-primary dark:fill-white"/>
                <span>Bon Commande</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/bonCommande "
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl className="fill-primary dark:fill-white"/> &nbsp;Liste
              </Link>
              <Link
                    href="/bonCommande/add"
                    className="flex items-center p-2 space-x-3 rounded-md"
                  >
                    <IoMdAddCircleOutline className="fill-primary dark:fill-white"/>
                    &nbsp;Ajouter
                  </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <FaFileAlt className="fill-primary dark:fill-white"/>
                <span>Bon Livraison</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/bonLivraison "
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl className="fill-primary dark:fill-white"/> &nbsp;Liste
              </Link>
              <Link
                    href="/bonLivraison/add"
                    className="flex items-center p-2 space-x-3 rounded-md"
                  >
                    <IoMdAddCircleOutline className="fill-primary dark:fill-white"/>
                    &nbsp;Ajouter
                  </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <FaFileAlt className="fill-primary dark:fill-white"/>
                <span>Bon Reception</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/bonReception "
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl className="fill-primary dark:fill-white"/> &nbsp;Liste
              </Link>
              {userRole && ['super-admin', 'admin'].includes(userRole) && (
              <Link
                    href="/bonReception/add"
                    className="flex items-center p-2 space-x-3 rounded-md"
                  >
                    <IoMdAddCircleOutline className="fill-primary dark:fill-white"/>
                    &nbsp;Ajouter
                  </Link>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
              <TfiUser className="fill-primary dark:fill-white"/>
                <span>Clients</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/clients"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl className="fill-primary dark:fill-white"/> &nbsp;Liste
              </Link>
            </AccordionContent>
          </AccordionItem>
          {userRole && ['super-admin', 'admin'].includes(userRole) && (
          <AccordionItem value="item-7">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <GiFactory className="fill-primary dark:fill-white"/>
                <span>Fournisseurs</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/fournisseurs "
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl className="fill-primary dark:fill-white"/> &nbsp;Liste
              </Link>
            </AccordionContent>
          </AccordionItem>
          )}
          <AccordionItem value="item-8">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <FaBoxes className="fill-primary dark:fill-white"/>
                <span>Produits</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/produits "
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl className="fill-primary dark:fill-white"/> &nbsp;Liste
              </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-9" className="py-4">
            <Link
              href="/chauffeurs"
              className=" text-sm font-medium flex items-center space-x-2 hover:underline"
            >
            <GiSteeringWheel className="fill-primary dark:fill-white"/>
                <span>Chauffeurs</span>
            </Link>
          </AccordionItem>
          <AccordionItem value="item-10" className="py-4">
            <Link
              href="/vehicles"
              className="text-sm font-medium flex items-center space-x-2 hover:underline"
            >
            <MdCommute className="fill-primary dark:fill-white"/>
                <span>Vehicules</span>
            </Link>
          </AccordionItem>
      
        </Accordion>
      </div>

    
  );
}