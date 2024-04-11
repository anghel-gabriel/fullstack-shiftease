import { Injectable } from "@angular/core";
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  collectionChanges,
  orderBy,
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
  private areAllUsersLoading = new BehaviorSubject<boolean>(false);

  constructor(
    public firestore: Firestore,
    private auth: AuthenticationService,
  ) {
    this.auth
      .getLoggedUser()
      .subscribe((userData) => this.loggedUserUid.next(userData?.uid));
  }

  // loading states for data fetching
  getAreMyShiftsLoading() {
    return this.areMyShiftsLoading.asObservable();
  }

  getAreAllUsersLoading() {
    return this.areAllUsersLoading.asObservable();
  }

  // shifts CRUD
  updateShifts() {
    return collectionChanges(query(collection(this.firestore, "shifts"))).pipe(
      switchMap(async () => {
        const val = await this.getShifts();
        return val;
      }),
    );
  }

  private async getShifts() {
    this.areMyShiftsLoading.next(true);
    try {
      const user = this.auth.getAuthUser();
      const userId = user?.uid || "";
      if (!userId) throw new Error("User not logged");

      let queryRef = query(
        collection(this.firestore, "shifts"),
        orderBy("startTime", "desc"),
      );
      const docs = await getDocs(queryRef);
      const shiftsList = [] as any;

      docs.forEach((val: any) => {
        shiftsList.push({
          id: val.id,
          ...val.data(),
        });
      });

      return shiftsList;
    } catch (error: any) {
      throw new Error(error);
    } finally {
      this.areMyShiftsLoading.next(false);
    }
  }

  async addShift(shift: any) {
    try {
      await addDoc(collection(this.firestore, "shifts"), {
        ...shift,
        author: this.auth.getAuthUser()?.uid,
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async editShift(shiftId: string, newData: any) {
    const shiftRef = doc(this.firestore, "shifts", shiftId);
    try {
      await updateDoc(shiftRef, newData);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async deleteShift(shiftId: string) {
    try {
      const shiftRef = doc(this.firestore, "shifts", shiftId);
      await deleteDoc(shiftRef);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  // users CRUD
  updateAllUsers() {
    return collectionChanges(query(collection(this.firestore, "users"))).pipe(
      switchMap(async () => {
        const val = await this.getAllUsers();
        return val;
      }),
    );
  }

  private async getAllUsers() {
    this.areAllUsersLoading.next(true);
    try {
      let queryRef = query(collection(this.firestore, "users"));
      const docs = await getDocs(queryRef);
      const shiftsList = [] as any;

      docs.forEach((val: any) => {
        shiftsList.push({
          id: val.id,
          ...val.data(),
        });
      });
      return shiftsList;
    } catch (error: any) {
      throw new Error(error);
    } finally {
      this.areAllUsersLoading.next(false);
    }
  }

  async deleteShiftsByUserId(userId: string) {
    const shiftsRef = collection(this.firestore, "shifts");
    const q = query(shiftsRef, where("author", "==", userId));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        try {
          await deleteDoc(doc(this.firestore, "shifts", document.id));
        } catch (error: any) {
          throw new Error(error);
        }
      });
    } catch (error) {
      throw new Error("Error deleting shifts:" + error);
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
