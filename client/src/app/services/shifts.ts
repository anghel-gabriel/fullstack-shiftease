import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UsersService } from "./users.service";
import { IShift } from "../utils/interfaces";

@Injectable({
  providedIn: "root",
})
export class ShiftsService {
  loggedUserData = new BehaviorSubject<any>(null);
  private areMyShiftsLoading = new BehaviorSubject<boolean>(false);
  private areAllShiftsLoading = new BehaviorSubject<boolean>(false);
  private areAllUsersLoading = new BehaviorSubject<boolean>(false);
  private myShifts = new BehaviorSubject<IShift[]>([]);
  private allShifts = new BehaviorSubject<IShift[]>([]);
  private allUsers = new BehaviorSubject<any[]>([]);

  constructor(private usersService: UsersService) {
    this.usersService
      .getLoggedUser()
      .subscribe((userData) => this.loggedUserData.next(userData));
  }

  // Observables
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

  getAllShiftsObs() {
    return this.allShifts.asObservable();
  }

  // REGULAR USERS METHODS
  async getUserShifts() {
    try {
      this.areMyShiftsLoading.next(true);
      const response = await fetch(
        `http://localhost:8080/api/user/shifts/get-user-shifts/`,
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

  async addShift(shift: IShift) {
    try {
      const response = await fetch(
        "http://localhost:8080/api/user/shifts/add-shift",
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
        this.myShifts.next(result);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async editShift(shiftId: string, newData: IShift) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/shifts/update-shift/${shiftId}`,
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
      this.myShifts.next(result);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteShift(shiftId: string) {
    try {
      this.areMyShiftsLoading.next(true);
      const response = await fetch(
        `http://localhost:8080/api/user/shifts/delete-shift/${shiftId}`,
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
      this.myShifts.next(result);
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      this.areMyShiftsLoading.next(false);
    }
  }

  // ADMIN USERS METHODS
  async getAllShifts() {
    try {
      this.areAllShiftsLoading.next(true);
      const response = await fetch(
        `http://localhost:8080/api/admin/shifts/get-all-shifts/`,
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

      this.allShifts.next(result.data);
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      this.areAllShiftsLoading.next(false);
    }
  }

  async editShiftAsAdmin(shiftId: string, newData: IShift) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/shifts/update-shift/${shiftId}`,
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
      } else {
        this.allShifts.next(result.data);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteShiftsByUserId(userId: string) {
    try {
      this.areAllShiftsLoading.next(true);
      const response = await fetch(
        `http://localhost:8080/api/admin/shifts/delete-user-shifts/${userId}/`,
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
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      this.areAllShiftsLoading.next(false);
    }
  }

  async deleteShiftAsAdmin(shiftId: string) {
    try {
      this.areAllShiftsLoading.next(true);
      const response = await fetch(
        `http://localhost:8080/api/admin/shifts/delete-shift/${shiftId}/`,
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
      } else {
        this.allShifts.next(result.data);
      }
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      this.areAllShiftsLoading.next(false);
    }
  }

  async getAllUsers() {
    try {
      this.areAllUsersLoading.next(true);
      const response = await fetch(
        `http://localhost:8080/api/admin/profile/get-all-users/`,
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
        throw new Error(`HTTP error! status: ${response.status}`);
      } else this.allUsers.next(result.data);
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      this.areAllUsersLoading.next(false);
    }
  }
}

// TODO: get all shifts after operations from backend, don t trigget getshifts
