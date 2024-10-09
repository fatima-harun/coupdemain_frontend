import { Component, inject, OnInit } from '@angular/core';
import { OffreService } from '../../../Services/offre.service';
import { OffreModel } from '../../../Models/offre.model';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { ServiceModel } from '../../../Models/service.model';
import { ServiceService } from '../../../Services/service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-offre',
  templateUrl: './list-offre.component.html',
  styleUrls: ['./list-offre.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
})
export class ListeOffresComponent implements OnInit {
  private serviceService = inject(ServiceService);
  tabService: ServiceModel[] = [];
  tabOffres: OffreModel[] = [];
  offreObject: OffreModel = {};
  selectedServiceId: number | undefined; // Changement ici
  offres: any[] = [];
  user: any;
  searchText: string = '';

  constructor(private OffreService: OffreService) {}

  ngOnInit(): void {
    this.fetchOffres();
    this.user = this.getUser();
    this.fetchService();
  }

  fetchOffres() {
    this.OffreService.getAllOffre().subscribe(
      (response: any) => {
        if (response.data) {
          this.tabOffres = response.data;
          console.log('Offres:', this.tabOffres);
        }
      },
      (error: any) => { // Changement ici
        console.error('Erreur lors de la récupération des offres:', error);
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

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getOffreObject(offre: any) {
    this.offreObject = offre;
    console.log(this.offreObject);
  }

  // Méthode pour récupérer les offres basées sur le service sélectionné
  getOffresByService(serviceId: number) {
    this.OffreService.getOffresByService(serviceId).subscribe(
      (response: any) => {
        if (response) {
          this.offres = response; // Mise à jour de la liste des offres
          console.log('Offres par service:', this.offres);
        }
      },
      (error: any) => { // Changement ici
        console.error('Erreur lors de la récupération des offres par service:', error);
      }
    );
  }

  filteredOffres(): OffreModel[] {
    // Récupère les services sélectionnés
    const selectedServices = this.tabService.filter(service => service.selected);

    // Si aucun service n'est sélectionné, renvoie toutes les offres
    if (selectedServices.length === 0) {
      return this.tabOffres;
    }

    // Filtre les offres qui contiennent au moins un service sélectionné
    return this.tabOffres.filter(offre =>
      offre.services?.some(service => selectedServices.some(selService => selService.id === service.id)) // Utilisation de ?. pour éviter l'erreur
    );
  }



  // Cette méthode pourrait être appelée depuis le template
  onServiceChange(serviceId: number | undefined) {
    if (serviceId !== undefined) {
      this.getOffresByService(serviceId); // Appelle la fonction seulement si serviceId est défini
    } else {
      console.error('Service ID is undefined');
    }
  }

}
