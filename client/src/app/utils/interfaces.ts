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
  _id?: string;
  startTime: string | Date;
  endTime: string | Date;
  hourlyWage: number;
  workplace: string;
  comments: string;
}

export interface IWorkplace {
  label: string;
  value: string;
  imgUrl: string;
}

export interface IData {
  labels: string[];
  datasets: {
    data: Array<number>;
    backgroundColor: string;
    hoverBackgroundColor: string;
  }[];
}

export interface IOptions {
  plugins: {
    legend: {
      labels: {
        usePointStyle: boolean;
        color: string;
      };
    };
  };
}
