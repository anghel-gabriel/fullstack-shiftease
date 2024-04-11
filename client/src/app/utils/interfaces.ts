export interface RegisterInterface {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: any;
  gender: any;
}

export interface UserInterface {
  uid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: any;
  gender: any;
  role: 'user' | 'admin';
  photoURL: string;
}
