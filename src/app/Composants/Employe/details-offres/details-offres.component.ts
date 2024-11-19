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
    // Vérifier si l'utilisateur est connecté
    if (!this.user) {
        Swal.fire('Erreur', 'Vous devez être connecté pour postuler.', 'error');
        return;
    }

    // Vérifier si l'utilisateur est un employeur
    if (this.user.role === 'employeur') {
        Swal.fire('Erreur', 'Vous êtes un employeur, vous ne pouvez pas postuler à des offres.', 'error');
        return;
    }

    // Préparer les données de la candidature
    const candidatureData = {
      offre_id: this.offreId,
      user_id: this.user.id,
      statut: 'en cours',  
    };

    // Appeler le service pour soumettre la candidature
    this.candidatureService.store(candidatureData).subscribe({
        next: (response) => {
            Swal.fire('Succès', 'Votre candidature a été soumise avec succès.', 'success');
        },
        error: (error) => {
            if (error.status === 403) {
                Swal.fire('Erreur', 'Vous êtes un employeur, vous ne pouvez pas postuler.', 'error');
            } else if (error.status === 409) {
                Swal.fire('Erreur', 'Vous avez déjà postulé à cette offre.', 'info');
            } else {
                Swal.fire('Erreur', 'Impossible de soumettre votre candidature.', 'error');
            }
        }
    });
}

}
