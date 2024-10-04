import { Routes } from '@angular/router';
import { ConnexionComponent } from './Composants/Visiteur/connexion/connexion.component';
import { InscriptionComponent } from './Composants/Visiteur/inscription/inscription.component';
import { PortailComponent } from './Composants/Visiteur/portail/portail.component';
import { PublicationOffreComponent } from './Composants/Employeur/publication-offre/publication-offre.component';
import { AuthEmployeurGuard } from './Guard/employeur.guard';
import { ListeOffresComponent } from './Composants/Employeur/list-offre/list-offre.component';

export const routes: Routes = [

    // route par defaut
    {path:"", pathMatch:"full",redirectTo:"portail"},
   
    // routes visiteur
    {path:"portail",component:PortailComponent},

    {path:"connexion",component:ConnexionComponent},
    
    {path:"inscription",component:InscriptionComponent},

    // routes employeur
    // {path:"offre",component:PublicationOffreComponent,canActivate:[AuthEmployeurGuard]}
    {path:"offre",component:PublicationOffreComponent,canActivate:[AuthEmployeurGuard]},
    { path: 'liste-offre', component:ListeOffresComponent},
];