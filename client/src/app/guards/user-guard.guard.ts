import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";
import { Observable, from } from "rxjs";
import { map, take, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserGuard implements CanActivate {
  constructor(private auth: AuthenticationService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // return from(this.auth.waitForAuthStateChecked()).pipe(
    //   switchMap(() =>
    //     this.auth.getLoggedUser().pipe(
    //       take(1),
    //       map((user) => {
    //         if (!user) {
    //           this.router.navigate(["/sign-in"]);
    //           return false;
    //         }
    //         return true;
    //       })
    //     )
    //   )
    // );
    return true;
  }
}
