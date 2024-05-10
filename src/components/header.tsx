"use client"
import React, { useState, useCallback, useEffect } from "react";
import MediaPlayer from "@/components/MediaPlayer/MediaPlayer";
import { ModeToggle } from "./modeToggle";
import { Card } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { RiLogoutBoxFill } from "react-icons/ri";
import { getUserInfoFromStorage, removeStorage } from "@/api/auth";
import { User } from "@/types/user";
import { CgProfile } from "react-icons/cg";

export default function Header() {
  const [selectedChannelIndex, setSelectedChannelIndex] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const userRole = getUserInfoFromStorage()?.role;
  const isAdmin = ["super-admin", "admin", "user"].includes(userRole!);
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
  const data = [
    {
      "id": "772df529-de8d-462d-88c1-e00ef66ff2b5",
      "url": "https://s42.myradiostream.com/29400/listen.mp3",
      "cover": "https://media.info/l/f/7/7459.1623551191.png",
      "title": "Thornbury",
      "program": "Best of the week"
    },
    {
      "id": "93747643-930b-4b44-9465-2c7714fbf352",
      "url": "http://uplink.duplexfx.com:8062",
      "cover": "https://www.radio.es/images/broadcasts/07/d6/105208/1/c300.png",
      "title": "108.fm",
      "program": "The Beatles Channel"
    },
    {
      "id": "565c82bf-4981-4490-8074-bc5553f3abac",
      "url": "http://sc-disco.1.fm:8100",
      "cover": "https://www.radio.es/images/broadcasts/e5/6b/1373/2/c300.png",
      "title": "Disco Ball",
      "program": "Best of Disco Ball 70's-80's"
    },
    {
      "id": "mosaique-id",
      "url": "https://radio.mosaiquefm.net/mosalive",
      "cover": "http://mosaique-url.com/cover.jpg",
      "title": "Mosaique",
      "program": "Mosaique Program"
    }
  ];

  const handleChangeChannel = useCallback((forward: boolean) => {
    setSelectedChannelIndex((prevIndex) =>
      forward
        ? prevIndex < data.length - 1 ? prevIndex + 1 : 0 // Revenir au début de la liste si c'est la fin
        : prevIndex > 0 ? prevIndex - 1 : data.length - 1 // Passer au dernier élément si c'est le début
    );
  }, [data]);

  return (
      <Card className=" flex items-center   justify-around">
       {/*Media player */}
       <div className="flex items-center justify-between w-20 pl-2 transform scale-50">
          <MediaPlayer
            channel={data[selectedChannelIndex]}
            onChangeChannel={handleChangeChannel}
          />
        </div>
         {/*logo */}
        <img 
     className="hidden md:block md:mx-auto max-md:hidden md:mb-2 max-md:pl-2 max-sm:hidden"
        src="/img/logo1.png" 
        width={250} height={100}
         alt="Logo" />
  {/*AVATAR */}
<div className="">
<DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="border-2 hover:opacity-75 w-16  h-16 mr-3">
              <AvatarImage src="/img/Avatar-removebg-preview.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{userInfo?.name}</DropdownMenuLabel>
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
        </div>  
     
{/*bouton dark mode*/}
        <div className="pr-3">
        <ModeToggle />
      </div>

        
      </Card>
    
  );
}
