export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}
