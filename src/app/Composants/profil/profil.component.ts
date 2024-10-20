import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { AuthService } from '../../Services/auth.service'; // Import du service
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ServiceModel } from '../../Models/service.model';
import { CompetenceModel } from '../../Models/competence.model';
import { ExperienceModel } from '../../Models/experience.model';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent implements OnInit {
  user: any = null; // Stocke les infos de l'utilisateur
  tabService: ServiceModel[] = [];
  competences: CompetenceModel[] = [];
  experiences:ExperienceModel[]=[];
  constructor(private authService: AuthService) {} // Injection du service

  ngOnInit(): void {
    this.loadUserInfo(); // Charger les infos utilisateur à l'initialisation
  }

  // Récupère les informations de l'utilisateur depuis l'API
  loadUserInfo(): void {
    this.authService.getUserInfo().subscribe(
      (response: any) => {
        this.user = response;
        console.log('Utilisateur récupéré :', this.user);
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        Swal.fire('Erreur', 'Impossible de récupérer vos informations', 'error');
      }
    );
  }

  // Gère l'image de profil avec une image par défaut
  getimage(photo: string | null): string {
    return photo
      ? `http://127.0.0.1:8000/storage/${photo}`
      : 'assets/default-profile.png'; // Image par défaut
  }

  // Fonction pour modifier le profil
  editProfile(): void {
    Swal.fire('Modification', 'Redirection vers la page d\'édition...', 'info');
    // Exemple : Redirection vers une page d'édition (à implémenter)
    // this.router.navigate(['/edit-profile']);
  }

  // Fonction pour supprimer le compte
  deleteAccount(): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
    }).then((result) => {
      if (result.isConfirmed) {
        // Appel de la méthode logout pour supprimer les infos du localStorage
        this.authService.logout();
        Swal.fire('Compte supprimé !', 'Votre compte a été supprimé.', 'success').then(() => {
          window.location.href = '/login'; // Redirection vers la page de login
        });
      }
    });
  }
}
