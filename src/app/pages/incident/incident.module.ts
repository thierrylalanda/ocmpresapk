import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../http-loader-factory';
import { HttpClient } from '@angular/common/http';
import { IonicSelectableModule } from 'ionic-selectable';
import { HomeIncidentPage } from './home-incident/home-incident.page';
import { AuthIncidentGuard } from '../../guard/auth-incident.guard';
import { AddIncidentPage } from './add-incident/add-incident.page';
import { AllIncidentPage } from './all-incident/all-incident.page';
import { VoirIncidentPage } from './voir-incident/voir-incident.page';
import { PopMenuIncidentComponent } from '../../components/popmenu-incident/pop-menu-incident';
import { IncidentService } from '../../service/incident/incident.service';
import { IncidentTraitementService } from '../../service/incident/incident-traitement.service';
import { OrderByPipe } from '../../shared/pipes/orderby.pipe';
import { FilterIncidentPipe } from '../../shared/pipes/filterincident.pipe';

const routes: Routes = [
  {
    path: '',
    component: HomeIncidentPage,
    canActivate: [AuthIncidentGuard]
  },
  {
    path: 'add-incident',
    component: AddIncidentPage,
    canActivate: [AuthIncidentGuard]
  },
  {
    path: 'edit-incident',
    component: AddIncidentPage,
    canActivate: [AuthIncidentGuard]
  },
  {
    path: 'all-incident',
    component: AllIncidentPage,
    canActivate: [AuthIncidentGuard]
  },
  {
    path: 'voir-incident',
    component: VoirIncidentPage
  }
];
@NgModule({
  imports: [
     CommonModule,
     FormsModule,
     ReactiveFormsModule,
     IonicModule,
     IonicSelectableModule,
     TranslateModule.forRoot({
       loader: {
         provide: TranslateLoader,
         useFactory: (HttpLoaderFactory),
         deps: [HttpClient]
       }
     }),
     RouterModule.forChild(routes)
   ],
   declarations: [
   // OrderByPipe,
    FilterIncidentPipe,
      HomeIncidentPage,
     AddIncidentPage,
     AllIncidentPage,
     PopMenuIncidentComponent,
     VoirIncidentPage],
       providers:[AuthIncidentGuard,IncidentService,IncidentTraitementService],
       entryComponents: [PopMenuIncidentComponent]
 })
export class IncidentModule { }
