import { Component, EventEmitter, Output } from "@angular/core";
import { isEmailValid } from "../../utils/validation";
import { UsersService } from "../../services/users.service";

@Component({
  selector: "app-change-email-form",
  templateUrl: "./change-email-form.component.html",
  styleUrl: "./change-email-form.component.scss",
})
export class ChangeEmailFormComponent {
  @Output() errorEvent = new EventEmitter<string>();
  @Output() successEvent = new EventEmitter<string>();
  @Output() setLoadingSpinner = new EventEmitter<boolean>();
  @Output() closeForm = new EventEmitter();

  newEmail: string = "";
  newEmailConfirm: string = "";

  constructor(private usersService: UsersService) {}

  async onSubmit(): Promise<void> {
    try {
      this.setLoadingSpinner.emit(true);
      if (!isEmailValid(this.newEmail)) {
        this.errorEvent.emit("You must enter valid email addresses.");
        return;
      }
      if (this.newEmail !== this.newEmailConfirm) {
        this.errorEvent.emit("Your email addresses must match.");
        return;
      }
      this.closeForm.emit();
      await this.usersService.changeEmail(this.newEmail);
      this.successEvent.emit("Email address changed successfully.");
    } catch (error: any) {
      this.errorEvent.emit(error.message);
    } finally {
      this.setLoadingSpinner.emit(false);
    }
  }
}
