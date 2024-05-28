import { Component, EventEmitter, Output } from "@angular/core";
import { isPasswordValid } from "../../utils/validation";
import { UsersService } from "../../services/users.service";

@Component({
  selector: "app-change-password-form",
  templateUrl: "./change-password-form.component.html",
  styleUrl: "./change-password-form.component.scss",
})
export class ChangePasswordFormComponent {
  @Output() errorEvent = new EventEmitter<string>();
  @Output() successEvent = new EventEmitter<string>();
  @Output() setLoadingSpinner = new EventEmitter<boolean>();
  @Output() closeForm = new EventEmitter();
  newPassword: string = "";
  newPasswordConfirm: string = "";

  constructor(private usersService: UsersService) {}

  async onSubmit(): Promise<void> {
    try {
      this.setLoadingSpinner.emit(true);
      if (!isPasswordValid(this.newPassword)) {
        this.errorEvent.emit("You must enter valid passwords.");
        return;
      }
      if (this.newPassword !== this.newPasswordConfirm) {
        this.errorEvent.emit("Your passwords must match.");
        return;
      }
      this.closeForm.emit();
      await this.usersService.changePassword(this.newPassword);
      this.successEvent.emit("Password changed succesfully.");
    } catch (error: any) {
      this.errorEvent.emit(error.message);
    } finally {
      this.setLoadingSpinner.emit(false);
    }
  }
}
