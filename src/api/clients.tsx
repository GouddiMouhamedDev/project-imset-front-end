import axios, { AxiosError } from 'axios';
import { getAccessTokenFromStorage } from './auth';

const BASE_URL = "http://localhost:3000/api";
const token = getAccessTokenFromStorage();

// Fonction pour récupérer les données des clients
export const getClientsData = async () => {
  const getClientsUrl = `${BASE_URL}/clients`;
  try {
    const response = await axios.get(getClientsUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données des clients :", error);
  }
};

// Fonction pour récupérer les données d'un client spécifique
export const getOneClientData = async (id:string) => {
  const getClientUrl = `${BASE_URL}/clients/${id}`;
  try {
    const response = await axios.get(getClientUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données du client :", error);
  }
};

// Fonction pour supprimer un client
export const deleteOneClientData = async (id: any) => {
  const deleteUrl = `${BASE_URL}/clients/${id}`;
  try {
    const response = await axios.delete(deleteUrl, {
      headers: {
        "x-auth-token": `${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la suppression du client :", error);
  }
};

// Fonction pour supprimer plusieurs clients
export const clientsBulkDelete = async (clientIds: []) => {
  const deleteUrl = `${BASE_URL}/bulk-delete-clients/`;
  try {
    const response = await axios.delete(deleteUrl, {
      data: { clientIds },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la suppression des clients :", error);
  }
};

// Fonction pour mettre à jour les données d'un client
export const updateOneClientData = async (id: any, updatedData: any) => {
  const putUrl = `${BASE_URL}/clients/${id}`;
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
      console.error("Une erreur s'est produite lors de la mise à jour des données du client :", error);
      return error;
    }
  }
};

// Fonction pour créer un nouveau client
export const createClient = async (clientData: any) => {
  const createUrl = `${BASE_URL}/clients`;
  try {
    const response = await axios.post(createUrl, clientData, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la création du client :", error);
  }
};
