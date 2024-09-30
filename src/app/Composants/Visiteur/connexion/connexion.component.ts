import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { UserModel } from '../../../Models/user.model';
import { FormsModule } from '@angular/forms';
import { AlertShowMessage } from '../../../Services/alertMessage';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [RouterLink, FormsModule,RouterModule],
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
    console.log(this.userObject);
    if (!this.userObject.email || !this.userObject.password) {
      this.alertMessage = "L'email et le mot de passe sont obligatoires";
      AlertShowMessage("alert-danger");
    } else {  
      this.authService.login(this.userObject).subscribe(
        (response: any) => {
          console.log(response); // Vérifiez ici la structure de la réponse
          if (response.success) {
            localStorage.setItem("infos_Connexion", JSON.stringify(response));
  
            const user = response.user;
            console.log('Rôle de l\'utilisateur :', user.role); // Vérifiez le rôle ici
  
            if (user.role === "employeur") {
              console.log('Redirection en cours pour employeur...');
              this.router.navigateByUrl("/portail");
            } else if (user.role === "admin") {
              console.log('Redirection en cours pour admin...');
              this.router.navigateByUrl("/portail");
            } else if (user.role === "demandeur_d_emploi") {
              console.log('Redirection en cours pour demandeur d\'emploi...');
              this.router.navigateByUrl("/portail");
            } else {
              console.log('Rôle inconnu, aucune redirection.');
            }
          }       
        },
        (error) => {
          console.log("les erreurs");
          console.log(error.error.message);
          this.alertMessage = error.error.message;
          AlertShowMessage("alert-danger");
        }
      );
    }
  }
  
}
