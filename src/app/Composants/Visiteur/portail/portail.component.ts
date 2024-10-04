import { Component, OnInit, inject } from '@angular/core';
import { OffreService } from '../../../Services/offre.service'; // Assurez-vous que le chemin est correct
import { OffreModel } from '../../../Models/offre.model'; 
import { ListeOffresComponent } from '../../Employeur/list-offre/list-offre.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-portail',
  templateUrl: './portail.component.html',
  styleUrls: ['./portail.component.css'],
  standalone: true,
  imports: [ListeOffresComponent,CommonModule,HeaderComponent],
})
export class PortailComponent implements OnInit {
  private offreService = inject(OffreService);
  offres: OffreModel[] = []; // Tableau pour stocker les offres

  ngOnInit(): void {
    this.fetchOffres(); // Appel à la méthode pour récupérer les offres
  }

  fetchOffres() {
    this.offreService.getAllOffre().subscribe(
      (response: any) => {
        if (response.data) {
          this.offres = response.data;
          console.log('Offres:', this.offres);
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des offres:', error);
      }
    );
  }
}
