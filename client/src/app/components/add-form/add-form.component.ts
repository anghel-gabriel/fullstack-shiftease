import { Component, EventEmitter, Output } from "@angular/core";
import { isDateBefore } from "src/app/utils/validation";
import { workplaces } from "src/app/utils/workplaces";
import { IShift, IWorkplace } from "src/app/utils/interfaces";

@Component({
  selector: "app-add-form",
  templateUrl: "./add-form.component.html",
  styleUrls: ["./add-form.component.scss"],
})
export class AddFormComponent {
  @Output() submit = new EventEmitter<any>();
  @Output() errorEvent = new EventEmitter<string>();
  // Shift data
  workTime: Array<Date> | null = null;
  hourlyWage: string | null = null;
  workplace: string | null = null;
  comments: string = "";
  workplaces: IWorkplace[] = workplaces;
  // Loading state
  isLoading: boolean = false;

  async onSubmit() {
    // Check if start time is before end time
    if (
      !this.workTime ||
      !Array.isArray(this.workTime) ||
      this.workTime.length < 2
    ) {
      this.errorEvent.emit("Start time and end time are mandatory.");
      return;
    }
    const [startTime, endTime]: Date[] = this.workTime;
    if (!startTime || !endTime || !isDateBefore(startTime, endTime)) {
      this.errorEvent.emit("The start time must be before the end time.");
      return;
    }
    // Check if hourly wage is greater than 0
    if (
      !this.hourlyWage ||
      isNaN(parseFloat(this.hourlyWage)) ||
      parseFloat(this.hourlyWage) <= 0
    ) {
      this.errorEvent.emit("Hourly wage must be over 0.");
      return;
    }
    // Check if any workplace is selected
    if (!this.workplace) {
      this.errorEvent.emit("You must select a workplace.");
      return;
    }
    // Submit data
    const shift: IShift = {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      hourlyWage: parseFloat(this.hourlyWage),
      workplace: this.workplace,
      comments: this.comments || "",
    };
    this.submit.emit(shift as IShift);
    // Reset form
    this.workTime = null;
    this.hourlyWage = null;
    this.workplace = null;
    this.comments = "";
  }
}
