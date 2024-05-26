import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  constructor() {}

  // REGULAR USERS

  async uploadFile(photo: FormData) {
    try {
      const response = await fetch(
        "http://localhost:8080/api/user/upload/profile-picture",
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

  async deleteFile(photoURL: string): Promise<void> {
    try {
      const response = await fetch(
        "http://localhost:8080/api/user/upload/profile-picture",
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ photoURL }),
        }
      );

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
        `http://localhost:8080/api/admin/upload/profile-picture/${employeeId}`,
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

  async deletePhotoAsAdmin(employeeId: string) {}
}
