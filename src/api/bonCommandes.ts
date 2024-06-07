import axios, { AxiosError } from 'axios';
import { getAccessTokenFromStorage } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const token = getAccessTokenFromStorage();

// Fonction pour récupérer les données des bonnes commandes
export const getBonCommandesData = async () => {
  const getBonCommandesUrl = `${BASE_URL}/bon-commande`;
  try {
    const response = await axios.get(getBonCommandesUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données des bonnes commandes :", error);
  }
};



// Fonction pour récupérer les données d'un bon de commande spécifique
export const getOneBonCommandeData = async (id: any) => {
  const getOneBonCommandeUrl = `${BASE_URL}/bon-commande/${id}`;
  try {
    const response = await axios.get(getOneBonCommandeUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données du bon de commande :", error);
  }
};

// Fonction pour supprimer une bonne commande
export const deleteBonCommandeData = async (id: any) => {
  const deleteUrl = `${BASE_URL}/bon-commande/${id}`;
  try {
    const response = await axios.delete(deleteUrl, {
      headers: {
        "x-auth-token": `${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la suppression de la bonne commande :", error);
  }
};

// Fonction pour mettre à jour les données d'une bonne commande
export const updateBonCommandeData = async (id: any, updatedData: any) => {
  const putUrl = `${BASE_URL}/bon-commande/${id}`;
  try {
    const response = await axios.put(putUrl, updatedData, {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": `${token}`,
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Erreur de la requête :", axiosError.response?.data);
      return axiosError.response;
    } else {
      console.error("Une erreur s'est produite lors de la mise à jour des données de la bonne commande :", error);
      return error;
    }
  }
};

// Fonction pour créer une nouvelle bonne commande
export const createBonCommande = async (bonCommandeData: any) => {
  const createUrl = `${BASE_URL}/bon-commande`;
  try {
    const response = await axios.post(createUrl, bonCommandeData, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Erreur de la requête :", axiosError.response?.data);
      return axiosError.response;
    } else {
      console.error("Une erreur s'est produite lors de la création de la bonne commande :", error);
      return error;
    }
  }
};
