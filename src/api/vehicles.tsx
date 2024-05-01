import axios from 'axios';

const baseUrl = 'https://fleet-yuxn.onrender.com/api/vehicles/';

//fonction get des véhicules
export const getVehiclesData = async () => {

  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données :", error);
  }
};

// fonction get un véhicule
export const getOneVehiclesData = async (id: any) => {
  const getUserUrl = `${baseUrl}${id}`;
  try {
    const response = await axios.get(getUserUrl)
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données :", error);
  }

};

// Fonction pour supprimer un véhicule
export const deleteVehicle = async (id: any) => {
  const deleteUrl = `${baseUrl}${id}/delete/`;
  try {
    const response = await axios.delete(deleteUrl);
    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la suppression du véhicule :", error);
  }
};
// Fonction pour supprimer list des véhicules
export const vehiclesBulkDelete = async (vehiculesIds: []) => {
  const deleteUrl = `${baseUrl}bulk-delete-vehicles/`;
  try {
    const response = await axios.delete(deleteUrl);
    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la suppression des véhicules :", error);
  }
}

// Fonction pour mettre à jour un véhicule avec une requête PUT
export const updateVehicleWithPut = async (id: any, updatedData: any) => {
  const putUrl = `${baseUrl}${id}/update/`;
  try {
    const response = await axios.put(putUrl, updatedData);
    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la mise à jour du véhicule :", error);
  }
};

// Fonction pour mettre à jour un véhicule avec une requête PATCH
export const updateVehicleWithPatch = async (id: any, updatedData: any) => {
  const patchUrl = `${baseUrl}${id}/update/`;
  try {
    const response = await axios.patch(patchUrl, updatedData);
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la mise à jour du véhicule :", error);
  }
};

// Fonction pour créer un nouveau véhicule
export const createVehicle = async (vehicleData: any) => {
  const createUrl = `${baseUrl}create/`;
  try {
    console.log(vehicleData)
    const response = await axios.post(createUrl, vehicleData);

    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la création du véhicule :", error);
  }
};
