import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { AuthService } from '../../Services/auth.service';
import { ExperienceModel } from '../../Models/experience.model';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExperienceService } from '../../Services/experience.service';

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,FormsModule],
  templateUrl: './experiences.component.html',
  styleUrl: './experiences.component.css'
})
export class ExperiencesComponent {

  private experienceService = inject(ExperienceService);
  private authService = inject(AuthService);
  user: any;
  utilisateurConnecte: any = null; // Pour stocker l'utilisateur connecté
  experienceObject: ExperienceModel = {};
  experienceId!:number


  ngOnInit(): void {
    this.getUser(); // Assurez-vous d'appeler cette méthode
  }

  // Méthode pour récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Récupérer l'utilisateur connecté
  getUser() {
    this.utilisateurConnecte = this.authService.getUser();
    console.log('Utilisateur connecté:', this.utilisateurConnecte);
  }
  ajoutexperience() {
    console.log(this.experienceObject);
    if (!this.experienceObject.libelle || !this.experienceObject.description) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Veuillez remplir tous les champs obligatoires',
        confirmButtonColor: '#4AA3A2',
      });
    } else {
      const token = this.getToken();
      if (token) {
        let formdata = new FormData();
        formdata.append('description', this.experienceObject.description);
        formdata.append('libelle', this.experienceObject.libelle);

        console.log(formdata);
        this.experienceService.store(formdata).subscribe(
          (response: any) => {
            console.log(response);
            this.experienceObject = {}; // Réinitialisation de l'objet experience
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Expérience ajoutée avec succès',
              confirmButtonColor: '#4AA3A2',
            });
          },
          (error) => {
            console.error('Erreur lors de l\'ajout de l\'éxperience', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur s\'est produite lors de l\'ajout de l\'éxperience',
              confirmButtonColor: '#4AA3A2',
            });
          }
        );
      } else {
        console.error('Token non trouvé, l\'utilisateur doit être authentifié.');
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'L\'utilisateur n\'est pas authentifié. Veuillez vous connecter.',
          confirmButtonColor: '#4AA3A2',
        });
      }
    }
  }
}
