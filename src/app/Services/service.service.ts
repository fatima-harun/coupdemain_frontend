import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { apiUrl } from "./apiUrl";

@Injectable({
    providedIn:"root"
})

export class ServiceService {

    private http = inject(HttpClient);

    // Methode pour ajouter un service
    addService(Service:any){
        return this.http.post(`${apiUrl}/services`, Service);
    }

    // Methode pour recuperer tous les services
    getAllService(){
        return this.http.get(`${apiUrl}/services`);
    }
    

    // Methode pour mettre a jour un service
    updateService(id:any, Service:any){
        return this.http.post(`${apiUrl}/services/${id}`, Service);
    }
    
    // Methode pour supprimer definitivement une service
    deleteService(id:any){
        return this.http.delete(`${apiUrl}/services/${id}/force-delete`);
    }

}