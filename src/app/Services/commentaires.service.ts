import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl } from './apiUrl';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentairesService {

  private http = inject(HttpClient);
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    if (token) {
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
        console.error('Token non trouvé');
        return new HttpHeaders();
    }
}

   // Ajoutez le commentaire
   addComment(commentaire: any, userId: number) {
    const headers = this.getHeaders(); // Ajout des headers avec le token
    return this.http.post(`${apiUrl}/commentaires/${userId}`, commentaire, { headers });
}

getCommentaires(commentId: number): Observable<any> {
  const headers = this.getHeaders();
  return this.http.get(`${apiUrl}/commentaires/${commentId}`,{ headers });
}
editComment(commentId: number, description: string): Observable<any> {
  const headers = this.getHeaders();
  return this.http.put(`${apiUrl}/commentaires/${commentId}`, { description }, { headers }); }

  destroy(commentId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${apiUrl}/commentaires/${commentId}`, { headers });
  }
}
