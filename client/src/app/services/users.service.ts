import { Injectable } from "@angular/core";
import { IUser, IRegister } from "../utils/interfaces";
import { BehaviorSubject, Observable } from "rxjs";
import { defaultPhotoURL, root } from "../utils/URLs";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private loggedUser = new BehaviorSubject<any>(null);

  getLoggedUser(): Observable<IUser> {
    return this.loggedUser.asObservable();
  }

  // REGULAR USERS METHODS

  async updateUserPhoto(photoURL: string): Promise<void> {
    const currentLoggedUserData = await this.loggedUser.getValue();
    this.loggedUser.next({ ...currentLoggedUserData, photoURL });
  }

  async removeUserPhoto(): Promise<void> {
    const currentLoggedUserData = await this.loggedUser.getValue();
    this.loggedUser.next({
      ...currentLoggedUserData,
      photoURL: defaultPhotoURL,
    });
  }

  async setNewPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(root + `/api/auth/reset-password/${token}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword: newPassword }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async editProfile(newData: IUser): Promise<void> {
    try {
      const response = await fetch(root + `/api/user/profile/update-profile/`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(newData),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
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
          userRole: currentData.userRole,
        };
        this.loggedUser.next(newUserData);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async changeEmail(newEmail: string): Promise<void> {
    try {
      const response = await fetch(root + `/api/user/profile/change-email/`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({
          emailAddress: newEmail,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);
      const currentData = await this.loggedUser.getValue();
      this.loggedUser.next({ ...currentData, emailAddress: newEmail });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async changePassword(newPassword: string): Promise<void> {
    try {
      const response = await fetch(
        root + `/api/user/profile/change-password/`,
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
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      const response = await fetch(root + "/api/auth/request-reset-password", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          email,
        }),
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

  async checkCredentials(
    emailAddress: string,
    username: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    try {
      const response = await fetch(root + "/api/auth/credentials", {
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
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async register(registerData: IRegister): Promise<void> {
    try {
      const response = await fetch(root + "/api/auth/register", {
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

  async login(
    usernameOrEmail: string,
    password: string,
    loginMethod: string
  ): Promise<void> {
    try {
      const response = await fetch(root + "/api/auth/login", {
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

  async checkAuthentication(): Promise<void> {
    try {
      const response = await fetch(root + "/api/auth/validate-session", {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      this.loggedUser.next(result.data);
    } catch (error) {
      this.loggedUser.next(null);
    }
  }

  async logOut(): Promise<void> {
    try {
      const response = await fetch(root + "/api/auth/log-out", {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      this.loggedUser.next(null);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // ADMIN USERS METHOD

  async getEmployeeData(userId: string): Promise<IUser> {
    try {
      const response = await fetch(
        root + `/api/admin/profile/get-user/${userId}/`,
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

  async editProfileAsAdmin(employeeId: string, newData: IUser): Promise<void> {
    try {
      const response = await fetch(
        root + `/api/admin/profile/update-profile/${employeeId}`,
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
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
