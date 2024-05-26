import { Injectable } from "@angular/core";
import { RegisterInterface, UserInterface } from "../utils/interfaces";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private loggedUser = new BehaviorSubject<any>(null);
  constructor(public http: HttpClient) {}

  getLoggedUser() {
    return this.loggedUser.asObservable();
  }

  // REGULAR USERS METHODS
  async updateUserPhoto(photoURL: string) {
    const currentLoggedUserData = await this.loggedUser.getValue();
    this.loggedUser.next({ ...currentLoggedUserData, photoURL });
  }

  async removeUserPhoto() {
    const currentLoggedUserData = await this.loggedUser.getValue();
    this.loggedUser.next({
      ...currentLoggedUserData,
      photoURL: "http://localhost:8080/pictures/defaultPhoto.png ",
    });
  }

  async setNewPasswordBackend(token: string, newPassword: string) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/reset-password/${token}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword: newPassword }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async editProfileBackend(newData: UserInterface) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/profile/update-profile/`,
        {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify(newData),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      else {
        const currentData = this.loggedUser.getValue();
        /* Keep the photoURL, emailAddress and userRole as they are not changed
         by submitting edit profile form */
        const newUserData = {
          ...newData,
          photoURL: currentData.photoURL,
          emailAddress: currentData.emailAddress,
          userRole: currentData.role,
        };
        this.loggedUser.next(newUserData);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async changeEmailBackend(newEmail: string) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/profile/change-email/`,
        {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({
            emailAddress: newEmail,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error: any) {
      throw new Error(
        `Failed to fetch shifts: ${error.message || error.toString()}`
      );
    }
  }

  async changePasswordBackend(newPassword: string) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/profile/change-email/`,
        {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({
            password: newPassword,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error: any) {
      throw new Error(
        `Failed to fetch shifts: ${error.message || error.toString()}`
      );
    }
  }

  async sendPasswordResetEmail(email: string) {
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/request-reset-password",
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            email,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async checkCredentialsBackend(
    emailAddress: string,
    username: string,
    password: string,
    confirmPassword: string
  ) {
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/credentials",
        {
          method: "POST",
          body: JSON.stringify({
            emailAddress,
            username,
            password,
            confirmPassword,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async register(registerData: RegisterInterface) {
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        body: JSON.stringify(registerData),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async login(usernameOrEmail: string, password: string, loginMethod: string) {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ usernameOrEmail, password, loginMethod }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      this.loggedUser.next(result.user);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async checkAuthenticationBackend() {
    this.http
      .get("http://localhost:8080/api/auth/validate-session", {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          this.loggedUser.next(res);
        },
        error: () => this.loggedUser.next(null),
      });
  }

  async logOutBackend() {
    this.http
      .get("http://localhost:8080/api/auth/log-out", {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          this.loggedUser.next(null);
        },
        error: (error) => {
          throw new Error(error);
        },
      });
  }

  // ADMIN USERS METHOD

  async getEmployeeData(userId: string) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/profile/get-user/${userId}/`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      else {
        return result.data;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async editProfileAsAdmin(employeeId: string, newData: UserInterface) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/profile/update-profile/${employeeId}`,
        {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify(newData),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      else {
        return result.data;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
