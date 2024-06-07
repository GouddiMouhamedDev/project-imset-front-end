import axios, { AxiosError } from 'axios';
import { getAccessTokenFromStorage } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const token = getAccessTokenFromStorage();

// Fonction pour récupérer les données des fournisseurs
export const getFournisseursData = async () => {
  const getFournisseursUrl = `${BASE_URL}/fournisseurs`;
  try {
    const response = await axios.get(getFournisseursUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données des fournisseurs :", error);
  }
};

// Fonction pour récupérer les données d'un fournisseur spécifique
export const getOneFournisseurData = async (id: string) => {
  const getFournisseurUrl = `${BASE_URL}/fournisseurs/${id}`;
  try {
    const response = await axios.get(getFournisseurUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données du fournisseur :", error);
  }
};

// Fonction pour supprimer un fournisseur
export const deleteOneFournisseurData = async (id: any) => {
  const deleteUrl = `${BASE_URL}/fournisseurs/${id}`;
  try {
    const response = await axios.delete(deleteUrl, {
      headers: {
        "x-auth-token": `${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la suppression du fournisseur :", error);
  }
};


// Fonction pour mettre à jour les données d'un fournisseur
export const updateOneFournisseurData = async (id: any, updatedData: any) => {
  const putUrl = `${BASE_URL}/fournisseurs/${id}`;
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
      console.error("Une erreur s'est produite lors de la mise à jour des données du fournisseur :", error);
      return error;
    }
  }
};

// Fonction pour créer un nouveau fournisseur
export const createFournisseur = async (fournisseurData: any) => {
  const createUrl = `${BASE_URL}/fournisseurs`;
  try {
    const response = await axios.post(createUrl, fournisseurData, {
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
      console.error("Une erreur s'est produite lors de la création du fournisseur :", error);
      return error;
    }
  }
};
