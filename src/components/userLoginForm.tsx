"use client";
import * as React from "react";
import { useRouter } from 'next/navigation';
import { isTokenExpired, postUserLogin, getAccessTokenFromStorage, getUserRoleFromToken} from "@/api/auth";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserLoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserLoginForm({ className, ...props }: UserLoginFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // Authentification de l'utilisateur
      const loginResponse = await postUserLogin({ email, password });
      if (!loginResponse) {
        throw new Error('Erreur lors de la connexion');
      }

      // Vérification de l'expiration du token
      const token = getAccessTokenFromStorage();
      if (!token) {
        throw new Error('Token non disponible');
      }

      if (isTokenExpired(token)) {
        console.log('Token expiré');
        // Supprimer le token d'accès
        // Rediriger l'utilisateur vers la page de connexion
        router.push('/');
      } else {
        console.log('Token valide');
        const userRole = getUserRoleFromToken(token);
        if (userRole) {
          router.push('/dashboard');
        }

        // Rediriger l'utilisateur vers la page du tableau de bord
        
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la connexion :", error);
      // Afficher un message d'erreur à l'utilisateur ou gérer l'erreur de manière appropriée
    }

    setIsLoading(false);
  };
  

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="password"
              type="password"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Connexion avec Email
          </Button>
        </div>
      </form>
    </div>
  );
}
