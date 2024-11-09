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

  offres: OffreModel[] = []; // Tableau pour stocker les offres
  utilisateurConnecte: any = null; // Pour stocker l'utilisateur connecté
  tabCandidat: any[] = [];

  constructor(private offreService: OffreService, private router: Router,private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchOffres(); // Appel à la méthode pour récupérer les offres
    this.fetchCandidats();
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
  fetchCandidats() {
    this.authService.getAllCandidat().subscribe(
      (response: any) => {
        console.log('Réponse de l\'API :', response);
        if (Array.isArray(response)) {
          this.tabCandidat = response;
          console.log('Candidats :', this.tabCandidat);
        } else {
          console.warn('Aucune donnée trouvée dans la réponse :', response);
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des Candidats :', error);
      }
    );
  }
  voirProfil(candidatId: number) {
    this.router.navigate(['/candidats', candidatId]);
  }
  getimage(photo: string): string {
    return `http://127.0.0.1:8000/storage/${photo}`;
  }
}
