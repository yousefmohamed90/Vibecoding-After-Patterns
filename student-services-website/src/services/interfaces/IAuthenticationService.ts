export interface IAuthenticationService {
  login(username: string, password: string): Promise<string>;
  logout(): Promise<void>;
}

import { AuthToken } from '../security/TokenManager';
import { User } from '../../entities/User';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: 'STUDENT' | 'ADMIN';
}

export interface IAuthenticationService {
  authenticate(email: string, password: string): AuthToken;
  register(userData: RegisterDTO): User;
  validateToken(token: string): boolean;
  logout(token: string): void;
  changePassword(userID: string, oldPassword: string, newPassword: string): boolean;
  resetPassword(email: string): void;
}
