import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserModel } from '../../../Models/user.model';
import { FormsModule } from '@angular/forms';
import { AlertShowMessage } from '../../../Services/alertMessage';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  // Injections 
  private authService = inject(AuthService);

  // declaration des varibles
  userObject: UserModel = {} 
  alertMessage:String = "";
  // Declaration des methodes 
  register() {
    // Tableau pour accumuler les champs manquants
    const missingFields: string[] = [];
  
    // Vérification de chaque champ
    if (!this.userObject.nom) {
      missingFields.push('Nom');
    }
    if (!this.userObject.prenom) {
      missingFields.push('Prénom');
    }
    if (!this.userObject.email) {
      missingFields.push('Email');
    }
    if (!this.userObject.adresse) {
      missingFields.push('Adresse');
    }
    if (!this.userObject.telephone) {
      missingFields.push('Téléphone');
    }
    if (!this.userObject.password) {
      missingFields.push('Mot de passe');
    }
  
    // Si des champs manquent, on affiche un message d'erreur
    if (missingFields.length > 0) {
      this.alertMessage = `Veuillez remplir les champs suivants : ${missingFields.join(', ')}`;
      AlertShowMessage("alert-danger");
    } else {
      // Si tous les champs sont remplis, on procède à l'inscription
      console.log(this.userObject);
      this.authService.register(this.userObject).subscribe(
        (response: any) => {
          console.log(response);
        }
      );
    }
  }
  
}
