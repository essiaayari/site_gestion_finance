import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './site/login/login.component';
import { ErrorComponent } from './error/error.component';
import { DashboardComponent } from './site/dashboard/dashboard.component';
import { ClientsComponent } from './site/clients/clients.component';
import { VenteComponent } from './site/ventes/vente/vente.component';
import { DevisComponent } from './site/ventes/devis/devis.component';
import { FactureClientsComponent } from './site/ventes/facture-clients/facture-clients.component';
import { AchatComponent } from './site/achats/achat/achat.component';
import { FacturesFournisseursComponent } from './site/achats/factures-fournisseurs/factures-fournisseurs.component';
import { FacturesConsultantsComponent } from './site/achats/factures-consultants/factures-consultants.component';
import { BonReceptionComponent } from './site/achats/bon-reception/bon-reception.component';
import { FournisseursComponent } from './site/fournisseurs/fournisseurs.component';
import { ConsultantsComponent } from './site/consultants/consultants.component';
import { ServiceComponent } from './site/service/service.component';
import { ComptaComponent } from './site/comptabilites/compta/compta.component';
import { TresorerieComponent } from './site/comptabilites/tresorerie/tresorerie.component';
import { CompteBancaireComponent } from './site/comptabilites/compte-bancaire/compte-bancaire.component';
import { ChequeTraiteComponent } from './site/comptabilites/cheque-traite/cheque-traite.component';
import { StockComponent } from './site/stock/stock.component';
import { ForgetPasswordComponent } from './site/authentification/forget-password/forget-password.component';
import { VerifyMailComponent } from './site/authentification/verify-mail/verify-mail.component';
import { AuthGuard } from './site/authentification/guard.guard'; // Update this path to the actual location of AuthGuard
import { AdminComponent } from './site/admin/admin/admin.component';
import { ChangerMpComponent } from './site/admin/changer-mp/changer-mp.component';
import { CreationCompteComponent } from './site/admin/creation-compte/creation-compte.component';
import { UsersComponent } from './site/admin/users/users.component';

const routes: Routes = [
  { path:'login',title:'login', component: LoginComponent },
  { path:'dashboard',title:'dashboard', component: DashboardComponent  },
  {path:'clients',title:'clients',component:ClientsComponent},
  {path:'fournisseurs',title:'fournisseurs',component:FournisseursComponent,canActivate: [AuthGuard]},
  {path:'consultants',title:'consultants',component:ConsultantsComponent,canActivate: [AuthGuard]},
  {path:'services',title:'services',component:ServiceComponent,canActivate: [AuthGuard]},
  {path:'stock',title:'stock',component:StockComponent,canActivate: [AuthGuard]},
  {path:'forgetpassword',title:'forget password',component:ForgetPasswordComponent},
  {path:'verify_mail',title:'emai verification',component:VerifyMailComponent},


  {path:'vente',title:'vente',component:VenteComponent,

  children:[
    {path:'facturesclients',title:'factures clients',component:FactureClientsComponent},
    {path:'devis',title:'devis',component:DevisComponent,canActivate: [AuthGuard]},
    {path:'',redirectTo:'facturesclients',pathMatch:'full'}
  ]
  },

  {path:'achat',title:'achat',component:AchatComponent,
  children:[
    {path:'facturesfournisseur',title:'factures fournisseurs',component:FacturesFournisseursComponent},
    {path:'facturesconsultants',title:'factures consultants',component:FacturesConsultantsComponent},
    {path:'bonreception',title:'bon reception',component:BonReceptionComponent,canActivate: [AuthGuard]},
    {path:'',redirectTo:'facturesfournisseur',pathMatch:'full'}
  ]
  },

  {path:'comptabilite',title:'comptabilité',component:ComptaComponent,
  children:[
    {path:'tresorerie',title:'gestion de la trésorerie',component:TresorerieComponent,canActivate: [AuthGuard]},
    {path:'comptebancaire',title:'compte bancaire',component:CompteBancaireComponent,canActivate: [AuthGuard]},
    {path:'chequetraite',title:'cheéue et traite',component:ChequeTraiteComponent},
    {path:'',redirectTo:'tresorerie',pathMatch:'full'}
  ]
  
  },
  { path: 'admin', component: AdminComponent },
  { path: 'changer_mp', component: ChangerMpComponent },
  { path: 'creation_compte', component: CreationCompteComponent },
  { path: 'users', component: UsersComponent },

  { path: '', redirectTo:'login' ,pathMatch:'full'},
  { path: '**', title:'error' ,component:ErrorComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
