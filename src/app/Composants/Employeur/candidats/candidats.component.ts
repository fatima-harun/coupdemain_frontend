import { UserModel } from './../../../Models/user.model';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../header/header.component";
import { ServiceModel } from '../../../Models/service.model';

@Component({
  selector: 'app-candidats',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './candidats.component.html',
  styleUrl: './candidats.component.css'
})
export class CandidatsComponent implements OnInit {

  tabCandidat: any[] = []; // Initialisation de tabCandidat
  tabService: ServiceModel[] = [];


  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchCandidats();
  }
  fetchCandidats() {
    this.authService.getAllCandidat().subscribe(
        (response: any) => {
            console.log('Réponse de l\'API :', response); // Afficher la réponse entière pour le débogage
            if (Array.isArray(response)) {
                this.tabCandidat = response; // Assigner les données à tabCandidat
                console.log('Candidats :', this.tabCandidat); // Journal pour confirmation
            } else {
                console.warn('Aucune donnée trouvée dans la réponse :', response);
            }
        },
        (error: any) => {
            console.error('Erreur lors de la récupération des Candidats :', error);
        }
    );
}
getimage(photo: string): string {
  return `http://127.0.0.1:8000/storage/${photo}`;
}


}


