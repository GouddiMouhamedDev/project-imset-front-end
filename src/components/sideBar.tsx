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
import { MdCommute, MdLockReset } from "react-icons/md";
import { GiSteeringWheel } from "react-icons/gi";
import { TbTruckLoading } from "react-icons/tb";
import { FaBoxes } from "react-icons/fa";
import { getUserInfoFromStorage} from "@/api/auth";
import { FaFileAlt } from "react-icons/fa";
import { Card } from "./ui/card";
  




export default function Sidebar() {
  

  const userRole = getUserInfoFromStorage()?.role;
  const isAdmin = ["super-admin", "admin", "user"].includes(userRole!);

  return (
    <Card className="w-1/6 hidden md:flex flex-col p-3 shadow h-screen sticky mt-3 ml-2 ">
      <div className="space-y-3">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 hover:underline"
            >
              <AiOutlineDashboard />
              <span>Dash(D)</span>
            </Link>
          </AccordionItem>
          <AccordionItem value="item-2">  
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <LuSettings />
                <span>Settings(D)</span>
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
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <FiUsers />
                <div/>
                <span>Utilisateurs  </span>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              {isAdmin && (
                <>
                  <Link
                    href="/users"
                    className="flex items-center p-2 space-x-2 rounded-md"
                  >
                    <FaListOl />
                    &nbsp;Liste
                  </Link>

                  <Link
                    href="/users/add"
                    className="flex items-center p-2 space-x-3 rounded-md"
                  >
                    <IoMdAddCircleOutline />
                    &nbsp;Ajouter
                  </Link>
                </>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <MdCommute />
                <span>Vehicules(T)</span>
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

          <AccordionItem value="item-5">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <MdCommute />
                <span>Clients(T)</span>
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

          <AccordionItem value="item-6">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <GiSteeringWheel />
                <span>Chauffeurs(T)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/chauffeurs"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl /> &nbsp;List
              </Link>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <TbTruckLoading />
                <span>Fournisseurs(T)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/fournisseurs "
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl /> &nbsp;List
              </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <FaBoxes />
                <span>Produits(T)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/produits "
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl /> &nbsp;List
              </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-9">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <FaFileAlt />
                <span>Bon Commande(D)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/bonCommande "
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl /> &nbsp;List
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
          <AccordionItem value="item-10">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <FaFileAlt />
                <span>Bon Livraison(D)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Link
                href="/bonLivraison "
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <FaListOl /> &nbsp;List
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
        </Accordion>
      </div>

    </Card>
  );
}