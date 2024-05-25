import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  constructor() {}

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
      // Call the backend to remove the photo
      const response = await fetch(
        "http://localhost:8080/api/user/upload/profile-picture",
        {
          method: "DELETE", // Change method to DELETE
          credentials: "include",
          headers: {
            "Content-Type": "application/json", // Add this header
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
}
