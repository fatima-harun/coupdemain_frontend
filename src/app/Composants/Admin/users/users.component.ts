import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../../Services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,HeaderComponent,FooterComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  tabUser : any[] = [];

  ngOnInit(): void {
    this.fetchUser();
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

}
