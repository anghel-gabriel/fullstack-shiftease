import { Component, OnInit, ViewChild } from "@angular/core";
import * as FileSaver from "file-saver";
import { ConfirmationService, MessageService } from "primeng/api";
import { OverlayPanel } from "primeng/overlaypanel";
import { Table } from "primeng/table";
import { ShiftsService } from "src/app/services/shifts-service";
import { IShift } from "src/app/utils/interfaces";
import { getImageUrl } from "src/app/utils/workplaces";

@Component({
  selector: "app-all-shifts-page",
  templateUrl: "./all-shifts-page.component.html",
  styleUrl: "./all-shifts-page.component.scss",
  providers: [ConfirmationService, MessageService],
})
export class AllShiftsPageComponent implements OnInit {
  @ViewChild("dt") dt: Table | undefined;
  @ViewChild("op") overlayPanel!: OverlayPanel;
  // Loading states
  loading: boolean = false;
  isLoading: boolean = false;
  // Modals states
  editModalVisible: boolean = false;
  statisticsModalVisible: boolean = false;
  // Current displayed comments
  currentComments: string = "";
  // Shifts
  shifts: IShift[] = [];
  selectedShift: IShift | null = null;
  getWorkplaceImage = getImageUrl;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private shiftsService: ShiftsService
  ) {
    this.shiftsService.getAllShiftsObs().subscribe((shifts: IShift[]) => {
      this.shifts = [...shifts].map((shift) => {
        return {
          ...shift,
          startTime: new Date(shift.startTime),
          endTime: new Date(shift.endTime),
        };
      });
    });
    this.shiftsService
      .getAreAllShiftsLoading()
      .subscribe((val: boolean) => (this.isLoading = val));
  }

  // Get all shifts when accessing the page
  ngOnInit(): void {
    this.shiftsService.getAllShifts();
  }

  // Show error toast notification
  showError(message: string): void {
    this.messageService.add({
      severity: "error",
      detail: message,
      summary: "Error",
    });
  }

  // Statistics modal actions
  onStatisticsClick(): void {
    this.statisticsModalVisible = true;
  }
  onStatisticsModalClose(): void {
    this.statisticsModalVisible = false;
  }

  // Open edit modal method
  onEditClick(shift: IShift): void {
    this.selectedShift = shift;
    this.editModalVisible = true;
  }
  // Edit shift method
  async onEditSubmit(editedShift: IShift): Promise<void> {
    if (this.selectedShift && this.selectedShift._id) {
      this.loading = true;
      this.editModalVisible = false;
      try {
        await this.shiftsService.editShiftAsAdmin(
          this.selectedShift._id,
          editedShift
        );
      } catch (error: any) {
        this.showError(error.message);
      } finally {
        this.loading = false;
      }
    } else this.showError("Please select a shift");
  }
  // Close edit modal method
  onEditModalClose(): void {
    this.selectedShift = null;
    this.editModalVisible = false;
  }

  // Delete confirmation popup
  onDeleteClick(event: Event, shift: IShift): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure?",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-sm",
      accept: () => {
        this.onDeleteConfirm(shift._id);
      },
      reject: () => {},
    });
  }
  // Delete shift method
  async onDeleteConfirm(shiftId: any): Promise<void> {
    this.loading = true;
    try {
      await this.shiftsService.deleteShiftAsAdmin(shiftId);
    } catch (error: any) {
      this.showError(error.message);
    } finally {
      this.loading = false;
    }
  }

  // Search input (by workplace)
  applyFilterGlobal($event: any, stringVal: string): void {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  // View comment button overlay panel
  toggleOverlayPanel(event: any, comments: string): void {
    if (comments) {
      this.currentComments = comments;
      this.overlayPanel.toggle(event);
    } else this.overlayPanel.hide();
  }

  // Export shifts to Excel document
  async exportExcel(): Promise<void> {
    this.isLoading = true;
    try {
      const xlsx = await import("xlsx");
      const worksheet = xlsx.utils.json_to_sheet(
        this.shifts.map((shift: any) => ({
          Employee: shift.authorFullName,
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
      this.messageService.add({
        severity: "success",
        detail: "Data exported successfully.",
        summary: "Success",
      });
    }
  }
}
