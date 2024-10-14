import { UserModel } from './../../../Models/user.model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../header/header.component";
import { ServiceModel } from '../../../Models/service.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterComponent } from '../../../footer/footer.component';

@Component({
  selector: 'app-candidats',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent,FooterComponent],
  templateUrl: './candidats.component.html',
  styleUrls: ['./candidats.component.css'] // Correction de styleUrl à styleUrls
})
export class CandidatsComponent implements OnInit {
  tabCandidat: any[] = []; // Initialisation de tabCandidat
  tabService: ServiceModel[] = [];
  private route: ActivatedRoute; // Déclaration de la propriété

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private router: Router, route: ActivatedRoute) {
    this.route = route; // Initialisation de la propriété ici
  }

  ngOnInit(): void {
    this.fetchCandidats();
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

  getimage(photo: string): string {
    return `http://127.0.0.1:8000/storage/${photo}`;
  }

  voirProfil(candidatId: number) {
    this.router.navigate(['/candidats', candidatId]);
  }
}
