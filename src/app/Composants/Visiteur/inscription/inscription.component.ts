import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserModel } from '../../../Models/user.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  // Déclaration des variables
  userObject: UserModel = {} 
  alertMessage: string = "";  // Par défaut, vide

  // Déclaration des méthodes 
  register() {
    const formData = new FormData();
  
    // Ajout des champs dans formData
    if (this.userObject.photo) {
      formData.append('photo', this.userObject.photo); // Fichier photo
    }
  
    // Utilisation de la coalescence nulle pour s'assurer que les valeurs sont définies
    formData.append('nom', this.userObject.nom ?? ''); // Utiliser '' si nom est undefined
    formData.append('prenom', this.userObject.prenom ?? ''); // Utiliser '' si prenom est undefined
    formData.append('CNI', this.userObject.CNI ?? ''); // Utiliser '' si CNI est undefined
    formData.append('email', this.userObject.email ?? ''); // Utiliser '' si email est undefined
    formData.append('role', this.userObject.role ?? ''); // Utiliser '' si role est undefined
    formData.append('sexe', this.userObject.sexe ?? ''); // Utiliser '' si sexe est undefined
    formData.append('adresse', this.userObject.adresse ?? ''); // Utiliser '' si adresse est undefined
    formData.append('telephone', this.userObject.telephone ?? ''); // Utiliser '' si telephone est undefined
    formData.append('password', this.userObject.password ?? ''); // Utiliser '' si password est undefined
  
    // Envoi de la requête au service Auth
    this.authService.register(formData).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        console.error('Error:', error);
        if (error.status === 422 && error.error) {
          this.alertMessage = 'Erreur de validation: ' + JSON.stringify(error.error);
        } else {
          this.alertMessage = 'Une erreur est survenue lors de l\'inscription.';
        }
      }
    );
  }
  

  // Méthode pour uploader l'image 
  uploadImage(event: any) {
    console.log(event.target.files[0]);
    this.userObject.photo = event.target.files[0];
  }
}
