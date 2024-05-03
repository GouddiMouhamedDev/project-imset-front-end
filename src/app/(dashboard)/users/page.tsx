"use client";
import React, { useEffect, useState } from "react";
import { getUsersData } from "@/api/users";

import { UsersData } from "@/interface/users";
import Blueloading from "@/components/loading";
import MultiDataTable from "@/components/multiDataTable";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/searchBar";
import Link from "next/link";
import { User } from "@/types/user";
import { auth, getAccessTokenFromStorage, getUserInfoFromStorage, removeStorage } from "@/api/auth";
import { useRouter } from "next/navigation";

export default function Users() {
  const userRole = getUserInfoFromStorage()?.role;
  const isAdmin = ["super-admin", "admin"].includes(userRole!);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const fetchData = async () => {
    try {
   
      
      const data = await getUsersData();
      const formattedData = data.map((item: User) => ({
            _id: item._id,
            name: item.name,
            email: item.email,
            role: item.role,
        }));
        
        setUsersData(formattedData);
        
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données :",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchDataAfterAuth = async () => {
      const isAuthenticated = auth(["admin", "super-admin"]);
      if (isAuthenticated) {
        fetchData();
      }else{
        removeStorage();
        router.push('/login');
      }
    };
  
    fetchDataAfterAuth();
  }, []);
  

  if (isLoading) {
    return <Blueloading />;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="border-b-2 border-slate-400 pb-4 mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Liste des utilisateurs</h1>
        {isAdmin ? (
        <Button >
      
        <Link href={"/users/add"}>Ajouter un utilisateur</Link>
    
    </Button>
  ) : (
    <Button disabled >
      
        <Link href={"/users/add"}>Ajouter un utilisateur</Link>
    
    </Button>
  )}
      </div>
      <SearchBar />
      <MultiDataTable data={usersData} To="users" />
    </div>
  );
}
