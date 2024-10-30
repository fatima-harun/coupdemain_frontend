import { UserModel } from './../../../Models/user.model';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../header/header.component";
import { ServiceModel } from '../../../Models/service.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterComponent } from '../../../footer/footer.component';
import { ServiceService } from '../../../Services/service.service';

@Component({
  selector: 'app-candidats',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './candidats.component.html',
  styleUrls: ['./candidats.component.css']
})
export class CandidatsComponent implements OnInit {
  tabCandidat: any[] = [];
  candidatsFiltres: any[] = []; // Tableau pour stocker les candidats filtrés
  searchText: string = '';
  tabService: ServiceModel[] = [];
  private route: ActivatedRoute;
  selectedServiceId: number | undefined;
  private serviceService = inject(ServiceService);
  candidatObject:UserModel = {
    service_ids: []
  }
  candidats:any[] = []

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private router: Router, route: ActivatedRoute) {
    this.route = route;
  }

  ngOnInit(): void {
    this.fetchCandidats();
    this.fetchService();
  }

  fetchCandidats() {
    this.authService.getAllCandidat().subscribe(
      (response: any) => {
        console.log('Réponse de l\'API :', response);
        if (Array.isArray(response)) {
          this.tabCandidat = response;
          this.candidatsFiltres = this.tabCandidat; // Initialisation des candidats filtrés
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
  fetchService() {
    this.serviceService.getAllService().subscribe(
      (response: any) => {
        if (response.data) {
          this.tabService = response.data;
        }
      }
    );
  }

  getimage(photo: string): string {
    return `http://127.0.0.1:8000/storage/${photo}`;
  }

  voirProfil(candidatId: number) {
    this.router.navigate(['/candidats', candidatId]);
  }

  // Méthode pour filtrer les candidats
  filtrerCandidats() {
    const searchLower = this.searchText.toLowerCase();
    this.candidatsFiltres = this.tabCandidat.filter(candidat => {
      const fullName = `${candidat.adresse} `.toLowerCase();
      return fullName.includes(searchLower);
    });
  }
  getCandidatsByService(serviceId: number) {
    this.authService.getCandidatsByService(serviceId).subscribe(
      (response: any) => {
        if (response) {
          this.candidats = response;
          console.log('candidats par service:', this.candidats);
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des candidats par service:', error);
      }
    );
  }
  filterecandidats(): UserModel[] {
    // Filtre les services sélectionnés
    const selectedServices = this.tabService.filter(service => service.selected);

    if (selectedServices.length === 0) {
      // Si aucun service n'est sélectionné, affiche tous les candidats
      return this.tabCandidat;
    }

    // Filtre les candidats en fonction des services sélectionnés
    return this.tabCandidat.filter(candidat =>
      candidat.services?.some((service: { id: number | undefined }) =>
        selectedServices.some(selService => selService.id === service.id)
      )
    );
  }



  onServiceChange() {
    // Appelle filterecandidats pour actualiser la liste des candidats filtrés
    this.candidatsFiltres = this.filterecandidats();
  }


}
