"use client";

import { BonLivraisonForm } from "@/components/blForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, removeStorage } from "@/api/auth";




export default function AddBl(){
    const router = useRouter();


    useEffect(() => {
            const isAuthenticated = auth(["admin", "super-admin","user"]);
            if (!isAuthenticated) {
              removeStorage();
              router.push("/login");
      }}, []);
    return(

        <>
        <BonLivraisonForm/>
        </>
    );
}