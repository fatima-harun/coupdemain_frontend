import { HeaderadminComponent } from './../../../headeradmin/headeradmin.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../../Services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,HeaderadminComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  tabUser : any[] = [];
  employeurs: any[] = [];
  employers: any[] = [];

  ngOnInit(): void {
    this.fetchUser();
    this.loadEmployers();
    this.loadJobSeekers();
  }
  constructor(private authService: AuthService,  private router: Router, route: ActivatedRoute) {

  }
  fetchUser() {
    this.authService.getAllUser().subscribe(
      (response: any) => {
        console.log('Réponse de l\'API :', response);
        if (Array.isArray(response)) {
          this.tabUser = response;
          console.log('Candidats :', this.tabUser);
        } else {
          console.warn('Aucune donnée trouvée dans la réponse :', response);
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des Candidats :', error);
      }
    );
  }
  toggleuserStatus(user: any) {
    this.authService.toggleStatus(user.id).subscribe({
      next: (response: any) => {
        user.status = response.status; // Met à jour le statut localement
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: response.message || 'Statut de l\'utilisateur mis à jour avec succès',
          confirmButtonColor: '#4AA3A2',
        });
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur s\'est produite lors de la mise à jour du statut',
          confirmButtonColor: '#4AA3A2',
        });
      }
    });
  }
  loadEmployers(): void {
    this.authService.getEmployeurs().subscribe((data) => {
      this.employeurs = data;
    });
  }

  loadJobSeekers(): void {
    this.authService.getEmployer().subscribe((data) => {
      this.employeurs= data;
    });
  }
}
