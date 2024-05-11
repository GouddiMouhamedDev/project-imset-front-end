"use client";
import { auth, removeStorage } from "@/api/auth";
import { useEffect} from "react";
import { useRouter } from "next/navigation";









export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = auth(["admin", "super-admin", "user"]);
    if (!isAuthenticated) {
      removeStorage();
      router.push('/login');
    }
  }, []);

  return (
    <main>
       <h1>Bienvenue dans votre tableau de bord</h1> 
    </main>
  )}
  