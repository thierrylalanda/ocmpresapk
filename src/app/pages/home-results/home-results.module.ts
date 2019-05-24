import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { HomeResultsPage } from './home-results.page';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../../http-loader-factory';
const routes: Routes = [
  {
    path: '',
    component: HomeResultsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [HomeResultsPage, PopmenuComponent]
})
export class HomeResultsPageModule {}
