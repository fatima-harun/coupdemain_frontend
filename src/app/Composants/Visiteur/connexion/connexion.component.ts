import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { UserModel } from '../../../Models/user.model';
import { FormsModule } from '@angular/forms';
import { AlertShowMessage } from '../../../Services/alertMessage';
import { Role } from '../../../Models/role.model';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [RouterLink, FormsModule,RouterModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  // Injection de dependances 
  private authService = inject(AuthService);
  private router = inject(Router);

  // Declaration des variables 
  userObject: UserModel = {}; // un objet qui a pour type UserModel qui se trouve dans Models/user.model.ts
  alertMessage: string = ""; // cette variable permettra de stocker la valeur de l'alerte


  connexion() {
    if (this.userObject.email && this.userObject.password) {
      this.authService.login(this.userObject).subscribe(
        (response: any) => {
          console.log(response.access_token);
          console.log("user",response.user);
  
          if (response.user) {
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));
            console.log(localStorage.getItem('user'));
  
            if (response.user.roles) {
              if (response.user.roles.some((role: Role) => role.name === 'admin')) {
                this.router.navigateByUrl('portail');
              } else if (response.user.roles.some((role: Role) => role.name === 'employeur')) {
                this.router.navigateByUrl('portail');
              } else if (response.user.roles.some((role: Role) => role.name === 'demandeur_d_emploi')) {
                this.router.navigateByUrl('portail');
              }
            } else {
              this.router.navigateByUrl('');
            }
  
          }
        },
       
      );
    }
  }
  // logout() {
  //     return this.authService.logout().subscribe(
  //       (response: any) => {
  //         console.log(response);
  //         localStorage.removeItem('access_token');
  //         localStorage.removeItem('user');
  //         this.router.navigateByUrl('/login');
  //       },
  //       (error) => {
  //         console.error(error);
  //       }
  //     )
  //   }
  
}
