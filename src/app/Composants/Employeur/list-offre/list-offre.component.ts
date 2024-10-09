// list-offre.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { OffreService } from '../../../Services/offre.service';
import { OffreModel } from '../../../Models/offre.model';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { ServiceModel } from '../../../Models/service.model';
import { ServiceService } from '../../../Services/service.service';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipe, Ng2SearchPipeModule } from 'ng2-search-filter';

@Component({
  selector: 'app-list-offre',
  templateUrl: './list-offre.component.html',
  styleUrls: ['./list-offre.component.css'],
  standalone: true,
  imports: [CommonModule,HeaderComponent,FormsModule],
})
export class ListeOffresComponent implements OnInit {
  private offreService = inject(OffreService);
  private serviceService = inject(ServiceService);
  tabService:ServiceModel[] = [];
  tabOffres: OffreModel[] = [];
  offreObject:OffreModel = {};
  user: any;
  
  ngOnInit(): void {
    this.fetchOffres();
    this.user = this.getUser();
    this.fetchService();
  }

  fetchOffres() {
    this.offreService.getAllOffre().subscribe(
      (response: any) => {
        if (response.data) {
          this.tabOffres = response.data;
          console.log('Offres:', this.tabOffres);
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des offres:', error);
      }
    );
  }
  // Récupération de tous les services
  fetchService(){
    this.serviceService.getAllService().subscribe(
      (response:any) => {
       if(response.data){
        this.tabService = response.data;
       }
      }
    )
  }
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getOffreObject(offre: any) {
    this.offreObject = offre;
     console.log(this.offreObject);
  }
}
