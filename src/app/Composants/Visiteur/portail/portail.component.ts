import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { OffreService } from '../../../Services/offre.service';
import { OffreModel } from '../../../Models/offre.model';
import { ListeOffresComponent } from '../../Employeur/list-offre/list-offre.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { Router } from '@angular/router';
import { FooterComponent } from '../../../footer/footer.component';
import { YoutubePlayerComponent } from '../../../youtube-player/youtube-player.component';


@Component({
  selector: 'app-portail',
  templateUrl: './portail.component.html',
  styleUrls: ['./portail.component.css'],
  standalone: true,
  imports: [ListeOffresComponent, CommonModule, HeaderComponent,FooterComponent,YoutubePlayerComponent],
})
export class PortailComponent implements OnInit {

  constructor(private offreService: OffreService, private router: Router) {}

  offres: OffreModel[] = []; // Tableau pour stocker les offres
  utilisateurConnecte: any = null; // Pour stocker l'utilisateur connecté

  ngOnInit(): void {
    this.fetchOffres(); // Appel à la méthode pour récupérer les offres
  }

  // Récupération des offres
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
  voirDetails(id: number) {
    this.router.navigate(['/detail', id]);  // Redirection vers la route de détail avec l'ID
  }
}
