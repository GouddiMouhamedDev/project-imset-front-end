import axios, { AxiosError } from 'axios';
import { getAccessTokenFromStorage } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const token = getAccessTokenFromStorage();

const config = {
  headers: {
    'Content-Type': 'application/json',
    'x-auth-token': `${token}`,
  },
};

// Fonction pour récupérer les données des produits
export const getProduitsData = async () => {
  const getProduitsUrl = `${BASE_URL}/produits`;
  try {
    const response = await axios.get(getProduitsUrl, config);
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données des produits :", error);
  }
};

// Fonction pour récupérer les données d'un produit spécifique
export const getOneProduitData = async (id: string) => {
  const getProduitUrl = `${BASE_URL}/produits/${id}`;
  try {
    const response = await axios.get(getProduitUrl, config);
    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données du produit :", error);
  }
};

// Fonction pour supprimer un produit
export const deleteOneProduitData = async (id: any) => {
  const deleteUrl = `${BASE_URL}/produits/${id}`;
  try {
    const response = await axios.delete(deleteUrl, config);
    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la suppression du produit :", error);
  }
};

// Fonction pour mettre à jour les données d'un produit
export const updateOneProduitData = async (id: any, updatedData: any) => {
  const putUrl = `${BASE_URL}/produits/${id}`;
  try {
    const response = await axios.put(putUrl, updatedData, config);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Erreur de la requête :", axiosError.response?.data);
      return axiosError.response;
    } else {
      console.error("Une erreur s'est produite lors de la mise à jour des données du produit :", error);
      return error;
    }
  }
};

// Fonction pour créer un nouveau produit
export const createProduit = async (produitData: any) => {
  const createUrl = `${BASE_URL}/produits`;
  try {
    const response = await axios.post(createUrl, produitData, config);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Erreur de la requête :", axiosError.response?.data);
      return axiosError.response;
    } else {
      console.error("Une erreur s'est produite lors de la création du produit :", error);
      return error;
    }
  }
};
