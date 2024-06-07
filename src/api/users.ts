"use client"
import axios, { AxiosError } from 'axios';
import { getAccessTokenFromStorage} from './auth';

const BASE_URL="http://localhost:4000/api"
const token=getAccessTokenFromStorage();






export const activateEmail = async (token:string) => {
  const getActiveEmail = `${BASE_URL}/api/activate-email/${token}`;

  try {
    const response = await axios.get(getActiveEmail, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('Une erreur s\'est produite lors de l\'activation de l\'email :', error);

  }
};




export const getUsersData = async () => {
  const getUsersUrl = `${BASE_URL}/users`;
  try {
    const response = await axios.get(getUsersUrl,{
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données :", error);
  }
};
 



export const getOneUserData = async (id:any) => {
  const getUserUrl = `${BASE_URL}/users/${id}`;
  try {
    const response = await axios.get(getUserUrl,{
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données :", error);
  }

};



export const getOneUserName = async (id:any) => {
  const getUserUrl = `${BASE_URL}/users/name/${id}`;
  try {
    const response = await axios.get(getUserUrl,{
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des données :", error);
  }

};









export const deleteOneUserData= async (id:string)=>{
const deleteOneUserDataUrl=`${BASE_URL}/users/${id}`;
try {
  const response = await axios.delete(deleteOneUserDataUrl, {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': `${token}`,
    },
  });
  return response;
} catch (error) {
  console.error("Une erreur s'est produite lors de la suppression des données de l'utilisateur :", error);
}
};




export const postOneUserData = async (userData: any) => {
  const postOneUserDataUrl = `${BASE_URL}/users`;
  try {
    const response = await axios.post(postOneUserDataUrl, userData, {
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
      console.error('Une erreur s\'est produite lors de l\'envoi des données :', error);
      return error;
    }
  }
};
export const updateOneUserData = async (id: any, updatedUserData: any) => {

  const updateOneUserDataUrl = `${BASE_URL}/users/${id}`;
 
  try {
    const response = await axios.put(updateOneUserDataUrl, updatedUserData, {
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
      console.error("Une erreur s'est produite lors de la mise à jour des données de l'utilisateur :", error);
      return error;
    }
  }
};



/*
***************************************************************************************
export const pswReset = async ( email: string ,oldPassword: string,
   newPassword: string, newPasswordConfirm: string) => {
  const pswResetUrl = `${BASE_URL}/api/RequestPasswordReset/`;

  if (newPassword !== newPasswordConfirm) {
    console.error('Les nouveaux mots de passe ne correspondent pas.');
    return; 
  }

  try {
    const response = await axios.post(pswResetUrl, {
      email,
      oldPassword,
      newPassword,
      newPasswordConfirm,
    });
    console.log('Réinitialisation du mot de passe réussie !');
    return response.data;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la réinitialisation du mot de passe :", error);
  }
};


***************************************************************************************
export const usersBulkDelete = async (userIds:[]) => {
  const bulkDeleteUrl = `${BASE_URL}/api/auth/users/bulk-delete/`;

  try {
    const response = await axios.put(bulkDeleteUrl, {
      data: { userIds },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Suppression en vrac des utilisateurs réussie !');
    return response;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la suppression en vrac des utilisateurs :", error);
  }
};




*/