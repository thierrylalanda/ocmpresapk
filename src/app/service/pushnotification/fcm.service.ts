import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class FcmService {
user;
societe;
  constructor(private firebase: Firebase,
              private afs: AngularFirestore,
              private platform: Platform) {
                  if(localStorage.getItem('user')){
                      this.user=JSON.parse(localStorage.getItem('user'));
                  }
                  if(localStorage.getItem('societe')){
                    this.societe=JSON.parse(localStorage.getItem('societe'));
                }
              }

  async getToken() {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
    }

    if (this.platform.is('ios')) {
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
    }

    this.saveToken(token);
  }

  private saveToken(token) {
    if (!token) return;
/* let soc=this.societe.nom.split(" ");
let nom=this.user.firstname.split(" "); */
    const devicesRef = this.afs.collection('devices');

    const data = {
      token,
      userId: 'ocmAppPres'
    };

    return devicesRef.doc(token).set(data);
  }

  onNotifications() {
    return this.firebase.onNotificationOpen();
  }
}