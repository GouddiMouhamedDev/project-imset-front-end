"use client"
import { User } from '@/types/user';
import axios, { AxiosResponse } from 'axios';
import jwt from 'jsonwebtoken';



export interface LoginResponse {
  token: string;
  userInfo: User;
}

// URL de base de l'API
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Authentification
export const auth = (allowedRoles: (string | undefined)[]) => {
  // Vérifie si le code s'exécute dans un environnement de navigateur
  if (typeof window === 'undefined') {
    return false;
  }

  const userRole = getUserInfoFromStorage()?.role;

  // Vérifie si l'utilisateur a l'un des rôles autorisés
  if (!allowedRoles.includes(userRole)) {
    // L'utilisateur n'a pas les autorisations nécessaires
    return false;
  }
  
  // L'utilisateur a les autorisations nécessaires
  return true;
};
  


// Fonction pour enregistrer le token dans le stockage local
const saveTokenToStorage = (token: string) => {
  if (typeof window !== 'undefined') {
  localStorage.setItem('accessToken', token);
  }
};

// Fonction pour récupérer le token du stockage local
export const getAccessTokenFromStorage = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

// Fonction pour  formaté enregistrer les informations de l'utilisateur dans le stockage local
const saveUserInfoToStorage = (userInfo: User) => {
  const formattedUserInfo: User = {
    name: userInfo.name,
    email: userInfo.email,
    role: userInfo.role,
    _id: userInfo._id,
    avatar: userInfo.avatar,
  };
  localStorage.setItem('userInfo', JSON.stringify(formattedUserInfo));
};

// Fonction pour récupérer les informations de l'utilisateur depuis le stockage local
export const getUserInfoFromStorage = (): User | null => {
  if (typeof window !== 'undefined') {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      return JSON.parse(userInfoString);
    }
  }
  return null;
};


// Fonction pour supprimer le token du stockage local
export const removeStorage = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
  }
};

// Fonction pour décoder le token JWT
const decodeToken = (token: string) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Erreur lors du décodage du token :', error);
    return null;
  }
};

// Fonction pour vérifier si le token est expiré
export const isTokenExpired = (token: string): boolean => {
  const decodedToken = decodeToken(token);
  if (!decodedToken || typeof decodedToken === 'string') {
    return true; // Token invalide ou erreur lors du décodage
  }
  const currentTime = Math.floor(Date.now() / 1000);
  return typeof decodedToken.exp === 'number' && decodedToken.exp < currentTime;
};

// Fonction pour obtenir le rôle de l'utilisateur à partir du token
export const getUserRoleFromToken = (token: string): string | null => {
  const decodedToken = decodeToken(token);
  if (!decodedToken || typeof decodedToken === 'string') {
    return null; // Token invalide ou erreur lors du décodage
  }
  return decodedToken.role || null;
};

// Fonction pour effectuer une demande de connexion utilisateur
export const postUserLogin = async (credentials: { email: string; password: string }): Promise<LoginResponse | undefined> => {
  const postUserLoginUrl = `${BASE_URL}/auth/login-user`;
  try {
    const response: AxiosResponse<{ msg: string; token: string; user: User }> = await axios.post(postUserLoginUrl, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    

    // Enregistrer le token dans le stockage local
    saveTokenToStorage(response.data.token);
    // Enregistrer les informations de l'utilisateur dans le stockage local
    saveUserInfoToStorage(response.data.user);

    return { token: response.data.token, userInfo: response.data.user };
  } catch (error) {
    console.error("Une erreur s'est produite lors de la connexion :", error);
    return undefined;
  }
};