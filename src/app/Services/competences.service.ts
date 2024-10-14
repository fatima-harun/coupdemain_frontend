import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { apiUrl } from "./apiUrl";

@Injectable({
  providedIn: 'root'
})
export class CompetenceService {


  constructor(private http: HttpClient) { }

  // Méthode pour récupérer les compétences d'un candidat
  // getCompetences(candidatId: number): Observable<any> {
  //   return this.http.get(`${apiUrl}/candidats/${candidatId}/competences`);
  // }
  getCompetences(candidatId: number): Observable<any> {
    const apiUrl = 'http://127.0.0.1:8000/api/candidats';
    return this.http.get(`${apiUrl}/${candidatId}/competences`);
  }

}
