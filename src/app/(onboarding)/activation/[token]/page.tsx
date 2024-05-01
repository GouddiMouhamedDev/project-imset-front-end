'use client'
import { useEffect, useState } from 'react';
import { activateEmail } from '@/api/users';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ActivateAccount( { params: { token } }: { params: { token: string } }) {
  const [activationMessage, setActivationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      activateEmail(token)
        .then(() => {
          setActivationMessage('Votre compte a été activé avec succès!');
        })
        .catch((error) => {
          setActivationMessage('La confirmation du compte a échoué.');
          console.error('Erreur lors de l\'activation du compte :', error);
        });
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow flex flex-col items-center space-y-4">
        {activationMessage ? (
          <div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>

            <p className="text-lg font-semibold text-green-500">{activationMessage}</p>

            <Link className="text-blue-500 hover:underline " href="/login">
              <Button>Login</Button>
            </Link>
          </div>
        ) : (

          <p className="text-lg font-semibold">Vérification en cours...</p>
        )}
      </div>
    </div>
  );
}
