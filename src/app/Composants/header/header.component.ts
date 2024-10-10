import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isEmployeur: boolean = false;
  isEmploye:boolean = false;
  userName: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // S'abonne aux changements de l'état de connexion de l'utilisateur
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userName = user ? user.prenom : ''; // l'objet user a une propriété 'prenom'
      // Vérifie si le rôle "employeur" existe dans le tableau des rôles
    this.isEmployeur = user && user.roles.some((role: { name: string; }) => role.name === 'employeur'); // Vérifie si l'utilisateur a le rôle "employeur"
    this.isEmploye = user && user.roles.some((role: { name: string; }) => role.name === 'demandeur_d_emploi');
    });
  }
  onLogout() {
    this.authService.logout();
  }

}


