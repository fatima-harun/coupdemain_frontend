import { UserModel } from './../../Models/user.model';
import { ExperienceService } from './../../Services/experience.service';
import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { AuthService } from '../../Services/auth.service'; // Import du service Auth
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ServiceModel } from '../../Models/service.model';
import { CompetenceModel } from '../../Models/competence.model';
import { ExperienceModel } from '../../Models/experience.model';
import { CompetenceService } from '../../Services/competences.service'; // Import du service Compétences
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../../Services/service.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent implements OnInit {
  user: any = null; // Stocke les informations de l'utilisateur
  tabService: ServiceModel[] = [];
  competences: CompetenceModel[] = [];
  experiences: ExperienceModel[] = [];

  isEmployeur: boolean = false;
  isEmploye: boolean = false;
  competenceObject: CompetenceModel = {}; // Objet pour stocker la compétence en cours d'édition
  experienceObject: CompetenceModel = {}
  competenceId: string | null = null; // ID de la compétence
  experienceId: string | null = null; // ID de l'experience
  competenceData = {
    libelle: '',
    description: ''
  }; // Données pour la modification des compétences
  experienceData = {
    libelle: '',
    description: ''
  };

  UserObject: UserModel = {
    service_ids: [], // Initialiser à un tableau vide
  };
  infosObject = {
    user: {
      id: '',
      name: '',
    },
  };
  utilisateurConnecte: any = null;


  // Injection des services
  private serviceService = inject(ServiceService);
  private competenceService = inject(CompetenceService);
  private experienceService = inject(ExperienceService);

  constructor(private authService: AuthService, private route: ActivatedRoute,) {}


  ngOnInit(): void {
    this.utilisateurConnecte = this.authService.getUser();
    if (this.utilisateurConnecte) {
      this.infosObject.user.id = this.utilisateurConnecte.id;
      }
    this.loadUserInfo(); // Charger les informations utilisateur à l'initialisation
    this.checkUserRole(); // Vérifier le rôle de l'utilisateur
    this.route.paramMap.subscribe(params => {
      const paramCompetenceId = params.get('competenceId');
      this.competenceId = paramCompetenceId ? String(paramCompetenceId) : null; // Conversion en chaîne ou null
      if (this.competenceId) {
        this.loadCompetenceById(this.competenceId); // Charger la compétence spécifique si l'ID est présent dans l'URL
      }
      const paramExperienceId = params.get('experienceId');
      this.experienceId = paramExperienceId ? String(paramExperienceId) : null; // Conversion en chaîne ou null
      if (this.experienceId) {
        this.loadExperienceById(this.experienceId); // Charger la compétence spécifique si l'ID est présent dans l'URL
      }
      this.fetchService();
      this.user = this.getUser();
    });
  }

  // Récupération de tous les services
  fetchService() {
    this.serviceService.getAllService().subscribe(
      (response: any) => {
        if (response.data) {
          this.tabService = response.data; // Remplir le tableau de services
        }
      }
    );
  }
  isServiceChecked(serviceId: number | undefined): boolean {
    if (serviceId === undefined) return false;
    return this.user?.services?.some((service: { id: number; }) => service.id === serviceId) || false;
  }

  onServiceChange(serviceId: number | undefined, event: Event): void {
    if (serviceId === undefined) return;

    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.UserObject.service_ids.includes(serviceId)) {
        this.UserObject.service_ids.push(serviceId); // Ajout d'un service
      }
    } else {
      this.UserObject.service_ids = this.UserObject.service_ids.filter(id => id !== serviceId); // Suppression d'un service
    }

    console.log('Services sélectionnés:', this.UserObject.service_ids); // Debugging
  }

  // Récupère les informations de l'utilisateur depuis l'API
  loadUserInfo(): void {
    this.authService.getUserInfo().subscribe(
      (response: any) => {
        this.user = response;
        this.UserObject = {
          nom: this.user.nom || '',
          prenom: this.user.prenom || '',
          adresse: this.user.adresse || '',
          telephone: this.user.telephone || '',
          email: this.user.email || '',
          service_ids: this.user.services ? this.user.services.map((s: { id: any; }) => s.id) : [],
        };
        console.log('Utilisateur récupéré :', this.user);
        this.getCompetences(); // Charger les compétences après avoir récupéré l'utilisateur
        this.getExperiences(); // Charger les expériences après avoir récupéré l'utilisateur
      },
      (error) => {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        Swal.fire('Erreur', 'Impossible de récupérer vos informations', 'error');
      }
    );
  }

  // Vérifie le rôle de l'utilisateur (employeur ou demandeur d'emploi)
  checkUserRole(): void {
    this.authService.currentUser.subscribe(user => {
      this.isEmployeur = user && user.roles.some((role: { name: string }) => role.name === 'employeur');
      this.isEmploye = user && user.roles.some((role: { name: string }) => role.name === 'demandeur_d_emploi');
    });
  }

  // Gère l'image de profil avec une image par défaut si l'utilisateur n'a pas d'image
  getImage(photo: string | null): string {
    return photo
      ? `http://127.0.0.1:8000/storage/${photo}`
      : 'assets/default-profile.png'; // Image par défaut si aucune n'est fournie
  }

  // Méthode pour récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Fonction pour récupérer les compétences de l'utilisateur
  getCompetences(): void {
    if (this.user) { // Vérifiez que l'utilisateur est défini avant de récupérer ses compétences
      const userRole = this.user.role; // Récupérer le rôle de l'utilisateur
      console.log('Rôle de l\'utilisateur :', userRole); // Afficher le rôle dans la console

      if (userRole === 'demandeur_d_emploi') { // Vérifiez si le rôle est demandeur_d_emploi
        this.competenceService.usercompetence(this.user).subscribe(
          (response: any) => {
            console.log('Compétences récupérées :', response);
            this.competences = response.competences || response.data || [];
            // Vérifiez si chaque compétence contient bien un ID
            this.competences.forEach(comp => {
              console.log('ID de la compétence :', comp.id);
            });
          },
          (error: any) => {
            console.error('Erreur lors de la récupération des compétences :', error);
            Swal.fire('Erreur', 'Impossible de récupérer les compétences', 'error');
          }
        );
      } else {
        console.log('L\'utilisateur n\'est pas un demandeur d\'emploi.'); // Message dans la console si ce n'est pas le bon rôle
      }
    } else {
      console.error('Utilisateur non défini ou ID manquant');
    }
  }



  // Fonction pour récupérer les expériences de l'utilisateur
  getExperiences(): void {
    if (this.user) { // Vérifiez que l'utilisateur est défini avant de récupérer ses expériences
      const userRole = this.user.role; // Récupérer le rôle de l'utilisateur
      console.log('Rôle de l\'utilisateur :', userRole); // Afficher le rôle dans la console

      if (userRole === 'demandeur_d_emploi') { // Vérifiez si le rôle est demandeur_d_emploi
        this.experienceService.userexperience(this.user).subscribe(
          (response: any) => {
            console.log('Expériences récupérées :', response);
            this.experiences = response.experiences || response.data || [];
            this.experiences.forEach(exp => {
              console.log('ID de l\'expérience :', exp.id);
            });
          },
          (error: any) => {
            console.error('Erreur lors de la récupération des expériences :', error);
            Swal.fire('Erreur', 'Impossible de récupérer les expériences', 'error');
          }
        );
      } else {
        console.log('L\'utilisateur n\'est pas un demandeur d\'emploi.'); // Message dans la console si ce n'est pas le bon rôle
      }
    } else {
      console.error('Utilisateur non défini ou ID manquant');
    }
  }


  // Ouvre le modal pour éditer une compétence spécifique
  openEditCompetenceModal(competence: CompetenceModel): void {
    console.log('Compétence sélectionnée :', competence);
    this.competenceObject = { ...competence }; // Clone l'objet compétence pour l'édition
    this.competenceId = competence.id ? String(competence.id) : null; // Assurez-vous que l'ID est une chaîne
}

  // Charge une compétence spécifique par son ID
  loadCompetenceById(competenceId: string): void {
    this.competenceService.getCompetenceById(competenceId).subscribe(
      (response: CompetenceModel) => {
        this.competenceObject = response; // Met à jour l'objet compétence avec les données récupérées
      },
      (error: any) => {
        console.error('Erreur lors de la récupération de la compétence :', error);
        Swal.fire('Erreur', 'Impossible de charger la compétence', 'error');
      }
    );
  }

  // Met à jour une compétence après modification
  updateCompetence(): void {
    if (this.competenceId) {
        this.competenceService.update(this.competenceId, this.competenceObject).subscribe({
            next: (response) => {
                console.log('Compétence mise à jour avec succès :', response);
                Swal.fire({
                    title: 'Succès',
                    text: 'Compétence mise à jour avec succès',
                    icon: 'success',
                    timer: 2000, // Durée en millisecondes avant que l'alerte disparaisse
                    timerProgressBar: true,
                    showConfirmButton: false // Cache le bouton de confirmation
                });

                this.getCompetences(); // Recharge les compétences après mise à jour
            },
            error: (error) => {
                console.error('Erreur lors de la mise à jour de la compétence :', error);
                Swal.fire('Erreur', 'Impossible de mettre à jour la compétence', 'error');
            }
        });
    } else {
        console.error('Aucune compétence sélectionnée pour la mise à jour');
    }
}

