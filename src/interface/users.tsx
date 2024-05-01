export interface UsersData {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  idUser: number;
  
  }
  
  export interface OneUserData{
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    idUser: number;
  }

  export interface ResetFormData {
    email : string;
    oldPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
  }

  // Interface pour définir la structure des informations de l'utilisateur
export interface UserInfoResponse {
  image: string;
  name: string;
  // Ajoutez d'autres propriétés d'information de l'utilisateur si nécessaire
}

// Interface pour définir la structure de la réponse de la connexion utilisateur
export interface LoginResponse {
  token: string;
  userInfo: UserInfoResponse;
}