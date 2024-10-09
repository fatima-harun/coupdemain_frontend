import { CompetenceModel } from './../Models/competence.model';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { apiUrl } from "./apiUrl";
import { ExperienceModel } from "../Models/experience.model";

@Injectable({
    providedIn: "root"
})

export class InfosService {
    private http = inject(HttpClient);

     addcompetence(Competence:any){
      const headers = this.getHeaders(); // Ajout des headers avec le token
       return this.http.post(`${apiUrl}/competences`, Competence, { headers });
     }

    // // Méthode pour ajouter une offre avec les headers contenant le token
    // addOffre(offre: any) {
    //     const headers = this.getHeaders(); // Ajout des headers avec le token
    //     return this.http.post(`${apiUrl}/offres`, offre, { headers });
    // }

    // // Méthode pour récupérer toutes les offres avec les headers
    // getAllOffre() {
    //     const headers = this.getHeaders();
    //     return this.http.get(`${apiUrl}/offres`, { headers });
    // }
    // getOffreById(id: string) {
    //     return this.http.get<{ data: OffreModel }>(`/api/offres/${id}`);
    //   }

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
}
