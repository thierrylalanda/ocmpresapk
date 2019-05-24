import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../http-loader-factory';

import { IonicModule } from '@ionic/angular';

import { AboutPage } from './about.page';
import { HttpClient } from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    component: AboutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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
  declarations: [AboutPage]
})
export class AboutPageModule {}
