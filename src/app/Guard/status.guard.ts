// status.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StatusGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUser();

    // Vérifiez si le compte est désactivé
    if (user && user.status === 0) {
      this.router.navigate(['/compte']); // Redirigez si le compte est désactivé
      return false;
    }
    return true;
  }
}
