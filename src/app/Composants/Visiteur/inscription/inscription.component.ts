import { Component, inject, OnInit } from '@angular/core';
import { UserModel } from '../../../Models/user.model';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ServiceModel } from '../../../Models/service.model';
import { ServiceService } from '../../../Services/service.service';

import { OffreModel } from '../../../Models/offre.model';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { HeaderadminComponent } from '../../../headeradmin/headeradmin.component';


@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule,ReactiveFormsModule,HeaderComponent],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {
  // Injections
  private authService = inject(AuthService);
  private serviceService = inject(ServiceService);
  private router = inject(Router); // Injecter le Router
  errors: any = {};
  photoError: string = '';

  ngOnInit(): void {
    this.fetchService(),
    this.user = this.getUser();
  }

  // Déclaration des variables
  userObject: UserModel = {
    service_ids: [],
  };
  alertMessage: string = "";  // Par défaut, vide
  tabService: ServiceModel[] = [];
  OffreObject: OffreModel = {
    service_ids: [], // Initialiser à un tableau vide
  };
  user: any; // Pour stocker l'objet utilisateur


  // Déclaration des méthodes
  register() {
    this.errors = {}; // Réinitialiser les erreurs
    let valid = true;

    // Vérifier que les champs obligatoires sont remplis (sauf email)
    if (!this.userObject.nom) {
        this.errors.nom = "Le nom est obligatoire.";
        valid = false;
    }
    if (!this.userObject.prenom) {
        this.errors.prenom = "Le prénom est obligatoire.";
        valid = false;
    }
    if (!this.userObject.adresse) {
        this.errors.adresse = "L'adresse est obligatoire.";
        valid = false;
    }
    if (!this.userObject.nom_utilisateur) {
        this.errors.nom_utilisateur = "Le nom d'utilisateur est obligatoire.";
        valid = false;
    }
    if (!this.userObject.telephone) {
        this.errors.telephone = "Le téléphone est obligatoire.";
        valid = false;
    }
    if (!this.userObject.password) {
        this.errors.password = "Le mot de passe est obligatoire.";
        valid = false;
    }

    // Vérifier si les champs nom, prenom, adresse et nom_utilisateur ne contiennent pas de chiffres
    const regex = /^[A-Za-z\s]+$/;
    if (this.userObject.nom && !regex.test(this.userObject.nom)) {
        this.errors.nom = "Le nom ne doit pas contenir de chiffres.";
        valid = false;
    }
    if (this.userObject.prenom && !regex.test(this.userObject.prenom)) {
        this.errors.prenom = "Le prénom ne doit pas contenir de chiffres.";
        valid = false;
    }
    if (this.userObject.adresse && !regex.test(this.userObject.adresse)) {
        this.errors.adresse = "L'adresse ne doit pas contenir de chiffres.";
        valid = false;
    }
    if (this.userObject.nom_utilisateur && !regex.test(this.userObject.nom_utilisateur)) {
        this.errors.nom_utilisateur = "Le nom d'utilisateur ne doit pas contenir de chiffres.";
        valid = false;
    }

    // Vérifier si le téléphone contient exactement 9 chiffres
    const phoneRegex = /^[0-9]{9}$/;
    if (this.userObject.telephone && !phoneRegex.test(this.userObject.telephone)) {
        this.errors.telephone = "Le téléphone doit contenir exactement 9 chiffres.";
        valid = false;
    }
    const passwordRegex = /^[A-Za-z0-9]{8}$/;
    if (this.userObject.password && !passwordRegex.test(this.userObject.password)) {
      this.errors.password = "Le mot de passe doit contenir exactement 8 caractères alphanumériques.";
      valid = false;
    }

    // Si une erreur est détectée, ne pas envoyer les données
    if (!valid) {
        return;
    }

    if (this.userObject.role === 'demandeur_d_emploi' && this.OffreObject.service_ids.length === 0) {
        this.errors.service = 'Veuillez sélectionner au moins un service.';
        return;
    }

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
    for (let serviceId of this.OffreObject.service_ids) {
        formData.append('service_ids[]', serviceId);
    }

    // Envoi de la requête au service Auth
    this.authService.register(formData).subscribe(
      (response: any) => {
        console.log(response);
        // Afficher une alerte de succès
        Swal.fire({
          title: 'Inscription réussie !',
          text: 'Félicitation! Vous êtes maintenant inscrit sur la plateforme.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // Rediriger vers la page de connexion
          this.router.navigate(['/connexion']);
        });
      },
      (error: HttpErrorResponse) => {
        if (error.status === 422 && error.error) {
          this.errors = error.error.errors || {}; // Stockez les erreurs pour chaque champ
        } else {
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'inscription.',
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
  // Methode pour gerer les changements de checkbox
  onCheckboxChange(event: any, serviceId: any) {
    if (event.target.checked) {
      this.OffreObject.service_ids.push(serviceId);
    } else {
      const index = this.OffreObject.service_ids.indexOf(serviceId);
      if (index > -1) {
        this.OffreObject.service_ids.splice(index, 1);
      }
    }
    console.log(this.OffreObject.service_ids);
  }
}
