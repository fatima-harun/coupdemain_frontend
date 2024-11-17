import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-headeradmin',
  standalone: true,
  imports: [CommonModule], // Ajoutez les modules nécessaires ici
  templateUrl: './headeradmin.component.html',
  styleUrls: ['./headeradmin.component.css'], // Styles associés
})
export class HeaderadminComponent implements OnInit {
  userName: string = ''; // Contient le prénom de l'utilisateur
  isLoggedIn: boolean = false; // État de connexion
  private router = inject(Router); // Injection du Router

  constructor() {}

  ngOnInit(): void {
    // Simulez l'état de l'utilisateur (à remplacer par une API réelle)
    const user = localStorage.getItem('user'); // Exemple avec LocalStorage
    if (user) {
      this.isLoggedIn = true;
      this.userName = JSON.parse(user).prenom; // Simulez un objet utilisateur avec `prenom`
    }
  }

  // Gérer la déconnexion
  onLogout(): void {
    localStorage.removeItem('user'); // Supprimez l'utilisateur stocké
    this.isLoggedIn = false;
    this.router.navigate(['/login']); // Redirection vers la page de connexion
  }
}
