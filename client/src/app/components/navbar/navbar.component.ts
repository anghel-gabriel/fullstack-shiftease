import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { UsersService } from "../../services/users.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  providers: [MessageService],
})
export class NavbarComponent implements OnInit {
  navbarItems: any[] = [];
  isLoading = false;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.usersService.getLoggedUser().subscribe((user) => {
      this.updateNavbarItems(!!user, user?.userRole);
    });
  }

  updateNavbarItems(isUserLogged: boolean, userRole?: string) {
    this.navbarItems = [
      {
        label: "My shifts",
        icon: "pi pi-fw pi-stopwatch",
        url: "",
        visible: isUserLogged,
      },
      {
        label: "Profile",
        icon: "pi pi-fw pi-pencil",
        url: "profile",
        visible: isUserLogged,
      },
      {
        label: "Dashboard",
        icon: "pi pi-fw pi-wrench",
        visible: isUserLogged && userRole === "admin",
        items: [
          {
            label: "Employees",
            icon: "pi pi-fw pi-users",
            url: "employees",
          },
          {
            label: "All Shifts",
            icon: "pi pi-fw pi-calendar",
            url: "shifts",
          },
        ],
      },
      {
        label: "Sign Out",
        icon: "pi pi-fw pi-power-off",
        command: () => this.onSignOut(),
        visible: isUserLogged,
      },
      {
        label: "Sign In",
        icon: "pi pi-fw pi-arrow-circle-right",
        url: "sign-in",
        visible: !isUserLogged,
      },
      {
        label: "Register",
        icon: "pi pi-fw pi-user-plus",
        url: "register",
        visible: !isUserLogged,
      },
    ];
  }

  showError(message: string) {
    this.messageService.add({
      severity: "error",
      detail: message,
      summary: "Error",
    });
  }

  async onSignOut() {
    this.isLoading = true;
    try {
      await this.usersService.logOutBackend();
      await this.router.navigate(["/sign-in"]);
    } catch (error: any) {
      this.showError(error);
    } finally {
      this.isLoading = false;
    }
  }
}
