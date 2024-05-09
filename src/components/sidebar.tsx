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
import { useState, useEffect } from "react";
import { getUserInfoFromStorage, removeStorage } from "@/api/auth";
import { User } from "@/types/user";
import { CgProfile } from "react-icons/cg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiLogoutBoxFill } from "react-icons/ri";
import { Card } from "./ui/card";
export default function Sidebar() {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const handleLogout = () => {
    removeStorage();
  };
  useEffect(() => {
    // Récupération des informations de l'utilisateur après la connexion
    const fetchUserInfo = async () => {
      try {
        const userData = await getUserInfoFromStorage();
        if (userData) {
          setUserInfo(userData);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations utilisateur : ",
          error
        );
      }
    };

    fetchUserInfo(); // Appel de la fonction pour récupérer les infos utilisateur
  }, []);

  const userRole = getUserInfoFromStorage()?.role;
  const isAdmin = ["super-admin", "admin", "user"].includes(userRole!);

  return (
    <Card className="w-1/6 hidden md:flex flex-col p-3 shadow h-screen sticky mt-3 ml-2 ">
      <div className="flex flex-col items-center   space-y-10 pt-10 pb-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="border-2 hover:opacity-75 w-16  h-16">
              <AvatarImage src="/img/Avatar-removebg-preview.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href={`/users/${userInfo?._id}`}
                className="flex items-center space-x-2"
              >
                <CgProfile />
                <span>Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="/login"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <RiLogoutBoxFill />
                <span>Déconnexion</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="text-2xl font-serif font-bold text-center">
          {userInfo?.name}
        </div>
      </div>

      <br />
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
                <span>User(T)</span>
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
        </Accordion>
      </div>
    </Card>
  );
}
