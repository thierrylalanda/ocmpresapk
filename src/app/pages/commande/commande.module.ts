import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeCommandePage } from './home-commande/home-commande.page';
import { AddCommandePage } from './add-commande/add-commande.page';
import { AllCommandePage } from './all-commande/all-commande.page';
import { PopmenuCommandeComponent } from './../../components/popmenu-commande/popmenu-commande.component';
import { AllProductsPage } from './all-products/all-products.page';
import { AuthCommandeGuard } from '../../guard/auth-commande.guard';
import { VoirCommandePage } from './voir-commande/voir-commande.page';
import { VoirMargePage } from './voir-marge/voir-marge.page';
import { PopmenuEditCommandeComponent  } from '../../components/popmenu-edit-commande/popmenu-edit-commande.component';
import { PopmenuPrinterComponent } from '../../components/popmenu-printer/popmenu-printer.component';
import { IonicSelectableModule } from 'ionic-selectable';
import { OrderByPipe } from '../../shared/pipes/orderby.pipe';
import { FilterbyetatPipe } from '../../shared/pipes/filterbyetat.pipe';
import { MargePage } from './marge/marge.page';
import { ArticlesPage } from '../commande/articles/articles.page';
import { AddArticlePage } from '../modal/add-article/add-article.page';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../http-loader-factory';
import { HttpClient } from '@angular/common/http';
const routes: Routes = [
  {
    path: '',
    component: HomeCommandePage,
    canActivate: [AuthCommandeGuard]
  },
  {
    path: 'add-commande',
    component: AddCommandePage,
    canActivate: [AuthCommandeGuard]
  },
  {
    path: 'edit-commande',
    component: AddCommandePage,
    canActivate: [AuthCommandeGuard]
  },
  {
    path: 'all-commande',
    component: AllCommandePage,
    canActivate: [AuthCommandeGuard]
  },
  {
    path: 'all-product',
    component: AllProductsPage,
    canActivate: [AuthCommandeGuard]
  },
  {
    path: 'all-articles',
    component: ArticlesPage,
    canActivate: [AuthCommandeGuard]
  },
  {
    path: 'voir-commande/:id',
    component: VoirCommandePage
  },
  {
    path: 'marges-commande',
    component: MargePage
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
    AddArticlePage,
    FilterbyetatPipe,
    OrderByPipe,
    HomeCommandePage,
     AddCommandePage,
      AllCommandePage,
      ArticlesPage,
      MargePage,
      PopmenuEditCommandeComponent,
      PopmenuCommandeComponent,
      VoirCommandePage,
      VoirMargePage,
      AllProductsPage],
      providers:[
        AuthCommandeGuard
      ],
      entryComponents: [PopmenuEditCommandeComponent,VoirMargePage,AddArticlePage]
})
export class CommandeModule { }
