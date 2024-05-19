import { Component, HostListener } from "@angular/core";
import { MenuItem } from "primeng/api";
import { MessageService } from "primeng/api";
import {
  isUsernameValid,
  isUserAgeBetween6And130,
} from "../../utils/validation";
import { AuthenticationService } from "../../services/authentication.service";
import { FileUploadService } from "src/app/services/file-upload.service";
import { defaultPhotoURL } from "src/app/utils/defaultProfileImage";
import { IGenderOption, genderOptionList } from "src/app/utils/genderOptions";
import { DatabaseService } from "src/app/services/database.service";

@Component({
  selector: "app-profile-page",
  templateUrl: "./profile-page.component.html",
  styleUrls: ["./profile-page.component.scss"],
  providers: [MessageService],
})
export class ProfilePageComponent {
  // user properties
  uid = "";
  email = "";
  username = "";
  firstName = "";
  lastName = "";
  birthDate: any;
  gender: string | IGenderOption = "";
  photoURL = "";
  activeIndex = 0;
  checked = false;
  isLoading = true;
  isViewPortAtLeastMedium: boolean = false;
  isChangingPasswordModalVisible = false;
  isChangingEmailModalVisible = false;
  actualFirstName = "";
  actualLastName = "";
  actualUsername = "";

  genderOptions = genderOptionList;
  // steps component
  items: MenuItem[] | undefined = [
    {
      label: "Credentials",
    },
    {
      label: "Personal",
    },
    {
      label: "Agreement",
    },
  ];

  constructor(
    private messageService: MessageService,
    private auth: AuthenticationService,
    private fileUpload: FileUploadService,
    private database: DatabaseService
  ) {
    this.isViewPortAtLeastMedium = window.innerWidth >= 640;
    this.auth.getLoggedUser().subscribe((data: any) => {
      this.fillProfileFields(data);
      if (data) this.isLoading = false;
    });
  }

  // adjust previous&next buttons depending on viewport width
  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.isViewPortAtLeastMedium = window.innerWidth >= 640;
  }

  // fill profile input fields
  fillProfileFields(data: any) {
    if (data) {
      this.uid = data.uid;
      this.username = data.email;
      this.email = data.email;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.username = data.username;
      this.birthDate = new Date(data.birthDate);
      this.gender = data.gender || { name: "Unknown", value: "unknown" };
      this.photoURL = data.photoURL;
      this.actualFirstName = data.firstName;
      this.actualLastName = data.lastName;
      this.actualUsername = data.username;
    }
  }

  // show error toast function
  showError(message: any) {
    this.messageService.add({
      severity: "error",
      detail: message,
      summary: "Error",
    });
  }

  // show success toast notification
  showSuccess(message: any) {
    this.messageService.add({
      severity: "success",
      detail: message,
      summary: "Success",
    });
  }

  // set loading spinner
  setLoadingSpinner(event: any) {
    this.isLoading = event;
  }

  // form validation
  async handleSaveProfile() {
    try {
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
      if (
        !this.birthDate ||
        !isUserAgeBetween6And130(new Date(this.birthDate))
      ) {
        this.showError(
          "You must be between 18 and 90 years old in order to register"
        );
        return;
      }

      this.isLoading = true;

      const newData = {
        email: this.email,
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
    } catch (error) {
      this.showError(
        "An error has occurred while updating data. Please try again."
      );
    } finally {
      this.isLoading = false;
    }
  }

  async onUpload(event: any) {
    this.isLoading = true;
    for (let file of event.files) {
      try {
        // Create a FormData object and append the file
        const formData = new FormData();
        formData.append("photo", file);

        // Upload the file and get the photo URL
        const result = await this.fileUpload.uploadFile(formData);
        const photoURL = result.photoURL;

        const userId = "vrajeala";
        if (userId) {
          await this.auth.updateUserPhoto(userId, photoURL);
          this.photoURL = photoURL;
        }
      } catch (error) {
        this.showError(
          "An error has occurred while updating profile picture. Please try again."
        );
      } finally {
        this.isLoading = false;
        this.showSuccess("Profile picture updated successfully.");
      }
    }
  }

  async removePhoto() {
    console.log(this.photoURL);
    this.isLoading = true;
    try {
      // Call the backend to remove the photo
      const response = await this.fileUpload.deleteFile(this.photoURL);

      // Update the user profile photo to the default one
      const defaultPhoto = defaultPhotoURL;
      this.photoURL = "http://localhost:8080/pictures/defaultPhoto.png";
      this.showSuccess("Profile picture removed successfully.");
    } catch (error) {
      console.log(error);
      this.showError(
        "An error has occurred while removing the profile picture. Please try again."
      );
    } finally {
      this.isLoading = false;
    }
  }
}
