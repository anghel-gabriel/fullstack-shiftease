import { Component, HostListener } from "@angular/core";
import { MenuItem } from "primeng/api";
import { MessageService } from "primeng/api";
import {
  isUsernameValid,
  isUserAgeBetween6And130,
} from "../../utils/validation";
import { AuthenticationService } from "../../services/authentication.service";
import { FileUploadService } from "src/app/services/file-upload.service";
import { IGenderOption, genderOptionList } from "src/app/utils/genderOptions";

@Component({
  selector: "app-profile-page",
  templateUrl: "./profile-page.component.html",
  styleUrls: ["./profile-page.component.scss"],
  providers: [MessageService],
})
export class ProfilePageComponent {
  // User data
  emailAddress: string = "";
  username: string = "";
  firstName: string = "";
  lastName: string = "";
  birthDate: Date | null = null;
  photoURL: string = "";
  isLoading = false;
  gender: string | IGenderOption = "";
  genderOptions: IGenderOption[] = genderOptionList;

  // Modals states
  isChangingPasswordModalVisible = false;
  isChangingEmailModalVisible = false;

  constructor(
    private messageService: MessageService,
    private auth: AuthenticationService,
    private fileUpload: FileUploadService
  ) {
    this.auth.getLoggedUser().subscribe((data) => {
      this.fillProfileFields(data);
      console.log(data);
    });
  }

  // Fill profile input fields with user data
  fillProfileFields(data: any) {
    if (data) {
      this.username = data.email;
      this.emailAddress = data.email;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.username = data.username;
      this.birthDate = new Date(data.birthDate);
      this.gender = data.gender || { name: "Unknown", value: "unknown" };
      this.photoURL = data.photoURL;
    }
  }

  // Show error toast function
  showError(message: string) {
    this.messageService.add({
      severity: "error",
      detail: message,
      summary: "Error",
    });
  }
  // Show success toast notification
  showSuccess(message: string) {
    this.messageService.add({
      severity: "success",
      detail: message,
      summary: "Success",
    });
  }

  // Set loading spinner
  setLoadingSpinner(event: boolean) {
    this.isLoading = event;
  }

  // Save profile method
  async handleSaveProfile() {
    // Form validation
    if (this.username.length < 6) {
      this.showError("Your username must be at least 6 characters long");
    }
    if (!isUsernameValid(this.username)) {
      this.showError("Your username must be alphanumeric");
      return;
    }
    if (this.firstName.length < 2 || this.lastName.length < 2) {
      this.showError(
        "First name and last name must be at least 2 characters long"
      );
      return;
    }
    if (!this.birthDate || !isUserAgeBetween6And130(new Date(this.birthDate))) {
      this.showError(
        "You must be between 18 and 90 years old in order to register"
      );
      return;
    }

    this.setLoadingSpinner(true);
    try {
      const newData = {
        email: this.emailAddress,
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        birthDate: this.birthDate.toISOString(),
        gender: this.gender,
      };
      await this.auth.editProfileBackend(newData as any);
      this.messageService.add({
        severity: "success",
        detail: "Changes saved succesfully",
        summary: "Success",
      });
    } catch (error: any) {
      this.showError(error.message);
    } finally {
      this.setLoadingSpinner(false);
    }
  }

  // Photo upload method
  async onUpload(event: any) {
    this.setLoadingSpinner(true);
    for (let file of event.files) {
      try {
        // Create a FormData object and append the file
        const formData = new FormData();
        formData.append("photo", file);
        // Upload the file and get the photo URL
        const photoURL = await this.fileUpload.uploadFile(formData);
        await this.auth.updateUserPhoto(photoURL);
        this.showSuccess("Profile picture updated successfully.");
      } catch (error: any) {
        this.showError(error.message);
      } finally {
        this.setLoadingSpinner(false);
      }
    }
  }

  // Remove photo method
  async removePhoto() {
    this.setLoadingSpinner(true);
    try {
      // Call the backend to remove the photo
      await this.fileUpload.deleteFile(this.photoURL);

      // Update the user profile photo to the default one
      await this.auth.removeUserPhoto();
      this.photoURL = "http://localhost:8080/pictures/defaultPhoto.png";
      this.showSuccess("Profile picture removed successfully.");
    } catch (error: any) {
      this.showError(error.message);
    } finally {
      this.setLoadingSpinner(false);
    }
  }
}

// TODO: add user interface
// TODO: add error types
// TODO: check if can throw errors with 'throw error'
