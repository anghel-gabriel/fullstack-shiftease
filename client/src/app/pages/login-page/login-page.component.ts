import { Component } from "@angular/core";
import { AuthenticationService } from "../../services/authentication.service";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
  providers: [MessageService],
})
export class LoginPageComponent {
  isLoading = false;
  usernameOrEmail = "";
  password = "";
  loginWay = "email";

  // login way toggle for desktop
  desktopSelectOptions: any[] = [
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
  // login way toggle for mobile
  mobileSelectOptions = [
    { label: "Sign in with email", value: "email" },
    { label: "Sign in with username", value: "username" },
  ];

  constructor(
    private auth: AuthenticationService,
    private toast: MessageService,
    private router: Router
  ) {}

  onDesktopSelectChange(): void {
    // prevent unselecting both login ways
    const isAlreadySelected = this.desktopSelectOptions.find(
      (option) => option.value === this.loginWay && option.disabled
    );
    if (isAlreadySelected) return;
    // update the options to disable the selected one
    this.desktopSelectOptions = this.desktopSelectOptions.map((option) => ({
      ...option,
      disabled: option.value === this.loginWay,
    }));
  }

  showError(message: string) {
    this.toast.add({
      severity: "error",
      summary: "Error",
      detail: message,
    });
  }

  async onSubmit() {
    if (!this.password || !this.usernameOrEmail) {
      this.showError("Please enter your login credentials.");
      return;
    }

    try {
      this.isLoading = true;
      await this.auth.loginBackend(
        this.usernameOrEmail,
        this.password,
        this.loginWay
      );

      this.router.navigate(["/"]);
    } catch (error: any) {
      this.showError(error.message.split(":")[1].trim());
    } finally {
      this.isLoading = false;
    }
  }
}
