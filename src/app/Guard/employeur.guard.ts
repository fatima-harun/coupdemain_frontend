import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const AuthEmployeurGuard = () => {
    const router = inject(Router);
    const role = localStorage.getItem('role');
    const user = localStorage.getItem('user');
    const access_token = localStorage.getItem('access_token');

    // Vérifie que token existe et que user est défini avant d'accéder à user.role
    if (!user || role != 'employeur') {
        router.navigateByUrl("/connexion");
        return false;
    }
    return true;
};
