import axios, { AxiosError } from 'axios';
import { getAccessTokenFromStorage } from './auth';


const BASE_URL = "http://localhost:4000/api";
const token = getAccessTokenFromStorage();

// Fonction pour obtenir les données des chauffeurs
export const getChauffeursData = async () => {
  const getChauffeursUrl = `${BASE_URL}/chauffeur`;
  try {
    const response = await axios.get(getChauffeursUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });
    return response; 
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données :", error);
  }
};


// Fonction pour obtenir les données d'un chauffeur spécifique
export const getOneChauffeurData = async (id: string)=> {
  const getOneChauffeurUrl = `${BASE_URL}/chauffeur/${id}`;
  try {
    const response = await axios.get(getOneChauffeurUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données d'un chauffeur :", error);
    return error;
  }
};

// Fonction pour supprimer un chauffeur
export const deleteOneChauffeurData = async (id: string) => {
  const deleteUrl = `${BASE_URL}/chauffeur/${id}`;
  try {
    await axios.delete(deleteUrl, {
      headers: {
        "x-auth-token": `${token}`,
      },
    });
  } catch (error) {
    console.error("Une erreur s'est produite lors de la suppression du chauffeur :", error);
    return error;
  }
};

// Fonction pour mettre à jour les données d'un chauffeur avec une requête PUT
export const updateOneChauffeurData = async (id: any, updatedData: any) => {
  const putUrl = `${BASE_URL}/chauffeur/${id}`;
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
      console.error("Une erreur s'est produite lors de la mise à jour des données du chauffeur :", error);
      return error;
    }
  }
};

// Fonction pour créer un nouveau chauffeur
export const createChauffeur = async (chauffeurData:any) => {
  const createUrl = `${BASE_URL}/chauffeur`;
  try {
    const response = await axios.post(createUrl, chauffeurData, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      }
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Erreur de la requête :", axiosError.response?.data);
      return axiosError.response;
    } else {
      console.error("Une erreur s'est produite lors de la création du chauffeur :", error);
      return error;
    }
  }
};
