import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AuthenticationService } from "./authentication.service";
import { IShift } from "../utils/interfaces";

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

  constructor(private auth: AuthenticationService) {
    this.auth
      .getLoggedUser()
      .subscribe((userData) => this.loggedUserUid.next(userData?.uid));
    this.getShifts();
    this.getAllShiftsBackend();
    this.getAllUsersBackend();
  }

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

  async addShift(shift: IShift) {
    try {
      const response = await fetch(
        "http://localhost:8080/api/shifts/add-shift",
        {
          method: "POST",
          body: JSON.stringify(shift),
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      } else {
        await this.getShifts();
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async editShift(shiftId: string, newData: IShift) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/shifts/update-shift/${shiftId}`,
        {
          method: "PUT",
          body: JSON.stringify(newData),
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      await this.getShifts();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteShift(shiftId: string) {
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
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      this.getShifts();
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      this.areMyShiftsLoading.next(false);
    }
  }

  async getShifts() {
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
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      this.myShifts.next(result);
    } catch (error: any) {
      throw new Error(error.message);
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
      this.allShifts.next(data);
    } catch (error: any) {
      throw new Error(
        `Failed to fetch shifts: ${error.message || error.toString()}`
      );
    } finally {
      this.areAllShiftsLoading.next(false);
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
      this.allUsers.next(data);
    } catch (error: any) {
      throw new Error(
        `Failed to fetch shifts: ${error.message || error.toString()}`
      );
    } finally {
      this.areAllUsersLoading.next(false);
    }
  }

  async deleteShiftsByUserIdBackend(userId: string) {
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
    } catch (error: any) {
      throw new Error(
        `Failed to fetch shifts: ${error.message || error.toString()}`
      );
    } finally {
      this.areAllShiftsLoading.next(false);
    }
  }
}

// TODO: get all shifts after operations from backend, don t trigget getshifts
