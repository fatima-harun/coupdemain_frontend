import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { ServiceModel } from '../../../Models/service.model';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-detail-candidat',
  standalone: true,
  imports: [CommonModule,HeaderComponent],
  templateUrl: './detail-candidat.component.html',
  styleUrl: './detail-candidat.component.css'
})
export class DetailCandidatComponent {
  tabService: ServiceModel[] = [];
  candidat: any; // Stocke les détails du candidat

    constructor(
      private route: ActivatedRoute,
      private candidatService: AuthService
    ) {}

    ngOnInit(): void {
          // Récupérer l'ID du candidat depuis l'URL
          const candidatId = +this.route.snapshot.paramMap.get('candidatId')!;

          // Appeler le service pour récupérer les détails du candidat
          this.candidatService.getCandidatDetails(candidatId).subscribe(
            (data) => {
              this.candidat = data;
              console.log('Détails du candidat:', this.candidat);
            },
            (error) => {
              console.error('Erreur lors de la récupération du candidat:', error);
            }
          );
        }
        getimage(photo: string): string {
          return `http://127.0.0.1:8000/storage/${photo}`;
        }
}



