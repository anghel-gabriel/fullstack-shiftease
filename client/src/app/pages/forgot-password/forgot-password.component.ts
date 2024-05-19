import { Component } from "@angular/core";
import { AuthenticationService } from "src/app/services/authentication.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrl: "./forgot-password.component.scss",
  providers: [MessageService],
})
export class ForgotPasswordComponent {
  email = "";
  isLoading = false;

  constructor(
    private auth: AuthenticationService,
    public toast: MessageService
  ) {}

  async onSubmit() {
    try {
      this.isLoading = true;
      await this.auth.sendPasswordResetEmail(this.email);
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: "Reset password email sent successfully.",
      });
    } catch (error: any) {
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: error.message as string,
      });
    } finally {
      this.isLoading = false;
    }
  }
}
