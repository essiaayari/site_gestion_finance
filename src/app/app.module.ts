import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import{AngularFireModule}from '@angular/fire/compat'
import { environment } from '../environments/environment';
import { LoginComponent } from './site/login/login.component';
import { ErrorComponent } from './error/error.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './site/dashboard/dashboard.component';
import { ClientsComponent } from './site/clients/clients.component';
import { AchatComponent } from './site/achats/achat/achat.component';
import { BonReceptionComponent } from './site/achats/bon-reception/bon-reception.component';
import { FacturesFournisseursComponent } from './site/achats/factures-fournisseurs/factures-fournisseurs.component';
import { FacturesConsultantsComponent } from './site/achats/factures-consultants/factures-consultants.component';
import { ChequeTraiteComponent } from './site/comptabilites/cheque-traite/cheque-traite.component';
import { CompteBancaireComponent } from './site/comptabilites/compte-bancaire/compte-bancaire.component';
import { ComptaComponent } from './site/comptabilites/compta/compta.component';
import { TresorerieComponent } from './site/comptabilites/tresorerie/tresorerie.component';
import { ConsultantsComponent } from './site/consultants/consultants.component';
import { FournisseursComponent } from './site/fournisseurs/fournisseurs.component';
import { ServiceComponent } from './site/service/service.component';
import { StockComponent } from './site/stock/stock.component';
import { VenteComponent } from './site/ventes/vente/vente.component';
import { DevisComponent } from './site/ventes/devis/devis.component';
import { FactureClientsComponent } from './site/ventes/facture-clients/facture-clients.component';
import { ForgetPasswordComponent } from './site/authentification/forget-password/forget-password.component';
import { VerifyMailComponent } from './site/authentification/verify-mail/verify-mail.component';
import { FormulaireClientComponent } from './site/formulaires/formulaire-client/formulaire-client.component';
import { FormulaireFournisseursComponent } from './site/formulaires/formulaire-fournisseurs/formulaire-fournisseurs.component';
import { FormulaireConsultantComponent } from './site/formulaires/formulaire-consultant/formulaire-consultant.component';
import { FormulaireServiceComponent } from './site/formulaires/formulaire-service/formulaire-service.component';
import { FormulaireStockComponent } from './site/formulaires/formulaire-stock/formulaire-stock.component';
import { FormulaireFactureClientComponent } from './site/formulaires/formulaire-facture-client/formulaire-facture-client.component';
import { FormulaireFactureFourniseurComponent } from './site/formulaires/formulaire-facture-fourniseur/formulaire-facture-fourniseur.component';
import { AdminComponent } from './site/admin/admin/admin.component';
import { ChangerMpComponent } from './site/admin/changer-mp/changer-mp.component';
import { CreationCompteComponent } from './site/admin/creation-compte/creation-compte.component';
import { UsersComponent } from './site/admin/users/users.component';
import { FormulaireFactureConsultantComponent } from './site/formulaires/formulaire-facture-consultant/formulaire-facture-consultant.component';
import { FormulaireDevisComponent } from './site/formulaires/formulaire-devis/formulaire-devis.component';
import { FormulaireChequeTraiteComponent } from './site/formulaires/formulaire-cheque-traite/formulaire-cheque-traite.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    DashboardComponent,
    ClientsComponent,
    AchatComponent,
    BonReceptionComponent,
    FacturesFournisseursComponent,
    FacturesConsultantsComponent,
    ChequeTraiteComponent,
    CompteBancaireComponent,
    ComptaComponent,
    TresorerieComponent,
    ConsultantsComponent,
    FournisseursComponent,
    ServiceComponent,
    StockComponent,
    VenteComponent,
    DevisComponent,
    FactureClientsComponent,
    ForgetPasswordComponent,
    VerifyMailComponent,
    FormulaireClientComponent,
    FormulaireFournisseursComponent,
    FormulaireConsultantComponent,
    FormulaireServiceComponent,
    FormulaireStockComponent,
    FormulaireFactureClientComponent,
    FormulaireFactureFourniseurComponent,
    AdminComponent,
    ChangerMpComponent,
    CreationCompteComponent,
    UsersComponent,
    FormulaireFactureConsultantComponent,
    FormulaireDevisComponent,
    FormulaireChequeTraiteComponent,
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
