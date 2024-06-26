import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { UsersService } from "../../services/users.service";
import { Router } from "@angular/router";

interface INavbarItem {
  label: string;
  icon: string;
  url?: string;
  visible: boolean;
  items?: Array<any>;
  command?: VoidFunction;
}

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  providers: [MessageService],
})
export class NavbarComponent implements OnInit {
  // Navbar items
  navbarItems: INavbarItem[] = [];
  // Loading state
  isLoading: boolean = false;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.usersService.getLoggedUser().subscribe((user) => {
      if (user) this.updateNavbarItems(!!user, user.userRole);
      else this.updateNavbarItems(false, "user");
    });
  }

  updateNavbarItems(isUserLogged: boolean, userRole?: string): void {
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

  showError(message: string): void {
    this.messageService.add({
      severity: "error",
      detail: message,
      summary: "Error",
    });
  }

  async onSignOut(): Promise<void> {
    this.isLoading = true;
    try {
      await this.usersService.logOut();
      await this.router.navigate(["/sign-in"]);
    } catch (error: any) {
      this.showError(error.message);
    } finally {
      this.isLoading = false;
    }
  }
}
