import { Component, inject, OnInit } from '@angular/core';
import { OffreService } from '../../../Services/offre.service';
import { OffreModel } from '../../../Models/offre.model';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { ServiceModel } from '../../../Models/service.model';
import { ServiceService } from '../../../Services/service.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';  // 1. Importer le Router
import { FooterComponent } from '../../../footer/footer.component';

@Component({
  selector: 'app-list-offre',
  templateUrl: './list-offre.component.html',
  styleUrls: ['./list-offre.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule,FooterComponent],
})
export class ListeOffresComponent implements OnInit {

  private serviceService = inject(ServiceService);
  tabService: ServiceModel[] = [];
  tabOffres: OffreModel[] = [];
  offreObject: OffreModel = {
    service_id: undefined
  };
  selectedServiceId: number | undefined;
  offres: any[] = [];
  user: any;
  searchText: string = '';

  // 2. Injecter le Router dans le constructeur
  constructor(private OffreService: OffreService, private router: Router) {}

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
      (error: any) => {
        console.error('Erreur lors de la récupération des offres:', error);
      }
    );
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

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getOffresByService(serviceId: number) {
    this.OffreService.getOffresByService(serviceId).subscribe(
      (response: any) => {
        if (response) {
          this.offres = response;
          console.log('Offres par service:', this.offres);
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des offres par service:', error);
      }
    );
  }

  filteredOffres(): OffreModel[] {
    const selectedServices = this.tabService.filter(service => service.selected);

    if (selectedServices.length === 0) {
      return this.tabOffres;
    }

    return this.tabOffres.filter(offre =>
      offre.services?.some(service => selectedServices.some(selService => selService.id === service.id))
    );
  }

  onServiceChange(serviceId: number | undefined) {
    if (serviceId !== undefined) {
      this.getOffresByService(serviceId);
    } else {
      console.error('Service ID is undefined');
    }
  }
  voirDetails(id: number) {
    this.router.navigate(['/detail', id]);  // Redirection vers la route de détail avec l'ID
  }

}
