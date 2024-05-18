import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {HttpClientModule} from '@angular/common/http';

// angular pages
import { MyShiftsPageComponent } from "./pages/my-shifts-page/my-shifts-page.component";
import { ProfilePageComponent } from "./pages/profile-page/profile-page.component";
import { RegisterPageComponent } from "./pages/register-page/register-page.component";
import { AddFormComponent } from "./components/add-form/add-form.component";

// angular components
import { NavbarComponent } from "./components/navbar/navbar.component";

// ui library components
import { MenubarModule } from "primeng/menubar";
import { MenuModule } from "primeng/menu";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { RippleModule } from "primeng/ripple";
import { StepsModule } from "primeng/steps";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { FieldsetModule } from "primeng/fieldset";
import { SelectButtonModule } from "primeng/selectbutton";
import { CalendarModule } from "primeng/calendar";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ErrorPageComponent } from "./pages/error-page/error-page.component";
import { FileUploadModule } from "primeng/fileupload";
import { AvatarModule } from "primeng/avatar";
import { SliderModule } from "primeng/slider";
import { MultiSelectModule } from "primeng/multiselect";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { ChangePasswordFormComponent } from "./components/change-password-form/change-password-form.component";
import { ChangeEmailFormComponent } from "./components/change-email-form/change-email-form.component";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { EditFormComponent } from "./components/edit-form/edit-form.component";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { AngularFireModule } from "@angular/fire/compat";
import { BestMonthComponent } from "./components/best-month/best-month.component";
import { AllShiftsPageComponent } from "./pages/all-shifts-page/all-shifts-page.component";
import { EmployeesPageComponent } from "./pages/employees-page/employees-page.component";
import { EmployeePageComponent } from "./pages/employee-page/employee-page.component";
import { ChartModule } from "primeng/chart";
import { AdminStatsComponent } from "./components/admin-stats/admin-stats.component";
import { firebaseConfig } from "./utils/firebaseConfig";
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';


@NgModule({
  declarations: [
    AppComponent,
    MyShiftsPageComponent,
    NavbarComponent,
    ProfilePageComponent,
    RegisterPageComponent,
    LoginPageComponent,
    AddFormComponent,
    ErrorPageComponent,
    SpinnerComponent,
    ChangePasswordFormComponent,
    ChangeEmailFormComponent,
    ForgotPasswordComponent,
    EditFormComponent,
    BestMonthComponent,
    AllShiftsPageComponent,
    EmployeesPageComponent,
    EmployeePageComponent,
    AdminStatsComponent,
    ResetPasswordPageComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MenubarModule,
    MenuModule,
    ButtonModule,
    ToastModule,
    RippleModule,
    StepsModule,
    CardModule,
    FormsModule,
    CheckboxModule,
    InputTextModule,
    DropdownModule,
    FieldsetModule,
    SelectButtonModule,
    CalendarModule,
    TableModule,
    DialogModule,
    InputGroupModule,
    InputGroupAddonModule,
    ChartModule,
    InputTextareaModule,
    FileUploadModule,
    AvatarModule,
    SliderModule,
    MultiSelectModule,
    OverlayPanelModule,
    ProgressSpinnerModule,
    ConfirmPopupModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(firebaseConfig),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
