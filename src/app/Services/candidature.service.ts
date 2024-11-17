import { CandidatureModel } from './../Models/candidature.model';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { apiUrl } from "./apiUrl";
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root', // Cela le rend disponible dans toute l'application
})

export class CandidatureService{

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

postuler(Candidature:any){
  const headers = this.getHeaders(); // Ajout des headers avec le token
      return this.http.post(`${apiUrl}/candidatures`, Candidature, { headers });
}

getCandidaturesByOffre(offreId:number){
  const headers = this.getHeaders();
  return this.http.get(`${apiUrl}/candidatures/${offreId}/offre`,{ headers })
}

updateStatut(Id: number, statut: string) {
  const headers = this.getHeaders();
  return this.http.put(`${apiUrl}/candidatures/${Id}/statut`, { statut }, { headers });
}
getRecruter() {
  const headers = this.getHeaders();
  return this.http.get(`${apiUrl}/candidatures/recruter`,{ headers })
}

}
