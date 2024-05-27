import { Component, OnInit } from "@angular/core";
import { ShiftsService } from "src/app/services/shifts-service";
import { getBestMonthStats } from "src/app/utils/computation";

interface IChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }>;
}

interface IChartOptions {
  plugins: {
    legend: {
      display: boolean;
      position: string;
      labels: {
        usePointStyle: boolean;
        color: string;
      };
    };
  };
  responsive: boolean;
  maintainAspectRatio: boolean;
}

interface IBestMonthStats {
  month: string;
  year: string;
  hoursWorked: number;
  averageHourlyWage: number;
  profit: number;
}

@Component({
  selector: "app-best-month",
  templateUrl: "./best-month.component.html",
  styleUrls: ["./best-month.component.scss"],
})
export class BestMonthComponent {
  bestMonthStats: IBestMonthStats = {
    month: "No stats",
    year: "No stats",
    hoursWorked: 0,
    averageHourlyWage: 0,
    profit: 0,
  };
  data: IChartData | null = null;
  options: IChartOptions | null = null;

  constructor(private shiftsService: ShiftsService) {
    this.shiftsService.getMyShiftsObs().subscribe((shifts) => {
      this.bestMonthStats = getBestMonthStats(shifts);
      this.updateChartData(shifts);
    });
  }

  updateChartData(shifts: any[]): void {
    const workplaceProfits = shifts.reduce((acc, shift) => {
      const { workplace, profit } = shift;
      acc[workplace] = (acc[workplace] || 0) + profit;
      return acc;
    }, {});

    const workplaces = Object.keys(workplaceProfits);
    const profits = Object.values(workplaceProfits);

    this.data = {
      labels: workplaces,
      datasets: [
        {
          data: profits as number[],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
        },
      ],
    };

    this.options = {
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            usePointStyle: true,
            color: "#555",
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }
}
