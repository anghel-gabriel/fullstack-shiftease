import { Component, OnInit, ViewChild } from "@angular/core";
import * as FileSaver from "file-saver";
import { OverlayPanel } from "primeng/overlaypanel";
import { Table } from "primeng/table";
import { ConfirmationService, MessageService } from "primeng/api";
import { UsersService } from "src/app/services/users.service";
import { defaultPhotoURL } from "src/app/utils/URLs";
import { getImageUrl } from "src/app/utils/workplaces";
import { ShiftsService } from "src/app/services/shifts";
import { IData, IOptions, IShift } from "src/app/utils/interfaces";

@Component({
  selector: "app-my-shifts-page",
  templateUrl: "./my-shifts-page.component.html",
  styleUrls: ["./my-shifts-page.component.scss"],
  providers: [ConfirmationService, MessageService],
})
export class MyShiftsPageComponent implements OnInit {
  @ViewChild("dt") dt: Table | undefined;
  @ViewChild("op") overlayPanel!: OverlayPanel;
  // Loading states
  loading: boolean = false;
  isLoading: boolean = false;
  // Logged user data
  userPhotoURL: string = "";
  userFirstName: string = "";
  // Modals
  addModalVisible: boolean = false;
  editModalVisible: boolean = false;
  bestMonthModalVisible: boolean = false;
  statisticsModalVisible: boolean = false;
  // Current displayed comment
  currentComments: string = "";
  // Shifts
  shifts: IShift[] = [];
  selectedShift: IShift | null = null;
  getWorkplaceImage = getImageUrl;

  // Chart options
  data: IData = {
    labels: ["A", "B", "C"],
    datasets: [
      {
        data: [540, 325, 702],
        backgroundColor: "red",
        hoverBackgroundColor: "blue",
      },
    ],
  };
  options: IOptions = {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: "green",
        },
      },
    },
  };

  constructor(
    private confirmationService: ConfirmationService,
    private shiftsService: ShiftsService,
    private usersService: UsersService,
    private toast: MessageService
  ) {
    this.shiftsService
      .getMyShiftsObsBackend()
      .subscribe((data) => (this.shifts = data));
    this.usersService.getLoggedUser().subscribe((data) => {
      this.userPhotoURL = data?.photoURL;
      this.userFirstName = data?.firstName;
    });
    this.shiftsService
      .getAreMyShiftsLoading()
      .subscribe((value) => (this.isLoading = value));
  }

  // Get my shifts when accessing the page
  ngOnInit() {
    this.shiftsService.getUserShifts();
  }

  // Toast notification methods
  showError(message: string) {
    this.toast.add({
      severity: "error",
      summary: "Error",
      detail: message,
    });
  }
  showSuccess(message: string) {
    this.toast.add({
      severity: "success",
      summary: "Success",
      detail: message,
    });
  }

  onBestMonthClick() {
    this.bestMonthModalVisible = true;
  }
  onBestMonthModalClose() {
    this.bestMonthModalVisible = false;
  }

  // Open add shift modal
  onAddClick() {
    this.addModalVisible = true;
  }
  // Close add shift modal
  onAddModalClose() {
    this.addModalVisible = false;
  }
  // Add shift method
  async onAddSubmit(addedShift: IShift) {
    this.loading = true;
    this.addModalVisible = false;
    try {
      await this.shiftsService.addShift(addedShift);
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: "Shift added successfully.",
      });
    } catch (error: any) {
      this.showError(error.message);
    } finally {
      this.loading = false;
    }
  }

  // Open edit shift modal
  onEditClick(shift: IShift) {
    this.selectedShift = shift;
    this.editModalVisible = true;
  }
  // Close edit shift modal
  onEditModalClose() {
    this.selectedShift = this.shifts[0];
    this.editModalVisible = false;
  }
  // Edit shift method
  async onEditSubmit(editedShift: IShift) {
    this.loading = true;
    try {
      this.editModalVisible = false;
      if (!this.selectedShift || !this.selectedShift._id)
        return this.showError("No shift selected for editing");
      await this.shiftsService.editShift(this.selectedShift?._id, editedShift);
    } catch (error: any) {
      this.showError(error.message);
    } finally {
      this.loading = false;
    }
  }

  // Delete confirmation popup
  onDeleteClick(event: Event, shift: IShift) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure?",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-sm",
      accept: () => {
        this.onDeleteConfirm(shift._id as string);
      },
      reject: () => {},
    });
  }
  async onDeleteConfirm(shiftId: string) {
    this.loading = true;
    try {
      await this.shiftsService.deleteShift(shiftId);
      this.showSuccess("Shift has beeen deleted successfully.");
    } catch (error: any) {
      this.showError(error.message);
    } finally {
      this.loading = false;
    }
  }

  // Search by workplace
  applyFilterGlobal($event: any, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  // View comment overlay panel
  toggleOverlayPanel(event: any, comments: string): void {
    if (comments) {
      this.currentComments = comments;
      this.overlayPanel.toggle(event);
    } else this.overlayPanel.hide();
  }

  // Export shifts to excel
  async exportExcel() {
    this.isLoading = true;
    try {
      const xlsx = await import("xlsx");
      const worksheet = xlsx.utils.json_to_sheet(
        this.shifts.map((shift: any) => ({
          Workplace: shift.workplace,
          "Start Time": shift.startTime.toLocaleString(),
          "End Time": shift.endTime.toLocaleString(),
          "Hourly Wage ($)": shift.hourlyWage,
          "Profit ($)": shift.profit,
          Comments: shift.comments,
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
      this.showSuccess("Data exported successfully.");
    }
  }
  // TODO: check if export does work
  // TODO: check if best month does work
  // TODO: check if charts work
}
