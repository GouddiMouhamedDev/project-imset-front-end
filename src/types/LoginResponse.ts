import {User} from '@/types/user'

export interface LoginResponse {
    msg: string;
    token: string;
    user: User;
  }