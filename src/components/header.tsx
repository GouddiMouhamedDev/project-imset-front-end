import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUserInfoFromStorage } from '@/api/auth';
import { User } from '@/types/user';

export default function Header() {
    const [userInfo, setUserInfo] = useState<User | null>(null);

    useEffect(() => {
        // Récupération des informations de l'utilisateur après la connexion
        const fetchUserInfo = async () => {
            try {
                const userData = await getUserInfoFromStorage();
                if (userData) {
                    setUserInfo(userData);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des informations utilisateur : ', error);
            }
        };

        fetchUserInfo(); // Appel de la fonction pour récupérer les infos utilisateur
    }, []);

    return (
        <header className="flex justify-between items-center bg-indigo-500 rounded-lg py-4 px-8">
            <h1 className='text-gray-50'>Logo</h1>
            <Link href={'/'} className='text-2xl font-bold text-gray-50' >Header</Link>
            <div className='flex space-x-2'>
                <h1 className='text-gray-50'>image(dev) </h1>
                <div>
                <h2 className='text-gray-50'>email :{userInfo?.email}</h2>
                <h2 className='text-gray-50'>utilisateur :{userInfo?.name}</h2>
                <h2 className='text-gray-50'>Role :{userInfo?.role}</h2>
                </div>
          
            </div>
        </header>
    );
}
