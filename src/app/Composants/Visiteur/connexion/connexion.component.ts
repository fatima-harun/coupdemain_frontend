import { Component, inject } from '@angular/core';

import { AuthService } from '../../../Services/auth.service';
import { UserModel } from '../../../Models/user.model';

import { AlertShowMessage } from '../../../Services/alertMessage';
import { Role } from '../../../Models/role.model';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [RouterLink, FormsModule,RouterModule, HeaderComponent,CommonModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent {
  // Injection de dépendances
  private authService = inject(AuthService);
  private router = inject(Router);

  // Déclaration des variables
  userObject: UserModel = {
    service_ids: [],
  }; // un objet qui a pour type UserModel qui se trouve dans Models/user.model.ts
  alertMessage: string = ""; // Cette variable permettra de stocker la valeur de l'alerte
  errors: any = {};  // Objet pour stocker les erreurs de validation

  // Méthode de connexion avec validation
  connexion() {
    this.errors = {}; // Réinitialiser les erreurs à chaque soumission

    let valid = true;

    // Vérifier que le nom d'utilisateur est rempli
    if (!this.userObject.nom_utilisateur) {
      this.errors.nom_utilisateur = "Le nom d'utilisateur est requis.";
      valid = false;
    }

    // Vérifier que le mot de passe est rempli
    if (!this.userObject.password) {
      this.errors.password = "Le mot de passe est requis.";
      valid = false;
    }
    const regex = /^[A-Za-z\s]+$/;
    if (this.userObject.nom_utilisateur && !regex.test(this.userObject.nom_utilisateur)) {
      this.errors.nom_utilisateur = "Le nom d'utilisateur ne doit pas contenir de chiffres.";
      valid = false;
  }
  const passwordRegex = /^[A-Za-z0-9]{8}$/;
    if (this.userObject.password && !passwordRegex.test(this.userObject.password)) {
      this.errors.password = "Le mot de passe doit contenir exactement 8 caractères alphanumériques.";
      valid = false;
    }

    // Si la validation échoue, ne pas envoyer la requête
    if (!valid) {
      return;
    }

    // Si les validations passent, procéder à la connexion
    this.authService.login(this.userObject).subscribe(
      (response: any) => {
        // Vérifier le statut de l'utilisateur immédiatement après l'authentification
        if (response.user.status === 0) {
          // Si le compte est désactivé, redirigez vers une page d'avertissement
          this.router.navigate(['/compte']);
          return;
        }

        // Si le compte est actif, procéder à la sauvegarde des informations de l'utilisateur
        console.log(response.access_token);
        console.log("user", response.user.nom);

        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('role', response.user.roles[0].name);
          localStorage.setItem('access_token', response.access_token);
          console.log(localStorage.getItem('role'));

          // Redirection en fonction du rôle de l'utilisateur
          if (response.user.roles) {
            if (response.user.roles.some((role: Role) => role.name === 'admin')) {
              window.location.href = 'dashboard';
            } else if (response.user.roles.some((role: Role) => role.name === 'employeur')) {
              window.location.href = '/offre';
            } else if (response.user.roles.some((role: Role) => role.name === 'demandeur_d_emploi')) {
              window.location.href = 'portail';
            }
          } else {
            this.router.navigateByUrl('');
          }
        }
      },
      (error) => {
        console.error('Erreur lors de la connexion:', error);
      }
    );
  }
}
