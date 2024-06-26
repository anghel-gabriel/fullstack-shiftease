import { Component } from "@angular/core";
import { MessageService } from "primeng/api";
import {
  isUsernameValid,
  isUserAgeBetween6And130,
} from "../../utils/validation";
import { UsersService } from "../../services/users.service";
import { FileUploadService } from "src/app/services/file-upload.service";
import { IGenderOption, genderOptionList } from "src/app/utils/genderOptions";
import { defaultPhotoURL } from "src/app/utils/URLs";
import { root } from "src/app/utils/URLs";
import { IUser } from "src/app/utils/interfaces";

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
  gender: string | IGenderOption = "";
  genderOptions: IGenderOption[] = genderOptionList;
  // Loading state
  isLoading: boolean = false;
  // Modals states
  isChangingPasswordModalVisible: boolean = false;
  isChangingEmailModalVisible: boolean = false;
  // Default photo URL
  defaultPhotoURL: string = defaultPhotoURL;

  constructor(
    private messageService: MessageService,
    private usersService: UsersService,
    private fileUploadService: FileUploadService
  ) {
    this.usersService.getLoggedUser().subscribe((data) => {
      this.fillProfileFields(data);
    });
  }

  // Fill profile input fields with user data
  fillProfileFields(data: IUser): void {
    if (data) {
      this.username = data.username;
      this.emailAddress = data.emailAddress;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.username = data.username;
      this.birthDate = new Date(data.birthDate);
      this.gender = data.gender || { name: "Unknown", value: "unknown" };
      this.photoURL = data.photoURL;
    }
  }

  // Show error toast function
  showError(message: string): void {
    this.messageService.add({
      severity: "error",
      detail: message,
      summary: "Error",
    });
  }
  // Show success toast notification
  showSuccess(message: string): void {
    this.messageService.add({
      severity: "success",
      detail: message,
      summary: "Success",
    });
  }

  // Set loading spinner
  setLoadingSpinner(event: boolean): void {
    this.isLoading = event;
  }

  // Save profile method
  async handleSaveProfile(): Promise<void> {
    // Form validation
    if (this.username.length < 6) {
      return this.showError("Your username must be at least 6 characters long");
    }
    if (!isUsernameValid(this.username)) {
      return this.showError("Your username must be alphanumeric");
    }
    if (this.firstName.length < 2 || this.lastName.length < 2) {
      return this.showError(
        "First name and last name must be at least 2 characters long"
      );
    }
    if (!this.birthDate || !isUserAgeBetween6And130(new Date(this.birthDate))) {
      return this.showError(
        "You must be between 18 and 90 years old in order to register"
      );
    }
    this.setLoadingSpinner(true);
    try {
      const newData = {
        emailAddress: this.emailAddress,
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        birthDate: this.birthDate.toISOString(),
        gender: this.gender,
      };
      await this.usersService.editProfile(newData as any);
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
  async onUpload(event: any): Promise<void> {
    this.setLoadingSpinner(true);
    for (let file of event.files) {
      try {
        // Create a FormData object and append the file
        const formData = new FormData();
        formData.append("photo", file);
        // Upload the file and get the photo URL
        const photoURL = await this.fileUploadService.uploadFile(formData);
        await this.usersService.updateUserPhoto(photoURL);
        this.showSuccess("Profile picture updated successfully.");
      } catch (error: any) {
        this.showError(error.message);
      } finally {
        this.setLoadingSpinner(false);
      }
    }
  }

  // Remove photo method
  async removePhoto(): Promise<void> {
    this.setLoadingSpinner(true);
    try {
      // Call the backend to remove the photo
      await this.fileUploadService.deleteFile(this.photoURL);
      // Update the user profile photo to the default one
      await this.usersService.removeUserPhoto();
      this.photoURL = root + "/pictures/defaultPhoto.png";
      this.showSuccess("Profile picture removed successfully.");
    } catch (error: any) {
      this.showError(error.message);
    } finally {
      this.setLoadingSpinner(false);
    }
  }
}
