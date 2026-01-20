export interface User {
  id: string;
  email: string;
  pseudo: string;
  firstName: string;
  lastName: string;
  role: 'user';
  createdAt: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends UserCredentials {
  pseudo: string;
  firstName: string;
  lastName: string;
}
