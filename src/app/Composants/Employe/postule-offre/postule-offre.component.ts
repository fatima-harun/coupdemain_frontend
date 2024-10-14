import { Component, inject, OnInit } from '@angular/core';
import { InfosService } from './../../../Services/infos.service';
import { HeaderComponent } from "../../header/header.component";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import Swal from 'sweetalert2'; // Import de SweetAlert2

@Component({
  selector: 'app-postule-offre',
  standalone: true,
  imports: [HeaderComponent, FormsModule],
  templateUrl: './postule-offre.component.html',
  styleUrls: ['./postule-offre.component.css']
})
export class PostuleOffreComponent implements OnInit {
  private infosService = inject(InfosService);
  private authService = inject(AuthService);
  utilisateurConnecte: any = null;

  // Objet pour stocker les informations à envoyer
  infosObject = {
    user: {
      id: '',
      name: '',
    },
    competence: {
      libelle: '',
      description: ''
    },
    experience: {
      libelle: '',
      description: ''
    }
  };

  ngOnInit(): void {
    // Récupérer l'utilisateur connecté
    this.utilisateurConnecte = this.authService.getUser();
    if (this.utilisateurConnecte) {
      this.infosObject.user.id = this.utilisateurConnecte.id;
      this.infosObject.user.name = this.utilisateurConnecte.name;
    }
    console.log('Utilisateur connecté:', this.utilisateurConnecte);
  }

  addinfos() {
    console.log(this.infosObject); // Affichage de l'objet dans la console

    // Envoi des données via le service
    this.infosService.addinfos(this.infosObject.competence,this.infosObject.experience,this.infosObject.user.id).subscribe({next: (response) => {
          console.log('Réponse reçue : ', response);

          // Afficher SweetAlert de confirmation
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Les compétences et l\'expérience ont bien été ajoutées.',
            confirmButtonColor: '#3085d6'
          });

          // Réinitialiser le formulaire après ajout
          this.resetForm();
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout des informations : ', error);
        }
      });
  }

  // Méthode pour réinitialiser le formulaire
  resetForm() {
    this.infosObject.competence = { libelle: '', description: '' };
    this.infosObject.experience = { libelle: '', description: '' };
  }

  // Récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
