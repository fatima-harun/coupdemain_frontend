import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { apiUrl } from "./apiUrl";



@Injectable(

    {providedIn:'root'}
)

export class AuthService{
    private http = inject(HttpClient);

    // Methode pour s'authetifier 
    login(identifiant:any){
        return this.http.post(`${apiUrl}/user/login`, identifiant);
    }

     // Methode s'inscrire 
     register(identifiant:any){
        return this.http.post(`${apiUrl}/user/create`, identifiant);
    }
    
}