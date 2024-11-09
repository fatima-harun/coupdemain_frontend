import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../Services/notification.service';

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
  activePage: string = ''; 
  notifications: any[] = [];
  unreadNotificationsCount = 0;

  constructor(private authService: AuthService,private router: Router,private notificationService: NotificationService) {this.setActivePage(); }

  ngOnInit(): void {
    // S'abonne aux changements de l'état de connexion de l'utilisateur
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userName = user ? user.prenom : ''; // l'objet user a une propriété 'prenom'
      // Vérifie si le rôle "employeur" existe dans le tableau des rôles
    this.isEmployeur = user && user.roles.some((role: { name: string; }) => role.name === 'employeur'); // Vérifie si l'utilisateur a le rôle "employeur"
    this.isEmploye = user && user.roles.some((role: { name: string; }) => role.name === 'demandeur_d_emploi');
    this.fetchNotifications();
    });
  }
  onLogout() {
    this.authService.logout();
  }
  setActivePage() {
    this.activePage = this.router.url; // Récupère l'URL actuelle
  }
  fetchNotifications() {
    this.notificationService.getNotifications().subscribe((notifications) => {
      this.notifications = notifications;
      this.unreadNotificationsCount = notifications.filter((notification: { read: any; }) => !notification.read).length;
    });
  }
  // Exemple de requête pour marquer la notification comme lue
  onMarkAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe(
      (response) => {
        console.log('Notification marquée comme lue', response);
        // Mise à jour de l'état de la notification localement
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;  // Marquer la notification comme lue
        }
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la notification', error);
      }
    );
  }
}


