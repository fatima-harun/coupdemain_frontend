import { Component, inject, OnInit } from '@angular/core';
import { InfosService } from './../../../Services/infos.service';
import { HeaderComponent } from "../../header/header.component";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';

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

  // Création d'un objet pour stocker les données à envoyer
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

    // Envoi des données via le service, en incluant user.id
    this.infosService.addinfos(this.infosObject.competence, this.infosObject.experience, this.infosObject.user.id).subscribe({
        next: (response) => {
            console.log('Réponse reçue : ', response);
        },
        error: (error) => {
            console.error('Erreur lors de l\'ajout des informations : ', error);
        }
    });
}


  // Méthode pour récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
