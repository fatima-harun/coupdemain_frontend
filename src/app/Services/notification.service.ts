import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from "./apiUrl";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }
  private getHeaders(): HttpHeaders{
    const token = localStorage.getItem('access_token');
    if (token) {
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
        console.error('Token non trouvé');
        return new HttpHeaders();
    }
}

getNotifications(): Observable<any> {
  const headers = this.getHeaders();
  return this.http.get(`${apiUrl}`, { headers });
}
markAsRead(notificationId: number): Observable<any> {
  const headers = this.getHeaders();
   return this.http.post(`${apiUrl}/${notificationId}/mark-as-read`, {}, { headers });
}
}