deleteCompetence(): void {
  if (this.competenceId) {
      this.competenceService.destroy(this.competenceId).subscribe({
          next: (response) => {
              console.log('Compétence supprimée avec succès :', response);
              Swal.fire({
                  title: 'Succès',
                  text: 'Compétence supprimée avec succès',
                  icon: 'success',
                  timer: 2000, // Durée en millisecondes avant que l'alerte disparaisse
                  timerProgressBar: true,
                  showConfirmButton: false // Cache le bouton de confirmation
              });

              this.getCompetences(); // Recharge les compétences après mise à jour
          },
          error: (error) => {
              console.error('Erreur lors de la suppression de la compètence :', error);
              Swal.fire('Erreur', 'Impossible de supprimer la compétence', 'error');
          }
      });
  } else {
      console.error('Aucune compétence sélectionnée pour la suppression');
  }
}
openEditExperienceModal(experience: ExperienceModel): void {
  console.log('experience sélectionnée :', experience);
  this.experienceObject = { ...experience }; // Clone l'objet compétence pour l'édition
  this.experienceId = experience.id ? String(experience.id) : null;
}
loadExperienceById(experienceId: string): void {
  this.experienceService.getExperienceById(experienceId).subscribe(
    (response: ExperienceModel) => {
      this.experienceObject = response;
    },
    (error: any) => {
      console.error('Erreur lors de la récupération de l\'experience :', error);
      Swal.fire('Erreur', 'Impossible de charger la l\'experience ', 'error');
    }
  );
}
updateExperience(): void {
  if (this.experienceId) {
      this.experienceService.update(this.experienceId, this.experienceObject).subscribe({
          next: (response) => {
              console.log('Expérience mise à jour avec succès :', response);
              Swal.fire({
                  title: 'Succès',
                  text: 'Expérience mise à jour avec succès',
                  icon: 'success',
                  timer: 2000,
                  timerProgressBar: true,
                  showConfirmButton: false
              });

              this.getExperiences();
          },
          error: (error) => {
              console.error('Erreur lors de la mise à jour de l\'expérience :', error);
              Swal.fire('Erreur', 'Impossible de mettre à jour l\'expérience', 'error');
          }
      });
  } else {
      console.error('Aucune expérience sélectionnée pour la mise à jour');
  }
}
deleteExperience(): void {
  if (this.experienceId) {
      this.experienceService.destroy(this.experienceId).subscribe({
          next: (response) => {
              console.log('Expérience supprimée avec succès :', response);
              Swal.fire({
                  title: 'Succès',
                  text: 'Expérience supprimée avec succès',
                  icon: 'success',
                  timer: 2000,
                  timerProgressBar: true,
                  showConfirmButton: false
              });

              this.getExperiences();
          },
          error: (error) => {
              console.error('Erreur lors de la suppression de l\'expérience :', error);
              Swal.fire('Erreur', 'Impossible de supprimer l\'expérience', 'error');
          }
      });
  } else {
      console.error('Aucune expérience sélectionnée pour la suppression');
  }
}
updateUser() {
  console.log(this.UserObject);

  // Vérifiez si tous les champs obligatoires sont remplis
  if (
    !this.UserObject.nom ||
  !this.UserObject.prenom ||
  !this.UserObject.telephone ||
  !this.UserObject.adresse ||
  (this.UserObject.role === 'demandeur_d_emploi' && !this.UserObject.service_ids.length) ||
  (this.UserObject.role !== 'employeur' && !this.UserObject.email) // Vérification de l'email uniquement si l'utilisateur n'est pas un employeur
  ) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Veuillez remplir tous les champs obligatoires',
      confirmButtonColor: '#4AA3A2',
    });
    return; // Sortir si les champs sont manquants
  }

  // Vérifiez si l'ID de l'utilisateur est défini
  if (!this.user) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: "ID de l'utilisateur non trouvé. Veuillez recharger la page.",
      confirmButtonColor: '#4AA3A2',
    });
    return;
  }

  const token = this.getToken();

  if (token) {
    let formdata = new FormData();
    if (this.UserObject.photo) {
      formdata.append('photo', this.UserObject.photo); // Fichier photo
    }
    formdata.append('nom', this.UserObject.nom);
    formdata.append('prenom', this.UserObject.prenom);
    formdata.append('adresse', this.UserObject.adresse);
    formdata.append('telephone', this.UserObject.telephone);

    if (this.UserObject.email) {
        formdata.append('email', this.UserObject.email);
    }

this.UserObject.service_ids.forEach(serviceId => {
    formdata.append('service_ids[]', String(serviceId));
});

// Vérifie que la photo est un fichier avant de l'ajouter
if (this.UserObject.photo) {
    formdata.append('photo', this.UserObject.photo);
}

    console.log(formdata);
    this.authService.updateUser(formdata).subscribe(
      (response: any) => {
        console.log(response);
        this.UserObject = {
          service_ids: [],
        };

        // Afficher le popup et attendre 1 seconde avant de le fermer
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Utilisateur mis à jour avec succès',
          confirmButtonColor: '#4AA3A2',
          timer: 1000, // Le popup se ferme après 1 seconde
        }).then(() => {
          // Récupérer les détails de l'utilisateur pour les mettre à jour sans recharger la page
          this.loadUserInfo();
        });
      },
      (error) => {
        console.error("Erreur lors de la mise à jour de l'utilisateur", error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Une erreur s'est produite lors de la mise à jour de l'utilisateur",
          confirmButtonColor: '#4AA3A2',
        });
      }
    );
  } else {
    console.error("Token non trouvé, l'utilisateur doit être authentifié.");
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: "L'utilisateur n'est pas authentifié. Veuillez vous connecter.",
      confirmButtonColor: '#4AA3A2',
    });
  }
}
// Ajout des champs dans formData

// Méthode pour uploader l'image
uploadImage(event: any) {
  console.log(event.target.files[0]);
  this.UserObject.photo = event.target.files[0];
}
// Récupérer l'utilisateur connecté
getUser() {
  this.utilisateurConnecte = this.authService.getUser();
  console.log('Utilisateur connecté:', this.utilisateurConnecte);
}
}
