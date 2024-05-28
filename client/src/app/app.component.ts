import { Component, OnInit } from "@angular/core";
import { PrimeNGConfig } from "primeng/api";
import { UsersService } from "./services/users.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.usersService.checkAuthenticationBackend();
  }
}
