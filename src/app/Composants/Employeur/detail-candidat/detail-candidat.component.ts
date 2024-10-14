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


@Component({
  selector: 'app-detail-candidat',
  standalone: true,
  imports: [CommonModule, HeaderComponent,FooterComponent],
  templateUrl: './detail-candidat.component.html',
  styleUrls: ['./detail-candidat.component.css'] 
})
export class DetailCandidatComponent implements OnInit {
  tabService: ServiceModel[] = [];
  competences: CompetenceModel[] = [];
  experiences:ExperienceModel[]=[];
  candidat: any; // Stocke les détails du candidat
  candidatId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private candidatService: AuthService,
    private competenceService: CompetenceService

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
  }

  getimage(photo: string): string {
    return `http://127.0.0.1:8000/storage/${photo}`;
  }


}
