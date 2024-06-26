import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import * as FileSaver from "file-saver";
import { ConfirmationService, MessageService } from "primeng/api";
import { OverlayPanel } from "primeng/overlaypanel";
import { Table } from "primeng/table";
import { UsersService } from "src/app/services/users.service";
import { ShiftsService } from "src/app/services/shifts-service";
import { IUser } from "src/app/utils/interfaces";

@Component({
  selector: "app-employees-page",
  templateUrl: "./employees-page.component.html",
  styleUrl: "./employees-page.component.scss",
  providers: [ConfirmationService, MessageService],
})
export class EmployeesPageComponent implements OnInit {
  @ViewChild("dt") dt: Table | undefined;
  @ViewChild("op") overlayPanel!: OverlayPanel;
  // Loading states
  loading: boolean = false;
  isLoading: boolean = false;
  // Self data
  myId: string = "";
  myRole: string = "";
  // Modals states
  addModalVisible: boolean = false;
  editModalVisible: boolean = false;
  bestMonthModalVisible: boolean = false;
  // Shifts
  users: IUser[] = [];

  constructor(
    private shiftsService: ShiftsService,
    private usersService: UsersService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.shiftsService.getAllUsersObs().subscribe((users) => {
      this.users = [...users];
    });
    this.usersService.getLoggedUser().subscribe((data) => {
      if (data) {
        this.myId = data._id;
        this.myRole = data.userRole;
      }
    });
    this.shiftsService
      .getAreAllUsersLoading()
      .subscribe((val) => (this.isLoading = val));
  }

  // Get all employees when accessing the page
  ngOnInit(): void {
    this.shiftsService.getAllUsers();
  }

  // Show error toast notification
  showError(message: string) {
    this.messageService.add({
      severity: "error",
      detail: message,
      summary: "Error",
    });
  }
  // Show success toast notification
  showSuccess(message: string) {
    this.messageService.add({
      severity: "success",
      detail: message,
      summary: "Success",
    });
  }

  /* 
  If I am the selected employee, redirect to /profile
  Else, redirect to /employee/userId
  */
  onEditClick(employee: any): void {
    if (employee._id === this.myId) this.router.navigate(["/profile"]);
    else this.router.navigate([`/employee/${employee._id}`]);
  }

  // Delete all shifts of an employee
  async onDeleteEmployeeShifts(employeeId: any): Promise<void> {
    this.isLoading = true;
    try {
      await this.shiftsService.deleteShiftsByUserId(employeeId);
    } catch (error: any) {
      this.showError(error.message);
    } finally {
      this.isLoading = false;
      this.showSuccess("Shifts deleted succesfully.");
    }
  }

  // Search input (by workplace)
  applyFilterGlobal($event: any, stringVal: any): void {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  // Export shifts to Excel document
  async exportExcel(): Promise<void> {
    this.isLoading = true;
    try {
      const xlsx = await import("xlsx");
      const worksheet = xlsx.utils.json_to_sheet(
        this.users.map((user: any) => ({
          "First name": user.firstName,
          "Last name": user.lastName,
          "Email address": user.email,
          Username: user.username,
          Birthdate: new Date(user.birthDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }))
      );

      const workbook = {
        Sheets: { Shifts: worksheet },
        SheetNames: ["Shifts"],
      };

      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      FileSaver.saveAs(data, `ShiftEase_${new Date().getTime()}.xlsx`);
    } catch (error) {
      this.showError(
        "An error has occurred while exporting Excel. Please try again."
      );
    } finally {
      this.isLoading = false;
      this.messageService.add({
        severity: "success",
        detail: "Data exported successfully.",
        summary: "Success",
      });
    }
  }
}
