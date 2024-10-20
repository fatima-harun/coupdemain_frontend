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

@Component({
  selector: 'app-detail-offre',
  templateUrl: './detail-offre.component.html',
  styleUrls: ['./detail-offre.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, FormsModule],
})
export class DetailOffreComponent implements OnInit {

  offreId!: number; // L'ID de l'offre
  offre: OffreModel = {} as OffreModel; // Initialisation

  isEmployeur: boolean = false;
  isEmploye: boolean = false;
  tabService: ServiceModel[] = [];
  private serviceService = inject(ServiceService);
  OffreObject: OffreModel = {
    service_ids: [], // Initialiser à un tableau vide
  };
  isLoading: boolean = true; // État de chargement

  constructor(
    private route: ActivatedRoute,
    private offreService: OffreService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.offreId = +params['id'];
      this.getOffreDetails();
      this.checkUserRole();
      this.fetchService();
    });
  }

  getOffreDetails() {
    this.offreService.getOffresByid(this.offreId).subscribe(
      (response: any) => {
        this.offre = response.data || {};
        console.log('Détails de l\'offre:', this.offre);
        console.log('Services:', this.offre.services); // Vérifie que les services sont bien récupérés
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des détails de l\'offre:', error);
        this.isLoading = false;
      }
    );
  }


  checkUserRole() {
    this.authService.currentUser.subscribe(user => {
      this.isEmployeur = user && user.roles.some((role: { name: string; }) => role.name === 'employeur');
      this.isEmploye = user && user.roles.some((role: { name: string; }) => role.name === 'demandeur_d_emploi');
    });
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
  isServiceChecked(serviceId: number | undefined): boolean {
    if (serviceId === undefined) return false;
    return this.offre?.services?.some(service => service.id === serviceId) || false;
  }

  onServiceChange(serviceId: number | undefined, event: Event): void {
    if (serviceId === undefined) return;

    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.OffreObject.service_ids.includes(serviceId)) {
        this.OffreObject.service_ids.push(serviceId);
      }
    } else {
      this.OffreObject.service_ids = this.OffreObject.service_ids.filter(id => id !== serviceId);
    }
  }

  // Méthode pour mettre à jour l'offre
  update() {
    console.log(this.OffreObject);

    // Vérifiez si tous les champs obligatoires sont remplis
    if (
      !this.OffreObject.description ||
      !this.OffreObject.lieu ||
      !this.OffreObject.service_ids.length ||
      !this.OffreObject.date_debut ||
      !this.OffreObject.date_fin ||
      !this.OffreObject.date_limite ||
      !this.OffreObject.horaire ||
      !this.OffreObject.salaire ||
      !this.OffreObject.profil ||
      !this.OffreObject.nombre_postes
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Veuillez remplir tous les champs obligatoires',
        confirmButtonColor: '#4AA3A2',
      });
      return; // Sortir si les champs sont manquants
    }

    // Vérifiez si l'ID de l'offre est défini
    if (!this.OffreObject.id) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'ID de l\'offre non trouvé. Veuillez recharger la page.',
        confirmButtonColor: '#4AA3A2',
      });
      return; // Sortir si l'ID n'est pas défini
    }

    const token = this.getToken();
    if (token) {
      let formdata = new FormData();
      formdata.append('description', this.OffreObject.description);
      formdata.append('lieu', this.OffreObject.lieu);
      formdata.append('horaire', this.OffreObject.horaire);
      formdata.append('date_fin', this.OffreObject.date_fin);
      formdata.append('date_limite', this.OffreObject.date_limite);
      formdata.append('date_debut', this.OffreObject.date_debut);
      formdata.append('salaire', this.OffreObject.salaire);
      formdata.append('profil', this.OffreObject.profil);
      formdata.append('nombre_postes', this.OffreObject.nombre_postes.toString());

      // Ajoutez les IDs de service
      for (let serviceId of this.OffreObject.service_ids) {
        formdata.append('service_ids[]', serviceId);
      }
      console.log(formdata);
      this.offreService.update(this.OffreObject.id,formdata).subscribe(
        (response: any) => {
          console.log(response);
          this.OffreObject = {
            service_ids: [], // Réinitialiser le tableau de services
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
            icon: 'success',
            title: 'Succès',
            text: 'Offre mise à jour avec succès',
            confirmButtonColor: '#4AA3A2',
          });
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'offre', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur s\'est produite lors de la mise à jour de l\'offre',
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

  // Méthode pour récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
