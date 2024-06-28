"use client"

import { BonCommandeForm } from "@/components/bcForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, removeStorage } from "@/api/auth";





export default function AddBc(){
    const router = useRouter();


    useEffect(() => {
            const isAuthenticated = auth(["admin", "super-admin","user"]);
            if (!isAuthenticated) {
              removeStorage();
              router.push("/login");
      }}, []);
    return(

        <>
        <BonCommandeForm/>
        </>
    );
}