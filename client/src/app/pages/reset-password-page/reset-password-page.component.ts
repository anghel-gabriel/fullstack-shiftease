import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";

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
    private http: HttpClient,
    private router: Router,
    private toast: MessageService
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

  resetPassword() {
    if (!this.newPassword || !this.confirmNewPassword) {
      this.showError("All fields are mandatory");
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.showError("Passwords must match.");
    }
    this.http
      .post(`http://localhost:8080/api/auth/reset-password/${this.token}`, {
        newPassword: this.newPassword,
      })
      .subscribe(
        (response) => {
          console.log("Password reset successful");
          this.router.navigate(["/login"]);
        },
        (error) => {
          console.log(321, error.message);
          this.showError("Error resetting password");
        }
      );
  }
}
