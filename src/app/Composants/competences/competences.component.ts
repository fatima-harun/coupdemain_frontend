import { CompetenceService } from './../../Services/competences.service';
import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { AuthService } from '../../Services/auth.service';
import { CompetenceModel } from '../../Models/competence.model';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-competences',
  standalone: true,
  imports: [HeaderComponent, FooterComponent,FormsModule],
  templateUrl: './competences.component.html',
  styleUrls: ['./competences.component.css']
})
export class CompetencesComponent implements OnInit {
  private competenceService = inject(CompetenceService);
  private authService = inject(AuthService);
  user: any;
  utilisateurConnecte: any = null; // Pour stocker l'utilisateur connecté
  competenceObject: CompetenceModel = {}
  competenceId!:number


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

  ajoutCompetence() {
    console.log(this.competenceObject);
    if (!this.competenceObject.libelle || !this.competenceObject.description) {
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
        formdata.append('description', this.competenceObject.description);
        formdata.append('libelle', this.competenceObject.libelle); // Corrigez 'lieu' à 'libelle'

        console.log(formdata);
        this.competenceService.store(formdata).subscribe( // Appel correct à la méthode du service
          (response: any) => {
            console.log(response);
            this.competenceObject = {}; // Réinitialisation de l'objet compétence
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Compétence ajoutée avec succès',
              confirmButtonColor: '#4AA3A2',
            });
          },
          (error) => {
            console.error('Erreur lors de l\'ajout de la compétence', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur s\'est produite lors de l\'ajout de la compétence',
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
