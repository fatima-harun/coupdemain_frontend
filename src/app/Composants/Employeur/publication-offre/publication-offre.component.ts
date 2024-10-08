import { Component, inject, OnInit } from '@angular/core';
import { OffreService } from '../../../Services/offre.service';
import { OffreModel } from '../../../Models/offre.model';
import { ServiceModel } from '../../../Models/service.model';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ServiceService } from '../../../Services/service.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-publication-offre',
  standalone: true,
  imports: [FormsModule,CommonModule,HeaderComponent],
  templateUrl: './publication-offre.component.html',
  styleUrl: './publication-offre.component.css'
})
export class PublicationOffreComponent implements OnInit {

  // Injection de dependances
  private offreService = inject(OffreService);
  private serviceService = inject(ServiceService);
  private authService = inject(AuthService);

  // Declaration des variables
  tabOffres: OffreModel[] = [];
  tabService:ServiceModel[] = [];
  OffreObject: OffreModel = {};
  user: any;
  utilisateurConnecte: any = null; // Pour stocker l'utilisateur connecté


  ngOnInit(): void {
    this.fetchService();
    this.user = this.getUser(); // Récupération de l'objet utilisateur lors de l'initialisation
  }

  // Récupération de tous les services
  fetchService(){
    this.serviceService.getAllService().subscribe(
      (response:any) => {
       if(response.data){
        this.tabService = response.data;
       }
      }
    )
  }

  // Méthode pour ajouter une offre
  addOffre() {
    console.log(this.OffreObject);

    // Vérifier que tous les champs obligatoires sont remplis
    if (!this.OffreObject.description ||
        !this.OffreObject.lieu ||
        !this.OffreObject.service_id ||
        !this.OffreObject.date_debut ||
        !this.OffreObject.date_fin ||
        !this.OffreObject.date_limite ||
        !this.OffreObject.horaire ||
        !this.OffreObject.salaire ||
        !this.OffreObject.profil ||
        !this.OffreObject.nombre_postes) {
        // Affichage d'une alerte en cas de champs manquants
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Veuillez remplir tous les champs obligatoires",
          confirmButtonColor: "#4AA3A2",
        });
    } else {
      // Récupération du token
      const token = this.getToken();

      if (token) {
        // Création de l'objet formdata avec les données de l'offre
        let formdata = new FormData();
        formdata.append("description", this.OffreObject.description);
        formdata.append("lieu", this.OffreObject.lieu);
        formdata.append("horaire", this.OffreObject.horaire);
        formdata.append("service_id", this.OffreObject.service_id);
        formdata.append("date_fin", this.OffreObject.date_fin);
        formdata.append("date_limite", this.OffreObject.date_limite);
        formdata.append("date_debut", this.OffreObject.date_debut);
        formdata.append("salaire", this.OffreObject.salaire);
        formdata.append("profil", this.OffreObject.profil);
        formdata.append('nombre_postes', this.OffreObject.nombre_postes.toString()); // Convertir en chaîne

        console.log(formdata);

        // Envoi de la requête pour ajouter l'offre avec le token d'authentification
        this.offreService.addOffre(formdata).subscribe(
          (response: any) => {
            console.log(response);
            // Réinitialiser l'objet Offre après ajout
            this.OffreObject = {};
            // Actualiser la liste des offres ou afficher un message de succès
            Swal.fire({
              icon: "success",
              title: "Succès",
              text: "Offre ajoutée avec succès",
              confirmButtonColor: "#4AA3A2",
            });
          },
          (error) => {
            console.error("Erreur lors de l'ajout de l'offre", error);
            Swal.fire({
              icon: "error",
              title: "Erreur",
              text: "Une erreur s'est produite lors de l'ajout de l'offre",
              confirmButtonColor: "#4AA3A2",
            });
          }
        );
      } else {
        console.error("Token non trouvé, l'utilisateur doit être authentifié.");
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "L'utilisateur n'est pas authentifié. Veuillez vous connecter.",
          confirmButtonColor: "#4AA3A2",
        });
      }
    }
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

  // Methode pour stocker l'objet offre
  getOffreObject(offre: any) {
    this.OffreObject = offre;
  }
  logout() {
    this.authService.logout(); // Supprimer les données d'utilisateur dans le service
     // Redirection après déconnexion
  }

}
