import { Injectable } from "@angular/core";
import {
  Firestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  collectionChanges,
  query,
  where,
} from "@angular/fire/firestore";
import { BehaviorSubject, switchMap } from "rxjs";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  loggedUserUid = new BehaviorSubject<string>("");
  private areMyShiftsLoading = new BehaviorSubject<boolean>(false);
  private areAllShiftsLoading = new BehaviorSubject<boolean>(false);
  private areAllUsersLoading = new BehaviorSubject<boolean>(false);
  private myShifts = new BehaviorSubject<[]>([]);
  private allShifts = new BehaviorSubject<any[]>([]);
  private allUsers = new BehaviorSubject<any[]>([]);

  constructor(
    public firestore: Firestore,
    private auth: AuthenticationService
  ) {
    console.log("constructor1");
    this.auth
      .getLoggedUser()
      .subscribe((userData) => this.loggedUserUid.next(userData?.uid));

    this.getShiftsBackend();
    this.getAllShiftsBackend();
    this.getAllUsersBackend();
  }

  // loading states for data fetching
  getAreMyShiftsLoading() {
    return this.areMyShiftsLoading.asObservable();
  }

  getAllUsersObs() {
    return this.allUsers.asObservable();
  }

  getAreAllShiftsLoading() {
    return this.areAllShiftsLoading.asObservable();
  }

  getAreAllUsersLoading() {
    return this.areAllUsersLoading.asObservable();
  }

  getMyShiftsObsBackend() {
    return this.myShifts.asObservable();
  }

  getAllShiftsObsBackend() {
    return this.allShifts.asObservable();
  }

  async addShiftBackend(shift: any) {
    try {
      await fetch("http://localhost:8080/api/shifts/add-shift", {
        method: "POST",
        body: JSON.stringify(shift),
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      await this.getShiftsBackend();
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async getShiftsBackend() {
    try {
      this.areMyShiftsLoading.next(true);
      const response = await fetch(
        `http://localhost:8080/api/shifts/get-user-shifts/`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.myShifts.next(data);
      console.log(data);
    } catch (error: any) {
      console.log("eroare mica", error);
      throw new Error(
        `Failed to fetch shifts: ${error.message || error.toString()}`
      );
    } finally {
      this.areMyShiftsLoading.next(false);
    }
  }

  public async getAllShiftsBackend() {
    try {
      this.areAllShiftsLoading.next(true);
      const response = await fetch(
        `http://localhost:8080/api/shifts/get-shifts/`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("data from all shifts", data);
      this.allShifts.next(data);
      console.log(data);
    } catch (error: any) {
      console.log("eroare mica", error);
      throw new Error(
        `Failed to fetch shifts: ${error.message || error.toString()}`
      );
    } finally {
      this.areAllShiftsLoading.next(false);
    }
  }

  async editShiftBackend(shiftId: string, newData: any) {
    try {
      await fetch(`http://localhost:8080/api/shifts/update-shift/${shiftId}`, {
        method: "PUT",
        body: JSON.stringify(newData),
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      await this.getShiftsBackend();
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async deleteShiftBackend(shiftId: string) {
    try {
      this.areMyShiftsLoading.next(true);
      const response = await fetch(
        `http://localhost:8080/api/shifts/delete-shift/${shiftId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.getShiftsBackend();
    } catch (error: any) {
      console.log("eroare mica", error);
      throw new Error(
        `Failed to fetch shifts: ${error.message || error.toString()}`
      );
    } finally {
      this.areMyShiftsLoading.next(false);
    }
  }

  private async getAllUsersBackend() {
    try {
      this.areAllUsersLoading.next(true);
      const response = await fetch(
        `http://localhost:8080/api/admin/get-all-users/`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("data from all shifts", data);
      this.allUsers.next(data);
      console.log(data);
    } catch (error: any) {
      console.log("eroare mica", error);
      throw new Error(
        `Failed to fetch shifts: ${error.message || error.toString()}`
      );
    } finally {
      this.areAllUsersLoading.next(false);
    }
  }

  async deleteShiftsByUserId(userId: string) {
    try {
      this.areAllShiftsLoading.next(true);
      const response = await fetch(
        `http://localhost:8080/api/admin/delete-user-shifts/${userId}/`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("data from all shifts", data);
      this.allShifts.next(data);
      console.log(data);
    } catch (error: any) {
      console.log("eroare mica", error);
      throw new Error(
        `Failed to fetch shifts: ${error.message || error.toString()}`
      );
    } finally {
      this.areAllShiftsLoading.next(false);
    }
  }

  async updateShiftAuthorFullName(userId: string, newFullName: string) {
    const shiftsRef = collection(this.firestore, "shifts");
    const q = query(shiftsRef, where("author", "==", userId));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const shiftRef = doc.ref;
        await updateDoc(shiftRef, { authorFullName: newFullName });
      });
    } catch (error: any) {
      throw new Error(`Error updating shift author names: ${error.message}`);
    }
  }
}

// TODO: get all shifts after operations from backend, don t trigget getshifts
