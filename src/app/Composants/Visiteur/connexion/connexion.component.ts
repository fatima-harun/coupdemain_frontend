import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { UserModel } from '../../../Models/user.model';
import { FormsModule } from '@angular/forms';
import { AlertShowMessage } from '../../../Services/alertMessage';
import { Role } from '../../../Models/role.model';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [RouterLink, FormsModule,RouterModule,HeaderComponent],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  // Injection de dependances
  private authService = inject(AuthService);
  private router = inject(Router);

  // Declaration des variables
  userObject: UserModel = {}; // un objet qui a pour type UserModel qui se trouve dans Models/user.model.ts
  alertMessage: string = ""; // cette variable permettra de stocker la valeur de l'alerte


  connexion() {
    if (this.userObject.nom_utilisateur && this.userObject.password) {
      this.authService.login(this.userObject).subscribe(
        (response: any) => {

          console.log(response.access_token);
          console.log("user",response.user.nom);

          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('role', response.user.roles[0].name);
            localStorage.setItem('access_token', response.access_token);
            console.log(localStorage.getItem('role'));
            // private redirectionrole(role_id)

            if (response.user.roles) {
              if (response.user.roles.some((role: Role) => role.name === 'admin')) {
                this.router.navigateByUrl('portail');
              } else if (response.user.roles.some((role: Role) => role.name === 'employeur')) {
                this.router.navigateByUrl('offre');
              } else if (response.user.roles.some((role: Role) => role.name === 'demandeur_d_emploi')) {
                this.router.navigateByUrl('portail');
              }
            } else {
              this.router.navigateByUrl('');
            }

          }
        },

      );
    }
  }
  

}
