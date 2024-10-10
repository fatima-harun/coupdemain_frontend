// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
// import { OffreService } from '../../../Services/offre.service';
// import { OffreModel } from '../../../Models/offre.model';
// import { ServiceService } from '../../../Services/service.service';  // Importer le service
// import { ServiceModel } from '../../../Models/service.model'; // Importer le modèle de service

// @Component({
//   selector: 'app-detail-offre',
//   templateUrl: './detail-offre.component.html',
//   styleUrls: ['./detail-offre.component.css'],
//   standalone: true,
//   imports: [CommonModule],
// })
// export class DetailOffreComponent implements OnInit {

//   offreId!: number; // L'ID de l'offre
//   offre!: OffreModel; // Stocke les détails de l'offre
//   service!: ServiceModel; // Pour stocker les détails du service

//   constructor(
//     private route: ActivatedRoute,
//     private offreService: OffreService,
//     private serviceService: ServiceService  // Injecter le service
//   ) {}



//   ngOnInit(): void {
//     this.route.params.subscribe(params => {
//         this.offreId = +params['id'];

//         // Récupérer les détails de l'offre
//         this.offreService.getOffresByid(this.offreId).subscribe(
//             (response: any) => {
//                 this.offre = response.data;
//                 console.log('Détails de l\'offre:', this.offre);
//             },
//             (error: any) => {
//                 console.error('Erreur lors de la récupération des détails de l\'offre:', error);
//             }
//         );
//     });
// }



// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OffreService } from '../../../Services/offre.service';
import { OffreModel } from '../../../Models/offre.model';
import { ServiceModel } from '../../../Models/service.model';

@Component({
  selector: 'app-detail-offre',
  templateUrl: './detail-offre.component.html',
  styleUrls: ['./detail-offre.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class DetailOffreComponent implements OnInit {

  offreId!: number; // L'ID de l'offre
  offre!: OffreModel; // Stocke les détails de l'offre

  constructor(
    private route: ActivatedRoute,
    private offreService: OffreService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.offreId = +params['id'];

      // Récupérer les détails de l'offre
      this.offreService.getOffresByid(this.offreId).subscribe(
        (response: any) => {
          this.offre = response.data; // Utilisation directe de la réponse
          console.log('Détails de l\'offre:', this.offre);
        },
        (error: any) => {
          console.error('Erreur lors de la récupération des détails de l\'offre:', error);
        }
      );
    });
  }
}
