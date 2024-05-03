
"use client";
import { auth, removeStorage } from "@/api/auth";
import { UserForm } from "@/components/userForm"
import { useEffect } from "react";
import { useRouter } from "next/navigation";



export default function Register() {
  const router = useRouter();
  useEffect(() => {
    const isAuthenticated = auth(["admin","super-admin"]);
    if(!isAuthenticated) {
      removeStorage();
      router.push('/login');
    }
  },[]);
  
  return (
   
      <div className="lg:p-8 relative">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
            Créer un compte
            </h1>
          </div>
          <UserForm  customRoute="/users"/>
        </div>
      </div>
    
  )
}
