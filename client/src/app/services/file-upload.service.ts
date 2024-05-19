import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { finalize } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  constructor(private storage: AngularFireStorage) {}

  async uploadFile(photo: FormData): Promise<{ photoURL: string }> {
    try {
      const response = await fetch(
        "http://localhost:8080/api/upload/profile-picture",
        {
          method: "POST",
          body: photo,
          credentials: "include", // Ensure cookies are included in the request
        }
      );

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        try {
          const result = await response.json();
          console.error("Failed to upload photo");
          throw new Error("Failed to upload photo");
        } catch (jsonError) {
          // Handle non-JSON responses
          const text = await response.text();
          console.error("Failed to upload photo:", text);
          throw new Error(`Failed to upload photo: ${text}`);
        }
      }
    } catch (error) {
      console.error("An error occurred while uploading the photo:", error);
      throw error;
    }
  }

  async deleteFile(photoURL: string): Promise<void> {
    try {
      // Call the backend to remove the photo
      const response = await fetch(
        "http://localhost:8080/api/upload/profile-picture",
        {
          method: "DELETE", // Change method to DELETE
          credentials: "include",
          headers: {
            "Content-Type": "application/json", // Add this header
          },
          body: JSON.stringify({ photoURL }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove the profile picture");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
