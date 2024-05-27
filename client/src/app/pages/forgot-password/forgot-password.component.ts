import { Component } from "@angular/core";
import { UsersService } from "src/app/services/users.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrl: "./forgot-password.component.scss",
  providers: [MessageService],
})
export class ForgotPasswordComponent {
  email: string = "";
  isLoading: boolean = false;

  constructor(
    private usersService: UsersService,
    public toast: MessageService
  ) {}

  async onSubmit(): Promise<void> {
    this.isLoading = true;
    try {
      await this.usersService.sendPasswordResetEmail(this.email);
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
