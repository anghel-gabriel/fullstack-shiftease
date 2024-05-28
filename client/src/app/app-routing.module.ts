import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MyShiftsPageComponent } from "./pages/my-shifts-page/my-shifts-page.component";
import { ProfilePageComponent } from "./pages/profile-page/profile-page.component";
import { RegisterPageComponent } from "./pages/register-page/register-page.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { ErrorPageComponent } from "./pages/error-page/error-page.component";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { EmployeesPageComponent } from "./pages/employees-page/employees-page.component";
import { AllShiftsPageComponent } from "./pages/all-shifts-page/all-shifts-page.component";
import { EmployeePageComponent } from "./pages/employee-page/employee-page.component";
import { ResetPasswordPageComponent } from "./pages/reset-password-page/reset-password-page.component";

const routes: Routes = [
  // authentication routes
  {
    path: "register",
    component: RegisterPageComponent,
  },
  { path: "sign-in", component: LoginPageComponent },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  // users routes
  {
    path: "",
    component: MyShiftsPageComponent,
  },
  {
    path: "profile",
    component: ProfilePageComponent,
  },
  // admin routes
  {
    path: "employees",
    component: EmployeesPageComponent,
  },
  {
    path: "shifts",
    component: AllShiftsPageComponent,
  },
  {
    path: "employee/:employeeId",
    component: EmployeePageComponent,
  },

  {
    path: "reset-password/:token",
    component: ResetPasswordPageComponent,
  },

  // fallback route
  { path: "**", component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
