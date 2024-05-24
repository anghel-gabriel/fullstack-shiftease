import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { AuthenticationService } from "src/app/services/authentication.service";
import { isPasswordValid } from "src/app/utils/validation";

@Component({
  selector: "app-reset-password-page",
  templateUrl: "./reset-password-page.component.html",
  styleUrl: "./reset-password-page.component.scss",
  providers: [MessageService],
})
export class ResetPasswordPageComponent {
  token: string = "";
  newPassword: string = "";
  confirmNewPassword: string = "";
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toast: MessageService,
    private auth: AuthenticationService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.params["token"];
  }

  showError(message: string) {
    this.toast.add({
      severity: "error",
      summary: "Error",
      detail: message,
    });
  }

  async resetPassword() {
    // Validation
    if (!this.newPassword || !this.confirmNewPassword) {
      return this.showError("All fields are mandatory");
    }
    if (!isPasswordValid(this.newPassword)) {
      return this.showError("Your password must respect the requested format.");
    }
    if (this.newPassword !== this.confirmNewPassword) {
      return this.showError("Passwords must match.");
    }
    // Sending password to server
    this.isLoading = true;
    try {
      await this.auth.setNewPasswordBackend(this.token, this.newPassword);
      this.toast.add({
        severity: "success",
        summary: "Sucess",
        detail: "Password changed successfully!",
      });
      setTimeout(() => {
        this.router.navigate(["/sign-in"]);
      }, 2000);
    } catch (error: any) {
      this.showError(error.message);
    }
  }
}
