import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthCommandeGuard implements CanActivate {
  constructor(private router: Router,
    public toastCtrl: ToastController) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
     // console.log(next);

      let authInfo = {
          authenticated: true
      };

      if (!authInfo.authenticated) {
          this.router.navigate(['login']);
          this.showToast('Désolé impossible de fournir cette page');
          return false;
      }

      return true;
  }

  async showToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      closeButtonText: 'OK',
      showCloseButton: true
    });
    toast.present();
  }
}
