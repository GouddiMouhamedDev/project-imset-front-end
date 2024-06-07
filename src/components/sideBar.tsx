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
import { FiUsers } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { LuSettings } from "react-icons/lu";
import { MdCommute } from "react-icons/md";
import { GiSteeringWheel } from "react-icons/gi";
import { TbTruckLoading } from "react-icons/tb";
import { FaBoxes } from "react-icons/fa";
import { getUserInfoFromStorage} from "@/api/auth";
import { FaFileAlt } from "react-icons/fa";
import { Card } from "./ui/card";
import { TfiUser } from "react-icons/tfi";
import { BsBuildingFillGear } from "react-icons/bs";



export default function Sidebar() {
  

  const userRole = getUserInfoFromStorage()?.role;

  return (
   
      <div className="space-y-3">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="pb-4">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 hover:underline"
            >
              <AiOutlineDashboard />
              <span>Dash</span>
            </Link>
          </AccordionItem>
          <AccordionItem value="item-2">  
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <LuSettings />
                <span>Administration</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <>
              {userRole && userRole.includes('super-admin') && (
        <Link href="/societe" className="flex items-center p-2 space-x-3 rounded-md">
          <BsBuildingFillGear />
          &nbsp;Société
        </Link>
      )}
              <Link
                    href="/users"
                    className="flex items-center p-2 space-x-2 rounded-md"
                  >
                   <FiUsers />
                    &nbsp;Utilisateurs
                  </Link>
                  </>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <FaFileAlt />
                <span>Bon Commande</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/bonCommande "
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl /> &nbsp;Liste
              </Link>
              <Link
                    href="/bonCommande/add"
                    className="flex items-center p-2 space-x-3 rounded-md"
                  >
                    <IoMdAddCircleOutline />
                    &nbsp;Ajouter
                  </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-9">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <FaFileAlt />
                <span>Bon Livraison</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/bonLivraison "
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl /> &nbsp;Liste
              </Link>
              <Link
                    href="/bonLivraison/add"
                    className="flex items-center p-2 space-x-3 rounded-md"
                  >
                    <IoMdAddCircleOutline />
                    &nbsp;Ajouter
                  </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-10">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <FaFileAlt />
                <span>Bon Reception</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/bonReception "
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl /> &nbsp;Liste
              </Link>
              <Link
                    href="/bonReception/add"
                    className="flex items-center p-2 space-x-3 rounded-md"
                  >
                    <IoMdAddCircleOutline />
                    &nbsp;Ajouter
                  </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
              <TfiUser />
                <span>Clients</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/clients"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl /> &nbsp;Liste
              </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <TbTruckLoading />
                <span>Fournisseurs</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/fournisseurs "
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl /> &nbsp;Liste
              </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <FaBoxes />
                <span>Produits</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/produits "
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl /> &nbsp;Liste
              </Link>
            </AccordionContent>
          </AccordionItem>
            <AccordionItem value="item-5" className="py-4">
            <Link
              href="/chauffeurs"
              className="flex items-center space-x-2 hover:underline"
            >
            <GiSteeringWheel />
                <span>Chauffeurs</span>
            </Link>
          </AccordionItem>
          <AccordionItem value="item-3" className="py-4">
            <Link
              href="/vehicles"
              className="flex items-center space-x-2 hover:underline"
            >
            <MdCommute />
                <span>Vehicules(T)</span>
            </Link>
          </AccordionItem>
      
        </Accordion>
      </div>

    
  );
}