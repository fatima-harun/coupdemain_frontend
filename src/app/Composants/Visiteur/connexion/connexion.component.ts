import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { UserModel } from '../../../Models/user.model';
import { FormsModule } from '@angular/forms';
import { AlertShowMessage } from '../../../Services/alertMessage';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [RouterLink, FormsModule],
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


  // Declaration des methodes 
  connexion(){
    console.log(this.userObject);
    if(!this.userObject.email || !this.userObject.password){
      this.alertMessage = "L'email et le mot de passe sont obligatoires"
      // On importe la methode AlertShowMessage qui se trouve dans le dossier Services avant de l'utiliser
      AlertShowMessage("alert-danger");
    }
    else{  
      this.authService.login(this.userObject).subscribe(
        (response:any) =>{
          // console.log(response); 
          if(response.success){
            // Enregistrement du token et des insfos de l'utilisateur dans le localstorage 
            localStorage.setItem("infos_Connexion", JSON.stringify(response));

            // Redirection de l'utilisateur connecté vers la page lui concernant 
            const user = response.user;
            // console.log(user);            
            if(user.role === "employeur"){
              console.log('Redirection en cours...');
              this.router.navigateByUrl("/portail") // On les membres vers leur page d'accueil
            } else {
              console.log('Connexion échouée');
            }
          }       
        },
        (error) =>{
          console.log("les erreurs");
          console.log(error.error.message);
          this.alertMessage = error.error.message;
          AlertShowMessage("alert-danger");

        }
      )

    }
    
  }

}
