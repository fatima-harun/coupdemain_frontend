import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';
import { OffreService } from '../../../Services/offre.service';
import { Router } from '@angular/router';
import { OffreModel } from '../../../Models/offre.model';
import { ServiceService } from '../../../Services/service.service';
import { ServiceModel } from '../../../Models/service.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mesoffres',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './mesoffres.component.html',
  styleUrls: ['./mesoffres.component.css'] // Corrigé de styleUrl à styleUrls
})
export class MesoffresComponent implements OnInit {
  offres: any[] = [];
  tabOffres: OffreModel[] = [];
  private serviceService = inject(ServiceService);
  tabService: ServiceModel[] = [];

  constructor(private offreService: OffreService, private router: Router) {}

  ngOnInit(): void {
    this.fetchMyOffres();
    this.fetchService(); // Appelez ceci si nécessaire
  }

  fetchMyOffres() {
    this.offreService.getmesoffres().subscribe(
      (response: any) => {
        if (response.data) {
          this.offres = response.data; // Assurez-vous d'affecter les données ici
          console.log('Offres:', this.offres);
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
}
