import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { UsersService } from "src/app/services/users.service";
import { FileUploadService } from "src/app/services/file-upload.service";
import { defaultPhotoURL } from "src/app/utils/defaultProfileImage";
import { IGenderOption, genderOptionList } from "src/app/utils/genderOptions";
import {
  isUserAgeBetween6And130,
  isUsernameValid,
} from "src/app/utils/validation";

@Component({
  selector: "app-employee-page",
  templateUrl: "./employee-page.component.html",
  styleUrl: "./employee-page.component.scss",
  providers: [MessageService],
})
export class EmployeePageComponent implements OnInit {
  // Employee data
  employeeId: string = "";
  firstName: string = "";
  lastName: string = "";
  username: string = "";
  emailAddress: string = "";
  birthDate: Date | null = null;
  gender: string | IGenderOption = "";
  photoURL: string = "";
  // Modals states
  isChangingPasswordModalVisible = false;
  isChangingEmailModalVisible = false;
  // Loading state
  isLoading: boolean = true;
  // Gender options
  genderOptions: IGenderOption[] = genderOptionList;
  // Default photo
  defaultPhotoURL: string = defaultPhotoURL;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private fileUploadService: FileUploadService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get("employeeId") || "";
    this.fillFieldsWithEmployeeData();
  }

  async fillFieldsWithEmployeeData(): Promise<void> {
    try {
      const employeeData = await this.usersService.getEmployeeData(
        this.employeeId
      );
      if (!employeeData || !employeeData["_id"]) this.router.navigate(["/404"]);
      else {
        this.firstName = employeeData["firstName"];
        this.lastName = employeeData["lastName"];
        this.username = employeeData["username"];
        this.emailAddress = employeeData["emailAddress"];
        this.gender = employeeData["gender"];
        this.photoURL = employeeData["photoURL"] || defaultPhotoURL;
        this.birthDate = new Date(employeeData["birthDate"]);
      }
    } catch (error: any) {
      this.showError("An error occured while loading data. Please try again.");
    } finally {
      this.isLoading = false;
    }
  }

  // show error toast function
  showError(message: string) {
    this.messageService.add({
      severity: "error",
      detail: message,
      summary: "Error",
    });
  }

  // show success toast notification
  showSuccess(message: string) {
    this.messageService.add({
      severity: "success",
      detail: message,
      summary: "Success",
    });
  }

  async removePhoto(): Promise<void> {
    this.isLoading = true;
    try {
      if (this.employeeId) {
        await this.fileUploadService.deletePhotoAsAdmin(
          this.employeeId,
          this.photoURL
        );
        this.photoURL = this.defaultPhotoURL;
      }
    } catch (error: any) {
      console.log(error);
      this.showError(
        "An error has occured while removing profile picture. Please try again."
      );
    } finally {
      this.isLoading = false;
      this.showSuccess("Profile picture removed successfully.");
    }
  }

  async onUpload(event: any): Promise<void> {
    this.isLoading = true;
    for (let file of event.files) {
      try {
        // Create a FormData object and append the file
        const formData = new FormData();
        formData.append("photo", file);
        // Upload the file and get the photo URL
        const newPhotoURL = await this.fileUploadService.uploadPhotoAsAdmin(
          this.employeeId,
          formData
        );
        this.photoURL = newPhotoURL;
        this.showSuccess("Profile picture updated successfully.");
      } catch (error: any) {
        this.showError(error.message);
      } finally {
        this.isLoading = false;
      }
    }
  }

  async handleSaveProfile(): Promise<void> {
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
        emailAddress: this.emailAddress,
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        birthDate: this.birthDate.toISOString(),
        gender: this.gender,
      };

      await this.usersService.editProfileAsAdmin(
        this.employeeId,
        newData as any
      );
      this.showSuccess("Changes saved succesfully");
    } catch (error: any) {
      this.showError(error.message);
    } finally {
      this.isLoading = false;
    }
  }
}
