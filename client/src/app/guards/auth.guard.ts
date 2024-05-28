import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { UsersService } from "../services/users.service";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.usersService.getLoggedUser().pipe(
      take(1),
      map((user) => {
        if (user) {
          this.router.navigate(["/"]);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
