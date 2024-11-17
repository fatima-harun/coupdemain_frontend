import { Component, inject, OnInit } from '@angular/core';
import { OffreService } from '../../../Services/offre.service';
import { OffreModel } from '../../../Models/offre.model';
import { ServiceModel } from '../../../Models/service.model';

import Swal from 'sweetalert2';
import { ServiceService } from '../../../Services/service.service';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../Services/auth.service';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';


@Component({
  selector: 'app-publication-offre',
  standalone: true,
  imports: [FormsModule, CommonModule,HeaderComponent],
  templateUrl: './publication-offre.component.html',
  styleUrl: './publication-offre.component.css'
})
export class PublicationOffreComponent implements OnInit {
  private offreService = inject(OffreService);
  private serviceService = inject(ServiceService);
  private authService = inject(AuthService);

  tabOffres: OffreModel[] = [];
  tabService: ServiceModel[] = [];
  OffreObject: OffreModel = {
    service_ids: [],
  };
  user: any;
  utilisateurConnecte: any = null;
  errors: any = {};  // Pour stocker les messages d'erreur

  ngOnInit(): void {
    this.fetchService();
    this.user = this.getUser();
  }

  fetchService() {
    this.serviceService.getAllService().subscribe(
      (response: any) => {
        if (response.data) {
          this.tabService = response.data;
        }
      }
    );
  }

  // Méthode pour valider les champs
  validateForm(): boolean {
    // Réinitialiser les erreurs à chaque soumission
this.errors = {};
let valid = true;

// Validation de la description
if (!this.OffreObject.description) {
  this.errors.description = "La description est requise.";
  valid = false;
} else {
  const regex = /^[A-Za-z\s]+$/;
  if (!regex.test(this.OffreObject.description)) {
    this.errors.description = "La description ne doit pas contenir de chiffres.";
    valid = false;
  }
}
if (!this.OffreObject.lieu) {
  this.errors.lieu = "Le lieu de travail est requis.";
  valid = false;
}
if (!this.OffreObject.salaire || Number(this.OffreObject.salaire) <= 0) {
  this.errors.salaire = "Le salaire doit être un nombre positif.";
  valid = false;
}
if (!this.OffreObject.profil) {
  this.errors.profil = "Le profil recherché est requis.";
  valid = false;
}
if (!this.OffreObject.horaire) {
  this.errors.horaire = "L'horaire est requis.";
  valid = false;
} else {
  const horaireRegex = /^([0-9]|1[0-9]|2[0-3])h-([0-9]|1[0-9]|2[0-3])h$/;
  const matches = this.OffreObject.horaire.match(horaireRegex);
  if (!matches) {
    this.errors.horaire = "L'horaire doit être au format '8h-17h'.";
    valid = false;
  } else {
    const debut = parseInt(matches[1], 10);
    const fin = parseInt(matches[2], 10);
    if (debut >= fin) {
      this.errors.horaire = "L'heure de début doit être inférieure à l'heure de fin.";
      valid = false;
    }
  }
}
if ( this.OffreObject.service_ids.length === 0) {
  this.errors.service = 'Veuillez sélectionner au moins un service.';
  valid = false;
}
// Validation de la date de début
if (!this.OffreObject.date_debut) {
  this.errors.date_debut = "La date de début est requise.";
  valid = false;
} else {
  // Optionnel : vérifiez si la date est valide
  const dateDebut = new Date(this.OffreObject.date_debut);
  if (isNaN(dateDebut.getTime())) {
    this.errors.date_debut = "La date de début doit être une date valide.";
    valid = false;
  }
}

// Validation de la date de fin
if (this.OffreObject.date_debut && this.OffreObject.date_fin && this.OffreObject.date_fin < this.OffreObject.date_debut) {
  this.errors.date_fin = "La date de fin doit être après la date de début.";
  valid = false;
}

// Validation de la date limite
if (this.OffreObject.date_debut && this.OffreObject.date_limite && this.OffreObject.date_limite > this.OffreObject.date_debut) {
  this.errors.date_limite = "La date limite doit être avant la date de début.";
  valid = false;
}
if (!this.OffreObject.nombre_postes || Number(this.OffreObject.nombre_postes) <= 0) {
  this.errors.nombre_postes = "Le nombre de postes doit être un nombre positif.";
  valid = false;
}

return valid;
}

  addOffre() {
    if (!this.validateForm()) {
      return;
    }

    const token = this.getToken();
    if (token) {
      let formdata = new FormData();

      // Ajout sécurisé des valeurs dans FormData en vérifiant qu'elles ne sont pas undefined
      if (this.OffreObject.description) formdata.append('description', this.OffreObject.description);
      if (this.OffreObject.lieu) formdata.append('lieu', this.OffreObject.lieu);
      if (this.OffreObject.horaire) formdata.append('horaire', this.OffreObject.horaire);
      if (this.OffreObject.date_fin) formdata.append('date_fin', this.OffreObject.date_fin);
      if (this.OffreObject.date_limite) formdata.append('date_limite', this.OffreObject.date_limite);
      if (this.OffreObject.date_debut) formdata.append('date_debut', this.OffreObject.date_debut);
      if (this.OffreObject.salaire) formdata.append('salaire', this.OffreObject.salaire);
      if (this.OffreObject.profil) formdata.append('profil', this.OffreObject.profil);

      // Convertir `nombre_postes` en chaîne uniquement si défini
      if (this.OffreObject.nombre_postes !== undefined) {
        formdata.append('nombre_postes', this.OffreObject.nombre_postes.toString());
      }

      for (let serviceId of this.OffreObject.service_ids) {
        formdata.append('service_ids[]', serviceId);
      }

      this.offreService.addOffre(formdata).subscribe(
        (response: any) => {
          this.OffreObject = {
            service_ids: [],
            description: undefined,
            lieu: undefined,
            salaire: undefined,
            horaire: undefined,
            nombre_postes: undefined,
            date_debut: undefined,
            date_fin: undefined,
            date_limite: undefined,
            profil: undefined,
          };
          Swal.fire({
            title: 'Succès!',
            text: 'Votre offre d\'emploi a bien été ajoutée.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        (error) => {
          Swal.fire({
            title: 'Erreur!',
            text: 'Il y a eu un problème lors de l\'ajout de l\'offre.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      alert('L\'utilisateur n\'est pas authentifié. Veuillez vous connecter.');
    }
  }


  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUser() {
    this.utilisateurConnecte = this.authService.getUser();
  }

  logout() {
    this.authService.logout();
  }

  onCheckboxChange(event: any, serviceId: any) {
    if (event.target.checked) {
      this.OffreObject.service_ids.push(serviceId);
    } else {
      const index = this.OffreObject.service_ids.indexOf(serviceId);
      if (index > -1) {
        this.OffreObject.service_ids.splice(index, 1);
      }
    }
  }
}
