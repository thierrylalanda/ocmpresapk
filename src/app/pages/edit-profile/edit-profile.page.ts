import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController, Events } from '@ionic/angular';
import {DomSanitizer} from '@angular/platform-browser';
import { AuthentificationService } from '../../service/authentification/authentification.service';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  user:any;
  societe: any;
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public _DomSanitizer: DomSanitizer,
    public auth: AuthentificationService,
    public alertCtrl: AlertController,
    public events: Events
    ) { }

  ngOnInit() {
    if(localStorage.getItem('societe')) {
      this.societe= JSON.parse(localStorage.getItem('societe'));
    }
    if(localStorage.getItem('user')) {
      this.user= JSON.parse(localStorage.getItem('user'));
    }
  }

  async sendData() {
    const loader = await this.loadingCtrl.create({
      duration: 2000,
      message:'Enregistrement ...'
    });
    if(this.user.firstname !== "" && this.user.mail !== "") {
      const SaveYourCommande = await this.alertCtrl.create({
        header: "Confirmation",
        message: "Veuillez confirmez votre identité",
        inputs: [
            {
                name: "password",
                value: "",
                placeholder: "votre mot de passe",
                type: "password"
              }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {}
          },
          {
            text: 'OK',
            handler: async data => {
              if (data.password === this.user.psd) {
                 loader.present();
                 const dataS= {
                  id: ''+this.user.id,
                  telephone: this.user.phone ? this.user.phone :null,
                  adresse: this.user.address1 ? ''+this.user.address1 : null,
                  firstname: ''+this.user.firstname,
                  lastname: this.user.lastname?''+this.user.lastname:null,
                  mail: ''+this.user.mail
                 };
                this.auth.UpdateProfil(dataS).subscribe(
                  resp=> {
                    if(resp instanceof Array) {
                      loader.dismiss();
                      this.loadToast('Une erreur  c\'est produite veuillez réessayer plus tard');
                    } else {
                      loader.dismiss();
                      this.loadToast('Vos informations ont bien été mis à jour');
                      localStorage.setItem('user',JSON.stringify(this.user));
                      this.events.publish('user:update',this.user, Date.now());
                    }
                  }
                );
              } else {
                this.loadToast('Mot de passe incorrect');
              }
            }
          }
        ]
      });
      SaveYourCommande.present();
    } else {
      this.loadToast('Nom et email obligatoire');
    }
    

  }


  async loadToast(msg) {
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        cssClass: '',
        message: msg,
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
  }
}
