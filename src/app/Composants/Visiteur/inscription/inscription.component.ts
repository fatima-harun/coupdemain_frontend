import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router'; // Importer Router
import { UserModel } from '../../../Models/user.model';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HeaderComponent } from '../../header/header.component';
import { ServiceModel } from '../../../Models/service.model';
import { ServiceService } from '../../../Services/service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [RouterLink, FormsModule, HeaderComponent, CommonModule],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {
  // Injections
  private authService = inject(AuthService);
  private serviceService = inject(ServiceService);
  private router = inject(Router); // Injecter le Router

  ngOnInit(): void {
    this.fetchService(),
    this.user = this.getUser();
  }

  // Déclaration des variables
  userObject: UserModel = {};
  alertMessage: string = "";  // Par défaut, vide
  tabService: ServiceModel[] = [];
  user: any; // Pour stocker l'objet utilisateur

  // Déclaration des méthodes
  register() {
    this.fetchService();
    const formData = new FormData();

    // Ajout des champs dans formData
    if (this.userObject.photo) {
      formData.append('photo', this.userObject.photo); // Fichier photo
    }

    // Utilisation de la coalescence nulle pour s'assurer que les valeurs sont définies
    formData.append('nom', this.userObject.nom ?? '');
    formData.append('prenom', this.userObject.prenom ?? '');
    formData.append('nom_utilisateur', this.userObject.nom_utilisateur ?? '');
    formData.append('email', this.userObject.email ?? '');
    formData.append('role', this.userObject.role ?? '');
    formData.append('sexe', this.userObject.sexe ?? '');
    formData.append('adresse', this.userObject.adresse ?? '');
    formData.append('telephone', this.userObject.telephone ?? '');
    formData.append('password', this.userObject.password ?? '');
    formData.append('service_id', this.userObject.service_id ?? '');

    // Envoi de la requête au service Auth
    this.authService.register(formData).subscribe(
      (response: any) => {
        console.log(response);
        // Afficher une alerte de succès
        Swal.fire({
          title: 'Inscription réussie !',
          text: 'Félicitation!Vous êtes maintenant inscrit sur la plateforme.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // Rediriger vers la page de connexion
          this.router.navigate(['/connexion']);
        });
      },
      (error: HttpErrorResponse) => {
        console.error('Error:', error);
        if (error.status === 422 && error.error) {
          this.alertMessage = 'Erreur de validation: ' + JSON.stringify(error.error);
          // Afficher une alerte d'erreur
          Swal.fire({
            title: 'Erreur de validation',
            text: this.alertMessage,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          this.alertMessage = 'Une erreur est survenue lors de l\'inscription.';
          // Afficher une alerte d'erreur générique
          Swal.fire({
            title: 'Erreur',
            text: this.alertMessage,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    );
  }

  // Récupération de tous les services
  fetchService() {
    this.serviceService.getAllService().subscribe(
      (response: any) => {
        if (response.data) {
          this.tabService = response.data;
        }
      }
    );
  }

  // Méthode pour uploader l'image
  uploadImage(event: any) {
    console.log(event.target.files[0]);
    this.userObject.photo = event.target.files[0];
  }

  // Méthode pour récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }


  // Méthode pour récupérer l'objet utilisateur depuis le localStorage
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null; // Retourne l'objet utilisateur ou null
  }
}
