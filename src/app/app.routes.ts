import { Routes } from '@angular/router';
import { ConnexionComponent } from './Composants/Visiteur/connexion/connexion.component';
import { InscriptionComponent } from './Composants/Visiteur/inscription/inscription.component';
import { PortailComponent } from './Composants/Visiteur/portail/portail.component';

export const routes: Routes = [

    // route par defaut
    {path:"", pathMatch:"full",redirectTo:"portail"},
   
    // route visiteur
    {path:"portail",component:PortailComponent},

    {path:"connexion",component:ConnexionComponent},
    
    {path:"inscription",component:InscriptionComponent}
];
