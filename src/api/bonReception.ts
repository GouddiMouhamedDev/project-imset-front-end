import axios, { AxiosError } from 'axios';
import { getAccessTokenFromStorage } from './auth';

const BASE_URL = "http://localhost:4000/api";
const token = getAccessTokenFromStorage();

// Fonction pour récupérer les données des bons de réception
export const getBonReceptionsData = async () => {
  const getBonReceptionsUrl = `${BASE_URL}/bon-reception`;
  try {
    const response = await axios.get(getBonReceptionsUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données des bons de réception :", error);
  }
};

// Fonction pour récupérer les données d'un bon de réception spécifique
export const getOneBonReceptionData = async (id: any) => {
  const getOneBonReceptionUrl = `${BASE_URL}/bon-reception/${id}`;
  try {
    const response = await axios.get(getOneBonReceptionUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données du bon de réception :", error);
  }
};

// Fonction pour supprimer un bon de réception
export const deleteBonReceptionData = async (id: any) => {
  const deleteUrl = `${BASE_URL}/bon-reception/${id}`;
  try {
    const response = await axios.delete(deleteUrl, {
      headers: {
        "x-auth-token": `${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la suppression du bon de réception :", error);
  }
};

// Fonction pour mettre à jour les données d'un bon de réception
export const updateBonReceptionData = async (id: any, updatedData: any) => {
  const putUrl = `${BASE_URL}/bon-reception/${id}`;
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
      console.error("Une erreur s'est produite lors de la mise à jour des données du bon de réception :", error);
      return error;
    }
  }
};

// Fonction pour créer un nouveau bon de réception
export const createBonReception = async (bonReceptionData: any) => {
  const createUrl = `${BASE_URL}/bon-reception`;
  try {
    const response = await axios.post(createUrl, bonReceptionData, {
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
      console.error("Une erreur s'est produite lors de la création du bon de réception :", error);
      return error;
    }
  }
};
