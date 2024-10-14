import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { apiUrl } from "./apiUrl";
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);

    // Observable pour suivre l'état de l'utilisateur connecté
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor() {
        // Initialise l'utilisateur à partir du localStorage
        const storedUser = localStorage.getItem('user');
        this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    // Getter pour obtenir la valeur actuelle de l'utilisateur
    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    // Méthode pour s'authentifier
    login(identifiant: any) {
      return this.http.post(`${apiUrl}/user/login`, identifiant)
          .pipe(
              tap((response: any) => {
                  if (response && response.token) {
                      // Met à jour les informations de l'utilisateur dans le localStorage
                      localStorage.setItem('user', JSON.stringify(response.user));
                      localStorage.setItem('token', response.token);

                      // Met à jour le BehaviorSubject pour que le changement soit pris en compte immédiatement
                      this.currentUserSubject.next(response.user);
                  }
              })
          );
  }
    // Méthode pour s'inscrire
    register(identifiant: any) {
        return this.http.post(`${apiUrl}/user/create`, identifiant)
            .pipe(
                tap((response: any) => {
                    // Sauvegarde les informations après l'inscription
                    if (response && response.token) {
                        localStorage.setItem('user', JSON.stringify(response.user));
                        localStorage.setItem('token', response.token);
                        this.currentUserSubject.next(response.user);
                    }
                })
            );
    }

    // Méthode pour obtenir l'utilisateur actuellement connecté
    getUser(): any {
        return this.currentUserSubject.value;
    }

    // Méthode pour se déconnecter
    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null); // Met à jour l'utilisateur à null après déconnexion
    }

    // Méthode pour vérifier si l'utilisateur est connecté
    isLoggedIn(): boolean {
        return !!this.currentUserSubject.value;
    }
    private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('access_token');
      if (token) {
          return new HttpHeaders().set('Authorization', `Bearer ${token}`);
      } else {
          console.error('Token non trouvé');
          return new HttpHeaders();
      }
  }
  getAllCandidat(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${apiUrl}/candidats`, { headers }).pipe(
      tap(response => {
        console.log('Réponse de l\'API:', response); // Log the response here
      }),
      catchError(error => {
        console.error('Erreur dans getAllCandidat:', error); // Catch errors from HTTP
        return throwError(error); // Rethrow the error for further handling
      })
    );
  }
  getCandidatDetails(candidatId: number): Observable<any> {
    const apiUrl = 'http://127.0.0.1:8000/api/candidats'; // on a defini ici l'url parce meme avec l'importation ça vient pas
    return this.http.get(`${apiUrl}/${candidatId}`);
}



}
