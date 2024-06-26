import { Component } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";

interface ILoginMethodDesktopOptions {
  label: string;
  value: string;
  disabled: boolean;
}

interface ILoginMethodMobileOptions {
  label: string;
  value: string;
}

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
  providers: [MessageService],
})
export class LoginPageComponent {
  // Username or email address (depending on login method)
  usernameOrEmail: string = "";
  password: string = "";
  loginMethod: "email" | "username" = "email";
  // Loading state
  isLoading: boolean = false;

  // Login method toggle for desktop
  desktopSelectOptions: ILoginMethodDesktopOptions[] = [
    {
      label: "Sign in with email",
      value: "email",
      disabled: true,
    },
    {
      label: "Sign in with username",
      value: "username",
      disabled: false,
    },
  ];

  // Login method toggle for mobile
  mobileSelectOptions: ILoginMethodMobileOptions[] = [
    { label: "Sign in with email", value: "email" },
    { label: "Sign in with username", value: "username" },
  ];

  constructor(
    private usersService: UsersService,
    private toast: MessageService,
    private router: Router
  ) {}

  // Prevent user selecting/unselecting both login ways on desktop viewport
  onDesktopSelectChange(): void {
    const isAlreadySelected = this.desktopSelectOptions.find(
      (option: ILoginMethodDesktopOptions) =>
        option.value === this.loginMethod && option.disabled
    );
    if (isAlreadySelected) return;
    // Update the options to disable the selected one
    this.desktopSelectOptions = this.desktopSelectOptions.map(
      (option: ILoginMethodDesktopOptions) => ({
        ...option,
        disabled: option.value === this.loginMethod,
      })
    );
  }

  // Show error toast function
  showError(message: string): void {
    this.toast.add({
      severity: "error",
      summary: "Error",
      detail: message,
    });
  }

  // Login function
  async onSubmit(): Promise<void> {
    if (!this.password || !this.usernameOrEmail) {
      return this.showError("Please enter your login credentials.");
    }
    this.isLoading = true;
    try {
      await this.usersService.login(
        this.usernameOrEmail,
        this.password,
        this.loginMethod
      );
      this.router.navigate(["/"]);
    } catch (error: any) {
      this.showError(error.message);
    } finally {
      this.isLoading = false;
    }
  }
}
