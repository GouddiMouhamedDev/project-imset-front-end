import axios, { AxiosError } from 'axios';
import { getAccessTokenFromStorage } from './auth';

const BASE_URL = "http://localhost:4000/api";
const token = getAccessTokenFromStorage();

// Fonction pour récupérer les données des bons de livraison
export const getBonLivraisonsData = async () => {
  const getBonLivraisonsUrl = `${BASE_URL}/bon-livraison`;
  try {
    const response = await axios.get(getBonLivraisonsUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données des bons de livraison :", error);
  }
};

// Fonction pour récupérer les données d'un bon de livraison spécifique
export const getOneBonLivraisonData = async (id: any) => {
  const getOneBonLivraisonUrl = `${BASE_URL}/bon-livraison/${id}`;
  try {
    const response = await axios.get(getOneBonLivraisonUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données du bon de livraison :", error);
  }
};

// Fonction pour supprimer un bon de livraison
export const deleteBonLivraisonData = async (id: any) => {
  const deleteUrl = `${BASE_URL}/bon-livraison/${id}`;
  try {
    const response = await axios.delete(deleteUrl, {
      headers: {
        "x-auth-token": `${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la suppression du bon de livraison :", error);
  }
};

// Fonction pour mettre à jour les données d'un bon de livraison
export const updateBonLivraisonData = async (id: any, updatedData: any) => {
  const putUrl = `${BASE_URL}/bon-livraison/${id}`;
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
      console.error("Une erreur s'est produite lors de la mise à jour des données du bon de livraison :", error);
      return error;
    }
  }
};

// Fonction pour créer un nouveau bon de livraison
export const createBonLivraison = async (bonLivraisonData: any) => {
  const createUrl = `${BASE_URL}/bon-livraison`;
  try {
    const response = await axios.post(createUrl, bonLivraisonData, {
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
      console.error("Une erreur s'est produite lors de la création du bon de livraison :", error);
      return error;
    }
  }
};
