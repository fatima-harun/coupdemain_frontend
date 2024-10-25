import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from "./apiUrl";

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {


  constructor(private http: HttpClient) { }

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

  getExperience(candidatId: number): Observable<any> {
    const apiUrl = 'http://127.0.0.1:8000/api/candidats';
    return this.http.get(`${apiUrl}/${candidatId}/experiences`);
  }
  store(Experience:any){
    const headers = this.getHeaders(); // Ajout des headers avec le token
        return this.http.post(`${apiUrl}/experiences`, Experience, { headers });
  }
  userexperience(Experience:any){
    const headers = this.getHeaders(); // Ajout des headers avec le token
        return this.http.get(`${apiUrl}/experiences`, { headers });
  }
  getExperienceById(experienceId: string) {
    const headers = this.getHeaders();
    return this.http.get(`${apiUrl}/experiences/${experienceId}`,{ headers });
  }
  update(experienceId: string,experience:any): Observable<any> {
    return this.http.put(`${apiUrl}/experiences/${experienceId}`,experience);
  }
  destroy(experienceId: string): Observable<any> {
    return this.http.delete(`${apiUrl}/experiences/${experienceId}`);
}
}
// getCompetenceById(competenceId: string) {
//   const headers = this.getHeaders();
//   return this.http.get(`${apiUrl}/competences/${competenceId}`,{ headers });
// }
// update(competenceId: string,competence:any): Observable<any> {
//   return this.http.put(`${apiUrl}/competences/${competenceId}`,competence);
// }
// destroy(competenceId: string): Observable<any> {
//   return this.http.delete(`${apiUrl}/competences/${competenceId}`);
// }
