import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { UsersService } from "../services/users.service";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(private usersService: UsersService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.usersService.getLoggedUser().pipe(
      take(1),
      map((user) => {
        if (user && user.userRole === "admin") {
          return true;
        } else {
          this.router.navigate(["/not-authorized"]);
          return false;
        }
      })
    );
  }
}
