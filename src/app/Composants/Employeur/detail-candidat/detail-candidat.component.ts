import { CommentairesService } from './../../../Services/commentaires.service';
import { ExperienceService } from './../../../Services/experience.service';
import { ExperienceModel } from './../../../Models/experience.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { ServiceModel } from '../../../Models/service.model';
import { HeaderComponent } from '../../header/header.component';
import { CompetenceService } from '../../../Services/competences.service';
import { CompetenceModel } from '../../../Models/competence.model';
import { FooterComponent } from '../../../footer/footer.component';
import Swal from 'sweetalert2';
import { CommentaireModel } from '../../../Models/commentaire.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-candidat',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent,FormsModule],
  templateUrl: './detail-candidat.component.html',
  styleUrls: ['./detail-candidat.component.css']
})
export class DetailCandidatComponent implements OnInit {
  tabService: ServiceModel[] = [];
  competences: CompetenceModel[] = [];
  experiences: ExperienceModel[] = [];
  candidat: any; // Stocke les détails du candidat
  candidatId: number = 0;
  CommentObject: CommentaireModel = {
    employer_id: 0,
    note:0
  };
  isCurrentUserAuthor(commentaire: any): boolean {
    return this.candidatService.currentUserId === commentaire.employer_id;
  }

  editingCommentId: number | null = null;
  editingDescription: string = '';
  isEmployeur: boolean = false;
  isEmploye:boolean = false;
  commentaires: any[] = [];
  stars: boolean[] = [false, false, false, false, false];
  currentPage = 1; // Page actuelle
  commentsPerPage = 3; // Nombre de commentaires par page

  constructor(
    private route: ActivatedRoute,
    private candidatService: AuthService,
    private competenceService: CompetenceService,
    private CommentairesService: CommentairesService,
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du candidat depuis l'URL
    this.candidatId = +this.route.snapshot.paramMap.get('candidatId')!; // Assigner à candidatId

    // Appeler le service pour récupérer les détails du candidat
    this.candidatService.getCandidatDetails(this.candidatId).subscribe(
      (data) => {
        this.candidat = data;
        console.log('Détails du candidat:', this.candidat);

        // Charger les compétences une fois que les détails du candidat sont récupérés
        this.competences = this.candidat.competences;
        this.experiences = this.candidat.experiences;
        console.log(this.competences);
      },
      (error) => {
        console.error('Erreur lors de la récupération du candidat:', error);
      }
    );
    this.candidatService.currentUser.subscribe(user => {
      // Vérifie si le rôle "employeur" existe dans le tableau des rôles
    this.isEmployeur = user && user.roles.some((role: { name: string; }) => role.name === 'employeur'); // Vérifie si l'utilisateur a le rôle "employeur"
    this.isEmploye = user && user.roles.some((role: { name: string; }) => role.name === 'demandeur_d_emploi');
    });
    this.loadCommentaires();
  }
   // Fonction pour définir la note sélectionnée
   setRating(rating: number) {
    this.CommentObject.note = rating;
    this.stars = this.stars.map((_, index) => index < rating); // Met à jour l'état des étoiles
  }
  getimage(photo: string): string {
    return `http://127.0.0.1:8000/storage/${photo}`;
  }

  // Méthode pour récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  addComment() {
    if (!this.CommentObject.description?.trim()) {
        return this.showError('Veuillez remplir tous les champs obligatoires');
    }

    const token = this.getToken();
    if (!token) {
        return this.showError('L\'utilisateur n\'est pas authentifié. Veuillez vous connecter.');
    }
    console.log('userId:', this.candidatId);
    console.log('Description:', this.CommentObject.description);

    let formData = new FormData();
    formData.append('description', this.CommentObject.description);
    formData.append('note', this.CommentObject.note.toString());

    this.CommentairesService.addComment(formData, this.candidatId).subscribe(
        (response) => this.showSuccess('Commentaire ajouté avec succès'),
        (error) => {
            console.error('Erreur lors de l\'ajout du commentaire:', error); // Afficher l'erreur dans la console
            this.showError('Vous avez déja commenté pour ce candidat');
        }
    );
}
// Méthodes pour afficher les messages
private showError(message: string) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    confirmButtonColor: '#4AA3A2',
  });
}

private showSuccess(message: string) {
  Swal.fire({
    icon: 'success',
    title: 'Succès',
    text: message,
    confirmButtonColor: '#4AA3A2',
  });
}
loadCommentaires(): void {
  this.CommentairesService.getCommentaires(this.candidatId).subscribe(
    (data) => {
      console.log('Données reçues:', data);
      this.commentaires = data;
    },
    (error) => {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  );
}
openEditModal(commentId: number, description: string): void {
  this.editingCommentId = commentId;
  this.editingDescription = description;
}

submitEdit(): void {
  if (this.editingCommentId !== null) {
    const currentUserId = this.candidatService.currentUserId;

    // Find the comment by ID and edit it if authorized
    const comment = this.commentaires.find(comment => comment.id === this.editingCommentId);

    if (comment && currentUserId === comment.employer_id) {
      // Call service to update comment
      this.CommentairesService.editComment(this.editingCommentId, this.editingDescription).subscribe({
        next: (response: any) => {
          this.loadCommentaires(); // Reload comments
          this.resetEditState(); // Clear editing state
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: response.message || 'Commentaire mis à jour avec succès',
            confirmButtonColor: '#4AA3A2',
          });
        },
        error: (error) => {
          console.error('Erreur lors de la modification du commentaire:', error.message || error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur s\'est produite lors de la modification du commentaire',
            confirmButtonColor: '#4AA3A2',
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Non autorisé',
        text: 'Vous ne pouvez modifier que vos propres commentaires.',
        confirmButtonColor: '#4AA3A2',
      });
    }
  }
}

// Reset le formulaire de modification
private resetEditState(): void {
  this.editingCommentId = null;
  this.editingDescription = '';
}

confirmDelete(commentId: number): void {
  Swal.fire({
    title: 'Êtes-vous sûr?',
    text: "Cette action est irréversible!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4AA3A2',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimer!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.deleteComment(commentId);
    }
  });
}

 deleteComment(commentId: number): void {
  this.CommentairesService.destroy(commentId).subscribe({
    next: (response: any) => {
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: response.message || 'Commentaire supprimé avec succès',
        confirmButtonColor: '#4AA3A2',
      });

      // Mettre à jour la liste des commentaires
      this.commentaires = this.commentaires.filter(c => c.id !== commentId);
    },
    error: (error) => {
      console.error('Erreur lors de la suppression du commentaire:', error.message || error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur s\'est produite lors de la suppression du commentaire',
        confirmButtonColor: '#4AA3A2',
      });
    }
  });
}
get paginatedComments() {
  const startIndex = (this.currentPage - 1) * this.commentsPerPage;
  const endIndex = startIndex + this.commentsPerPage;
  return this.commentaires.slice(startIndex, endIndex);
}

nextPage() {
  if (this.currentPage < Math.ceil(this.commentaires.length / this.commentsPerPage)) {
    this.currentPage++;
  }
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}
}
