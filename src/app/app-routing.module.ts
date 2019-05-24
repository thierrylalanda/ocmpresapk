import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guard/auth-guard.guard';
const routes: Routes = [
  { path: '', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule', canActivate: [AuthGuard] },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule', canActivate: [AuthGuard] },
  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule', canActivate: [AuthGuard] },
  { path: 'edit-profile', loadChildren: './pages/edit-profile/edit-profile.module#EditProfilePageModule', canActivate: [AuthGuard] },
  { path: 'home-results', loadChildren: './pages/home-results/home-results.module#HomeResultsPageModule', canActivate: [AuthGuard] },
  { path: 'commande', loadChildren: './pages/commande/commande.module#CommandeModule', canActivate: [AuthGuard] },
  { path: 'incident', loadChildren: './pages/incident/incident.module#IncidentModule', canActivate: [AuthGuard] },
  { path: 'marge', loadChildren: './pages/commande/marge/marge.module#MargePageModule' },
  { path: 'voir-marge', loadChildren: './pages/commande/voir-marge/voir-marge.module#VoirMargePageModule' },
  { path: 'articles', loadChildren: './pages/commande/articles/articles.module#ArticlesPageModule' },
  { path: 'add-article', loadChildren: './pages/modal/add-article/add-article.module#AddArticlePageModule' },
  { path: 'help', loadChildren: './pages/help/help.module#HelpPageModule' }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
