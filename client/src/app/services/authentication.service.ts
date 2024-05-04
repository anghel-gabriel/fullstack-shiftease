import { Injectable } from "@angular/core";
import {
  Auth,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
} from "@angular/fire/auth";
import { Firestore, doc, setDoc, getDoc } from "@angular/fire/firestore";
import { RegisterInterface, UserInterface } from "../utils/interfaces";
import { BehaviorSubject, Observable } from "rxjs";
import { defaultPhotoURL } from "../utils/defaultProfileImage";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private loggedUser = new BehaviorSubject<any>(null);
  constructor(
    public auth: Auth,
    public firestore: Firestore,
    public http: HttpClient
  ) {}

  getLoggedUser() {
    return this.loggedUser.asObservable();
  }

  async logOut() {
    this.http
      .get("http://localhost:8080/api/auth/log-out", {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          this.loggedUser.next(null);
        },
        error: (error) => console.log(error),
      });
  }

  async updateUserPhoto(userId: string, photoURL: string) {
    const userRef = doc(this.firestore, `users/${userId}`);
    try {
      await setDoc(userRef, { photoURL: photoURL }, { merge: true });
      const updatedUserDoc = await getDoc(userRef);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async removeUserPhoto(userId: string) {
    if (!userId) {
      throw new Error("User ID is required to remove photo.");
    }
    const userRef = doc(this.firestore, `users/${userId}`);
    try {
      await setDoc(userRef, { photoURL: defaultPhotoURL }, { merge: true });
      const updatedUserDoc = await getDoc(userRef);
    } catch (error: any) {
      throw new Error(`Error removing user photo: ${error.message}`);
    }
  }

  async editProfile(userId: string, newData: UserInterface) {
    try {
      if (!userId) return;
      const userRef = doc(this.firestore, `users/${userId}`);
      await setDoc(userRef, newData, { merge: true });
      const updatedUserDoc = await getDoc(userRef);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async changeEmail(newEmail: string) {
    try {
      const user = this.auth.currentUser;
      if (user) {
        await updateEmail(user, newEmail);
        const userRef = doc(this.firestore, `users/${user.uid}`);
        await setDoc(userRef, { email: newEmail }, { merge: true });
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async changePassword(newPassword: string) {
    try {
      if (this.auth.currentUser)
        await updatePassword(this.auth.currentUser, newPassword);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async sendPasswordResetEmail(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  onUserStateChanged(fn: any) {
    return this.auth.onAuthStateChanged(fn);
  }

  async getEmployeeDataBackend(userId: string) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/get-user/${userId}/`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch shifts: ${error.message || error.toString()}`
      );
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

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async registerBackend(registerData: RegisterInterface) {
    try {
      await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        body: JSON.stringify(registerData),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async loginBackend(
    usernameOrEmail: string,
    password: string,
    loginMethod: string
  ) {
    console.log(usernameOrEmail);
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          usernameOrEmail: usernameOrEmail,
          password: password,
          loginMethod: loginMethod,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      if (!response.ok) {
        console.log(response);
        const errorMsg = await response.text();
        console.log(errorMsg);
        throw new Error(errorMsg);
      } else {
        const res = await response.json();
        this.loggedUser.next(res.user);
        console.log("obiect user", res.user);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async checkAuthentication() {
    this.http
      .get("http://localhost:8080/api/auth/validate-session", {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.loggedUser.next(res);
        },
        error: () => this.loggedUser.next(null),
      });
  }
}
