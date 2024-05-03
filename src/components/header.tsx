import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { useState, useEffect } from "react";
import { getUserInfoFromStorage, removeStorage } from "@/api/auth";
import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {DropdownMenu,DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator,DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
  import { GrLogout } from "react-icons/gr";
import { ModeToggle } from "./modeToggle";

export default function Header() {
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

  return (
    <header className="flex justify-between items-center rounded-lg py-4 px-8">
      <h1 className="">Logo</h1>
      <Link href={"/"} className="text-2xl font-bold ">
        Header(dev)
      </Link>
      <div className="flex  items-center space-x-2 ">
      <h2 className="">{userInfo?.name}</h2>
        <DropdownMenu >
  <DropdownMenuTrigger asChild>
    <Avatar className="border-2 hover:opacity-75">
          <AvatarImage src="/img/Avatar-removebg-preview.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <Link href={`/users/${userInfo?._id}`}
      className="flex items-center space-x-2">
        <CgProfile /><span>Profil</span>
      </Link>
     
</DropdownMenuItem>

  

    <DropdownMenuItem> <Link
           href="/login"
           onClick={handleLogout}
           className="flex items-center space-x-2">
           <GrLogout />
           <span>Déconnexion</span>
         </Link></DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
<ModeToggle />
       
      </div>
    </header>
  );
}
