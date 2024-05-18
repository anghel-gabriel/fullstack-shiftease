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
          console.log(result);
          console.error("Failed to upload photo");
          throw new Error("Failed to upload photo");
        } catch (jsonError) {
          // Handle non-JSON responses
          const text = await response.text();
          console.log(text);
          console.error("Failed to upload photo:", text);
          throw new Error(`Failed to upload photo: ${text}`);
        }
      }
    } catch (error) {
      console.log(error);
      console.error("An error occurred while uploading the photo:", error);
      throw error;
    }
  }

  async deleteFile(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileRef = this.storage.ref(path);
      fileRef
        .delete()
        .toPromise()
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
