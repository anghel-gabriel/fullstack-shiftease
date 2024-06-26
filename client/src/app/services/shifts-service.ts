import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { IShift, IUser } from "../utils/interfaces";
import { root } from "../utils/URLs";

@Injectable({
  providedIn: "root",
})
export class ShiftsService {
  private areMyShiftsLoading = new BehaviorSubject<boolean>(false);
  private areAllShiftsLoading = new BehaviorSubject<boolean>(false);
  private areAllUsersLoading = new BehaviorSubject<boolean>(false);
  private myShifts = new BehaviorSubject<IShift[]>([]);
  private allShifts = new BehaviorSubject<IShift[]>([]);
  private allUsers = new BehaviorSubject<any[]>([]);

  // Observables
  getAreMyShiftsLoading(): Observable<boolean> {
    return this.areMyShiftsLoading.asObservable();
  }

  getAllUsersObs(): Observable<IUser[]> {
    return this.allUsers.asObservable();
  }

  getAreAllShiftsLoading(): Observable<boolean> {
    return this.areAllShiftsLoading.asObservable();
  }

  getAreAllUsersLoading(): Observable<boolean> {
    return this.areAllUsersLoading.asObservable();
  }

  getMyShiftsObs(): Observable<IShift[]> {
    return this.myShifts.asObservable();
  }

  getAllShiftsObs(): Observable<IShift[]> {
    return this.allShifts.asObservable();
  }

  // REGULAR USERS METHODS
  async getUserShifts(): Promise<void> {
    try {
      this.areMyShiftsLoading.next(true);
      const response = await fetch(root + "/api/user/shifts/get-user-shifts/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      this.myShifts.next(result.data);
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      this.areMyShiftsLoading.next(false);
    }
  }

  async addShift(shift: IShift): Promise<void> {
    try {
      const response = await fetch(root + "/api/user/shifts/add-shift", {
        method: "POST",
        body: JSON.stringify(shift),
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      } else {
        this.myShifts.next(result.data);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async editShift(shiftId: string, newData: IShift): Promise<void> {
    try {
      const response = await fetch(
        root + `/api/user/shifts/update-shift/${shiftId}`,
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
      this.myShifts.next(result.data);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteShift(shiftId: string): Promise<void> {
    try {
      this.areMyShiftsLoading.next(true);
      const response = await fetch(
        root + `/api/user/shifts/delete-shift/${shiftId}`,
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
      this.myShifts.next(result.data);
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      this.areMyShiftsLoading.next(false);
    }
  }

  // ADMIN USERS METHODS
  async getAllShifts(): Promise<void> {
    try {
      this.areAllShiftsLoading.next(true);
      const response = await fetch(root + "/api/admin/shifts/get-all-shifts/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

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

  async editShiftAsAdmin(shiftId: string, newData: IShift): Promise<void> {
    try {
      const response = await fetch(
        root + `/api/admin/shifts/update-shift/${shiftId}`,
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

  async deleteShiftsByUserId(userId: string): Promise<void> {
    try {
      this.areAllShiftsLoading.next(true);
      const response = await fetch(
        root + `/api/admin/shifts/delete-user-shifts/${userId}/`,
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

  async deleteShiftAsAdmin(shiftId: string): Promise<void> {
    try {
      this.areAllShiftsLoading.next(true);
      const response = await fetch(
        root + `/api/admin/shifts/delete-shift/${shiftId}/`,
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

  async getAllUsers(): Promise<void> {
    try {
      this.areAllUsersLoading.next(true);
      const response = await fetch(root + `/api/admin/profile/get-all-users/`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
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
