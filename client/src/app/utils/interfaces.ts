export interface RegisterInterface {
  emailAddress: string;
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
  role: "user" | "admin";
  photoURL: string;
}

export interface IShift {
  startTime: string;
  endTime: string;
  hourlyWage: number;
  workplace: string;
  comments: string;
}
