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
  _id: string;
  emailAddress: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: any;
  gender: any;
  userRole: "user" | "admin";
  photoURL: string;
}

export interface IShift {
  _id?: string;
  startTime: string | Date;
  endTime: string | Date;
  hourlyWage: number;
  workplace: string;
  comments: string;
  profit?: number;
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
