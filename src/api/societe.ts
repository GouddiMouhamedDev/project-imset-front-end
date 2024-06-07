import axios, { AxiosError } from 'axios';
import { getAccessTokenFromStorage } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const token = getAccessTokenFromStorage();

// Fonction pour obtenir les informations de la société
export const getSocieteData = async () => {
  const getSocieteUrl = `${BASE_URL}/societe`;
  try {
    const response = await axios.get(getSocieteUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des informations de la société :", error);
    return error;
  }
};

// Fonction pour mettre à jour les informations de la société avec une requête PUT
export const updateSocieteData = async (updatedData: any) => {
  const putSocieteUrl = `${BASE_URL}/societe`;
  try {
    const response = await axios.put(putSocieteUrl, updatedData, {
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
      console.error("Une erreur s'est produite lors de la mise à jour des informations de la société :", error);
      return error;
    }
  }
};

