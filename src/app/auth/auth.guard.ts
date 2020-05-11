import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment, Router, CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { take, switchMap, tap } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.userAuthenticated.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if(!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          return this.router.navigateByUrl('/home');
        } else {
          return of(isAuthenticated);
        }
      })
    );
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {    
    return this.authService.userAuthenticated.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if(!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          return this.router.navigateByUrl('/home');
        } else {
          return of(isAuthenticated);
        }
      })
    );
  }
}
