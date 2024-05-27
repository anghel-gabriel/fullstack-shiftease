import { Injectable } from "@angular/core";
import { root } from "../utils/URLs";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  constructor() {}

  // REGULAR USERS

  async uploadFile(photo: FormData) {
    try {
      const response = await fetch(root + "/api/user/upload/profile-picture", {
        method: "POST",
        body: photo,
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      } else {
        return result.photoURL;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async deleteFile(photoURL: string): Promise<void> {
    try {
      const response = await fetch(root + "/api/user/upload/profile-picture", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photoURL }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  // ADMIN USERS
  async uploadPhotoAsAdmin(employeeId: string, photo: FormData) {
    try {
      const response = await fetch(
        root + `/api/admin/upload/profile-picture/${employeeId}`,
        {
          method: "POST",
          body: photo,
          credentials: "include",
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      } else {
        return result.photoURL;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async deletePhotoAsAdmin(employeeId: string, photoURL: string) {
    try {
      const response = await fetch(root + "/api/admin/upload/profile-picture", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId, photoURL }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
