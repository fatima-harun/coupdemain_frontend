import { CompetenceModel } from './../Models/competence.model';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { apiUrl } from "./apiUrl";
import { forkJoin, Observable } from 'rxjs';
import { ExperienceModel } from "../Models/experience.model";

@Injectable({
    providedIn: "root"
})
export class InfosService {
    private http = inject(HttpClient);

    // Modifiez cette méthode pour inclure le user_id
    addinfos(competence: CompetenceModel, experience: ExperienceModel, userId: string) {
        const headers = this.getHeaders(); // Ajout des headers avec le token

        // Ajoutez user_id à competence et experience
        competence.user_id = userId;
        experience.user_id = userId;

        const competenceRequest = this.http.post(`${apiUrl}/competences`, competence, { headers });
        const experienceRequest = this.http.post(`${apiUrl}/experiences`, experience, { headers });

        // Utilisez forkJoin pour exécuter les deux requêtes en parallèle
        return forkJoin([competenceRequest, experienceRequest]);
    }

    // Méthode pour récupérer les headers avec le token d'authentification
    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('access_token');
        if (token) {
            return new HttpHeaders().set('Authorization', `Bearer ${token}`);
        } else {
            console.error('Token non trouvé');
            return new HttpHeaders();
        }
    }
    // Récupérer les compétences et expériences de l'utilisateur connecté
    getUserInfos(): Observable<any> {
      return this.http.get(`${apiUrl}/user-infos`);
    }
}
