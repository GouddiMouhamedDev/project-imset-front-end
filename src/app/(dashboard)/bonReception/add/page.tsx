"use client"

import { auth, removeStorage } from "@/api/auth";
import { BonReceptionForm } from "@/components/brForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";





export default function AddBr(){
    const router = useRouter();


    useEffect(() => {
            const isAuthenticated = auth(["admin", "super-admin"]);
            if (!isAuthenticated) {
              removeStorage();
              router.push("/login");
      }}, []);
    return(

        <>
        <BonReceptionForm/>
        </>
    );
}