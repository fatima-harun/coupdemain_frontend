import { Statut } from './../../../Models/statut';
import { CandidatureService } from './../../../Services/candidature.service';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OffreService } from '../../../Services/offre.service';
import { OffreModel } from '../../../Models/offre.model';
import { ServiceModel } from '../../../Models/service.model';
import { HeaderComponent } from "../../header/header.component";
import { FooterComponent } from '../../../footer/footer.component';
import { AuthService } from '../../../Services/auth.service';
import Swal from 'sweetalert2';
import { ServiceService } from '../../../Services/service.service';
import { FormsModule } from '@angular/forms';
import { CandidatureModel } from '../../../Models/candidature.model';
import { CompetenceModel } from '../../../Models/competence.model';
import { ExperienceModel } from '../../../Models/experience.model';
import { UserModel } from '../../../Models/user.model';

@Component({
  selector: 'app-details-offres',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './details-offres.component.html',
  styleUrls: ['./details-offres.component.css'] // Corrigé de styleUrl à styleUrls
})
export class DetailsOffresComponent implements OnInit {
  offreId!: number; // L'ID de l'offre
  offre: OffreModel = {} as OffreModel; // Initialisation
  tabService: ServiceModel[] = [];
  private serviceService = inject(ServiceService);
  missingFields: string[] = [];
  isLoading: boolean = true; // État de chargement
  candidatureData: CandidatureModel = {
    id: 0,
    offre_id: 0,
    user_id:0,
    user: {
      id: undefined,
      photo: undefined,
      nom: '',
      prenom: '',
      email: '',
      nom_utilisateur: '',
      sexe: '',
      role: '',
      telephone: '',
      adresse: '',
      password: '',
      service_ids: []
    },
    date_candidature: new Date(),
    statut: undefined,
    services: []
  };

  user: any = null; // Stocke les informations de l'utilisateur
  competences: CompetenceModel[] = [];
  experiences: ExperienceModel[] = [];
  UserObject: UserModel = {
    service_ids: [], // Initialiser à un tableau vide
  };
  isCandidatureSoumise: boolean = false; // État du bouton "Postuler"
  candidatures: CandidatureModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private offreService: OffreService,
    private authService: AuthService,
    private candidatureService: CandidatureService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.offreId = +params['id'];
      this.getOffreDetails();
      this.fetchService(); // Récupérer tous les services
      this.loadUserInfo(); // Charger les informations de l'utilisateur
    });
  }

  getOffreDetails() {
    this.offreService.getOffresByid(this.offreId).subscribe(
      (response: any) => {
        this.offre = response.data || {};
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des détails de l\'offre:', error);
        this.isLoading = false;
      }
    );
  }

  fetchService() {
    this.serviceService.getAllService().subscribe(
      (response: any) => {
        if (response.data) {
          this.tabService = response.data; // Remplir le tableau de services
        }
      }
    );
  }

  loadUserInfo(): void {
    this.authService.getUserInfo().subscribe(
      (response: any) => {
        this.user = response;
        this.UserObject = {
          nom: this.user.nom || '',
          prenom: this.user.prenom || '',
          adresse: this.user.adresse || '',
          telephone: this.user.telephone || '',
          email: this.user.email || '',
          service_ids: this.user.services ? this.user.services.map((s: { id: any; }) => s.id) : [],
        };
        console.log('Utilisateur récupéré :', this.user);
      },
      (error) => {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        Swal.fire('Erreur', 'Impossible de récupérer les informations', 'error');
      }
    );
  }

  postuler() {
    if (!this.user || !this.offreId) {
      Swal.fire('Erreur', 'Veuillez vous assurer que vous êtes connecté et que l\'offre est valide.', 'error');
      return;
    }
    // Construction de l'objet `candidatureData` avec toutes les propriétés requises
    this.candidatureData = {
      id: 0, // Vous pouvez mettre 0 ou null ici, selon votre logique
      offre_id: this.offreId,
      user_id: this.user.id,
      user: {
        id: this.user.id,
        photo: this.user.photo,
        nom: this.user.nom,
        prenom: this.user.prenom,
        email: this.user.email,
        nom_utilisateur: this.user.nom_utilisateur,
        sexe: this.user.sexe,
        role: this.user.role,
        telephone: this.user.telephone,
        adresse: this.user.adresse,
        password: '', // à remplir si nécessaire
        service_ids: this.user.service_ids || []
      },
      date_candidature: new Date(),
      statut: Statut.EnCours,
      services: this.user.services || [] // Inclut les services de l'utilisateur si disponibles
    };
    this.candidatureService.postuler(this.candidatureData).subscribe(
      response => {
        console.log('Candidature soumise avec succès:', response);
        Swal.fire('Succès', 'Votre candidature a été soumise avec succès.', 'success');
      },
      error => {
        console.error('Erreur lors de la soumission de la candidature:', error);
        Swal.fire('Erreur', 'Impossible de soumettre votre candidature.', 'error');
      }
    );
  }


}
