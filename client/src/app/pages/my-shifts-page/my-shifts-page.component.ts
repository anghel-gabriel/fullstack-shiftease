import { Component, OnInit, ViewChild } from "@angular/core";
import * as FileSaver from "file-saver";
import { OverlayPanel } from "primeng/overlaypanel";
import { Table } from "primeng/table";
import { ConfirmationService, MessageService } from "primeng/api";
import { AuthenticationService } from "src/app/services/authentication.service";
import { defaultPhotoURL } from "src/app/utils/defaultProfileImage";
import { getImageUrl } from "src/app/utils/workplaces";
import { DatabaseService } from "src/app/services/database.service";

@Component({
  selector: "app-my-shifts-page",
  templateUrl: "./my-shifts-page.component.html",
  styleUrls: ["./my-shifts-page.component.scss"],
  providers: [ConfirmationService, MessageService],
})
export class MyShiftsPageComponent {
  @ViewChild("dt") dt: Table | undefined;
  @ViewChild("op") overlayPanel!: OverlayPanel;
  // loading states
  loading: boolean = false;
  isLoading: boolean = false;
  // user data
  userPhotoURL: any;
  userFirstName: string = "";
  // modals
  addModalVisible = false;
  editModalVisible = false;
  bestMonthModalVisible = false;
  statisticsModalVisible = false;
  // comment
  currentComments: string = "";
  // shifts
  shifts: any = [];
  selectedShift: any = null;
  getWorkplaceImage = getImageUrl;

  // chart options
  data = {
    labels: ["A", "B", "C"],
    datasets: [
      {
        data: [540, 325, 702],
        backgroundColor: "red",
        hoverBackgroundColor: "blue",
      },
    ],
  };
  options = {
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
    private db: DatabaseService,
    private auth: AuthenticationService,
    private toast: MessageService
  ) {
    this.db.getMyShiftsObsBackend().subscribe((data) => (this.shifts = data));

    this.auth.getLoggedUser().subscribe((data) => {
      this.userPhotoURL = data?.photoURL || defaultPhotoURL;
      this.userFirstName = data?.firstName;
    });
  }

  showError(message: any) {
    this.toast.add({
      severity: "error",
      summary: "Error",
      detail: message,
    });
  }

  showSuccess(message: any) {
    this.toast.add({
      severity: "success",
      summary: "Success",
      detail: message,
    });
  }

  // best month modal
  onBestMonthClick() {
    this.bestMonthModalVisible = true;
  }
  onBestMonthModalClose() {
    this.bestMonthModalVisible = false;
  }

  // add shift modal
  onAddClick() {
    this.addModalVisible = true;
  }
  async onAddSubmit(addedShift: any) {
    this.loading = true;
    this.addModalVisible = false;
    try {
      await this.db.addShiftBackend(addedShift);
    } catch (error: any) {
      this.showError(
        "An error has occured while adding shift. Please try again."
      );
    } finally {
      this.loading = false;
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: "Shift added successfully.",
      });
    }
  }
  onAddModalClose() {
    this.addModalVisible = false;
  }

  // edit modal
  onEditClick(shift: any) {
    this.selectedShift = shift;
    this.editModalVisible = true;
  }
  async onEditSubmit(editedShift: any) {
    try {
      this.loading = true;
      this.editModalVisible = false;
      await this.db.editShift(this.selectedShift.id, editedShift);
    } catch (error: any) {
      this.showError(
        "An error has occured while updating shift. Please try again."
      );
    } finally {
      this.loading = false;
    }
  }
  onEditModalClose() {
    this.selectedShift = null;
    this.editModalVisible = false;
  }

  // delete confirmation popup
  onDeleteClick(event: Event, shift: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure?",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-sm",
      accept: () => {
        this.onDeleteConfirm(shift.id);
      },
      reject: () => {},
    });
  }
  async onDeleteConfirm(shiftId: any) {
    this.loading = true;
    try {
      await this.db.deleteShift(shiftId);
    } catch (error: any) {
      this.showError(
        "An error has occured while deleting shift. Please try again."
      );
    } finally {
      this.loading = false;
    }
  }

  // search input (by workplace)
  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  // view comment button overlay panel
  toggleOverlayPanel(event: any, comments: string): void {
    if (comments) {
      this.currentComments = comments;
      this.overlayPanel.toggle(event);
    } else this.overlayPanel.hide();
  }

  // shifts to excel
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
}
