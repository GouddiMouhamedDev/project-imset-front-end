import axios, { AxiosError } from 'axios';
import { getAccessTokenFromStorage} from './auth';



const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const token=getAccessTokenFromStorage();




//fonction get des véhicules
export const getVehiclesData = async () => {
  const getVehiclesUrl = `${BASE_URL}/vehicules`;
  try {
    const response = await axios.get(getVehiclesUrl,{
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });;
    return response.data; 
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données :", error);
  }
};

// fonction get un véhicule
export const getOneVehiclesData = async (id: any) => {
  const getUserUrl = `${BASE_URL}/vehicules/${id}`;
  try {
    const response = await axios.get(getUserUrl,{
      headers:{
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,

      }
   } );
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données :", error);
  }

};

// Fonction pour supprimer un véhicule
export const deleteOneVehicleData = async (id: any) => {
  const deleteUrl = `${BASE_URL}/vehicules/${id}`;
  try {
    const response = await axios.delete(deleteUrl, {
      headers: {
        "x-auth-token": `${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la suppression du véhicule :",
      error
    );
  }
};
// Fonction pour supprimer list des véhicules
export const vehiclesBulkDelete = async (vehiculesIds: []) => {
  const deleteUrl = `${BASE_URL}bulk-delete-vehicles/`;
  try {
    const response = await axios.delete(deleteUrl);
    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la suppression des véhicules :", error);
  }
}

// Fonction pour mettre à jour un véhicule avec une requête PUT
export const updateOneVehiclesData = async (id: any, updatedData: any) => {
  const putUrl = `${BASE_URL}/vehicules/${id}`;
  
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
      console.error("Une erreur s'est produite lors de la mise à jour des données de l'utilisateur :", error);
      return error;
    }
  }
};

// Fonction pour mettre à jour un véhicule avec une requête PATCH
export const updateVehicleWithPatch = async (id: any, updatedData: any) => {
  const patchUrl = `${BASE_URL}${id}/update/`;
  try {
    const response = await axios.patch(patchUrl, updatedData);
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la mise à jour du véhicule :", error);
  }
};

// Fonction pour créer un nouveau véhicule
export const createVehicle = async (vehicleData: any) => {
  const createUrl = `${BASE_URL}/vehicules`;
  try {
    const response = await axios.post(createUrl, vehicleData, {
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
      console.error("Une erreur s'est produite lors de la création du véhicule :", error);
      return error;
    }
  }
};

