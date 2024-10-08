import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../Services/auth.service'; // Assurez-vous que le chemin est correct
import { OffreService } from '../../../Services/offre.service';
import { OffreModel } from '../../../Models/offre.model';
import { ListeOffresComponent } from '../../Employeur/list-offre/list-offre.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { TruncatePipe } from '../../../truncate.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-portail',
  templateUrl: './portail.component.html',
  styleUrls: ['./portail.component.css'],
  standalone: true,
  imports: [ListeOffresComponent, CommonModule, HeaderComponent, TruncatePipe],
})
export class PortailComponent implements OnInit {

  private offreService = inject(OffreService);
  private authService = inject(AuthService); // Injection de AuthService

  offres: OffreModel[] = []; // Tableau pour stocker les offres
  utilisateurConnecte: any = null; // Pour stocker l'utilisateur connecté

  ngOnInit(): void {
    this.fetchOffres(); // Appel à la méthode pour récupérer les offres
    this.getUser(); // Récupérer les infos de l'utilisateur connecté
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

  // Récupérer l'utilisateur connecté
  getUser() {
    this.utilisateurConnecte = this.authService.getUser();
    console.log('Utilisateur connecté:', this.utilisateurConnecte);
  }

  // Ajoutez une méthode pour gérer la déconnexion
logout() {
  this.authService.logout(); // Supprimer les données d'utilisateur dans le service
   // Redirection après déconnexion
}

}
