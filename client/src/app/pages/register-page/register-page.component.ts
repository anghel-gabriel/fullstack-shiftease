import { Component, HostListener } from "@angular/core";
import { MenuItem } from "primeng/api";
import { MessageService } from "primeng/api";
import {
  isEmailValid,
  isPasswordValid,
  isUsernameValid,
  isUserAgeBetween6And130,
} from "../../utils/validation";
import { AuthenticationService } from "../../services/authentication.service";
import { Router } from "@angular/router";
import { genderOptionList } from "src/app/utils/genderOptions";

@Component({
  selector: "app-register-page",
  templateUrl: "./register-page.component.html",
  styleUrls: ["./register-page.component.scss"],
  providers: [MessageService],
})
export class RegisterPageComponent {
  // user properties
  emailAddress = "";
  username = "";
  password = "";
  confirmPassword = "";
  firstName = "";
  lastName = "";
  birthDate: string = "";
  gender: any = "";
  // user agreement checkbox
  checked = false;
  // loading state
  isLoading = false;
  isViewPortAtLeastMedium = false;

  // gender dropdown options
  genderOptions = genderOptionList;

  // steps component navigation
  items: MenuItem[] = [
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
  activeIndex = 0;

  constructor(
    private messageService: MessageService,
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.isViewPortAtLeastMedium = window.innerWidth >= 640;
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  // adjust form navigation buttons depending on viewport width
  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.isViewPortAtLeastMedium = window.innerWidth >= 640;
  }

  // show error toast function
  showError(message: string) {
    this.messageService.add({
      severity: "error",
      detail: message,
      summary: "Error",
    });
  }

  // form validation on pressing next
  async handleNext() {
    // first step validation
    if (this.activeIndex === 0) {
      if (!isEmailValid(this.emailAddress)) {
        this.showError("Please use a valid email address.");
        return;
      }
      if (this.username.length < 6) {
        this.showError("Your username must be at least 6 characters long.");
        return;
      }
      if (!isUsernameValid(this.username)) {
        this.showError("Your username must be alphanumeric.");
        return;
      }
      if (!isPasswordValid(this.password)) {
        this.showError("Your password must respect the requested format.");
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.showError("Your passwords must match.");
        return;
      }
      // check if username or email already existing
      try {
        this.isLoading = true;
        await this.auth.checkCredentialsBackend(
          this.emailAddress,
          this.username,
          this.password,
          this.confirmPassword
        );
        this.activeIndex++;
        return;
      } catch (error: any) {
        this.showError(error.message);
      } finally {
        this.isLoading = false;
      }
    }

    // second step validation
    if (this.activeIndex === 1) {
      if (this.firstName.length < 2 || this.lastName.length < 2) {
        this.showError(
          "First name and last name must be at least 2 characters long."
        );
        return;
      }
      if (!this.birthDate || !isUserAgeBetween6And130(this.birthDate)) {
        this.showError(
          "You must be between 6 and 130 years old in order to register."
        );
        return;
      }
    }
  }

  handlePrevious() {
    if (this.activeIndex !== 0) this.activeIndex--;
  }

  async onSubmit() {
    this.messageService.add({
      severity: "warn",
      summary: "Loading",
      detail: "Registration process in progress. Please wait...",
    });
    this.isLoading = true;
    const newUserData = {
      emailAddress: this.emailAddress,
      username: this.username,
      password: this.password,
      confirmPassword: this.confirmPassword,
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: new Date(this.birthDate).toISOString(),
      gender: this.gender || { name: "Unknown", value: "unknown" },
    };
    try {
      await this.auth.registerBackend(newUserData);
      this.messageService.add({
        severity: "success",
        summary: "Success",
        detail:
          "You have successfully registered. You will be redirected to Shifts page.",
      });
      // adding a delay before redirecting user to have enough time to read the notifications
      // await new Promise((resolve) => setTimeout(resolve, 4000));
      this.router.navigate(["/"]);
    } catch (error: any) {
      console.log(error);
      this.showError("Registration failed. Please contact an admin.");
    } finally {
      this.isLoading = false;
    }
  }
}
