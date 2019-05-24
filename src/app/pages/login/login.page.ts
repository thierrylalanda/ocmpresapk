import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController, Events } from '@ionic/angular';
import { AuthentificationService } from '../../service/authentification/authentification.service';
import { MapDataService } from '../../service/map.data.service';
import { TextToSpeekService } from '../../shared/utile/text-to-speek.service';
import { NotificationService } from '../../shared/utile/notification.service';
import { DatePicker } from '@ionic-native/date-picker/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public onLoginForm: FormGroup;
  parametre:any;
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private auth: AuthentificationService,
    private mapper: MapDataService,
    public events: Events,
    public speakerTT: TextToSpeekService,
    public notif: NotificationService,
    private datePicker: DatePicker
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);

  }

  ngOnInit() {
/* this.datePicker.show({
  date: new Date(),
  mode: 'date',
  androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
}).then(
  date => console.log('Got date: ', date),
  err => console.log('Error occurred while getting date: ', err)
); */
    this.onLoginForm = this.formBuilder.group({
      'username': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])]
    });
  }



async  goToHome() {
    if ( this.onLoginForm.valid ) {
      let loading = await this.loadingCtrl.create({
        message: 'Veuillez patienter ...'
      });

      loading.present();
      const toast = await this.toastCtrl.create({
        message: 'Identification incorrecte ou problème de réseaux',
        duration: 5000,
        position: 'top',
        closeButtonText: 'OK',
        showCloseButton: true
      });
       this.auth.login(this.onLoginForm.value).subscribe(
        resp =>  {
          if(resp instanceof Array && resp.length === 0) {
            loading.dismiss();
            toast.present();
          } else {
            console.log(resp);
            if(resp.AUTHORIZATION) {
              localStorage.setItem('AUTHORIZATION',resp.AUTHORIZATION);
            }
            if(resp.clients) {
             let mapClient = this.mapper.mapClient(resp.client);
              localStorage.setItem('AUTHORIZATION',resp.AUTHORIZATION);
            }
            if(resp.etatC) {
               localStorage.setItem('etatc',JSON.stringify(resp.etatC));
             }
             if(resp.etatIncident) {
              localStorage.setItem('etati',JSON.stringify(resp.etatIncident));
            }
            if(resp.user) {
              if(resp.user.roleApkList) {
                let code = resp.user.roleApkList.map(elt=>{
                  return parseInt(elt.code);
                });
                localStorage.setItem('code',JSON.stringify(code));
              }
              if(resp.user.affectTournerUserList) {
                localStorage.setItem('tourners',JSON.stringify(resp.user.affectTournerUserList));
              }
              let mapUser = this.mapper.mapUser(resp.user);
               localStorage.setItem('user',JSON.stringify(resp.user));
               this.events.publish("user:login", resp.user, Date.now());
               if(resp.user.societe) {
                 localStorage.setItem('societe',JSON.stringify(resp.user.societe));
                 if(resp.user.societe.tcategorieList) {
                  let mapUser = this.mapper.mapCategorie(resp.user.societe.tcategorieList);
                   localStorage.setItem('article',JSON.stringify(mapUser));
                 }
                 if(resp.user.societe.tclientsList) {
                  localStorage.setItem('clients',JSON.stringify(resp.user.societe.tclientsList));
                 }
               }
               }
               this.parametre={
                 langue:{nom:'Français',code:'fr'},
                 notification:true,
                 notification_vocale:true,
                 synchronisation_auto:true,
                 interval:{nom:'Journalier',temps:24*60*60*1000}
                };
               localStorage.setItem('parametre',JSON.stringify(this.parametre));
               loading.dismiss();
             
             // tslint:disable-next-line:max-line-length
             this.notif.sendNotification('message', 'Welcome', resp.user.firstname+',Bienvenue dans votre nouvelle plate-forme de prise de commande');
             this.speakerTT.speeker(resp.user.firstname+', Bienvenue, dans votre nouvelle plateforme de prise de commande');
             this.navCtrl.navigateRoot('/home-results');
          }
        },
        err=> {
          loading.dismiss();
        }
      );
      /* setTimeout(() => {
        loading.dismiss();
        this.navCtrl.navigateRoot('/home-results');
      }, 1000); 
      console.log(this.onLoginForm.value);
      this.navCtrl.navigateRoot('/home-results'); */
    }
  }

}
