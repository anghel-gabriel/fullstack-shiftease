import { Component, OnInit } from "@angular/core";
import { PrimeNGConfig } from "primeng/api";
import { AuthenticationService } from "./services/authentication.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.authService.checkAuthenticationBackend();
  }
}
