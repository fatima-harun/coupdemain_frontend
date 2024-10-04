// list-offre.component.ts
import { Component, inject, OnInit } from '@angular/core'; 
import { OffreService } from '../../../Services/offre.service';
import { OffreModel } from '../../../Models/offre.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-offre',
  templateUrl: './list-offre.component.html',
  styleUrls: ['./list-offre.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ListeOffresComponent implements OnInit {
  private offreService = inject(OffreService);
  tabOffres: OffreModel[] = [];
  user: any;

  ngOnInit(): void {
    this.fetchOffres();
    this.user = this.getUser();
  }

  fetchOffres() {
    this.offreService.getAllOffre().subscribe(
      (response: any) => {
        if (response.data) {
          this.tabOffres = response.data;
          console.log('Offres:', this.tabOffres);
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des offres:', error);
      }
    );
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Nouvelle méthode pour obtenir seulement 3 offres
  // getLimitedOffres(): OffreModel[] {
  //   return this.tabOffres.slice(0, 3);
  // }
}
