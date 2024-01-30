import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (this.authService.isAuthenticated()) {
      const uid = await this.authService.getCurrentUserId();

      if (uid) {
        const userRole = await this.authService.getUserRole(uid);

        if (userRole === 'admin') {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }

    this.router.navigate(['/login']);
    return false;
  }
}
