import { Component, ViewChildren, QueryList } from "@angular/core";
import { Platform, NavController, Events, ModalController, ActionSheetController, PopoverController, IonRouterOutlet, MenuController, ToastController } from '@ionic/angular';
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";
import { Pages } from "./interfaces/pages";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { Toast } from '@ionic-native/toast/ngx';
import { TranslateService } from '@ngx-translate/core';
import { NotificationComponent } from './components/notification/notification.component';
import { Badge } from '@ionic-native/badge/ngx';
import { FcmService } from "./service/pushnotification/fcm.service";
import { NotificationService } from './shared/utile/notification.service';
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  public appPages: any;
  public user: any;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  parametre:any;
  notifLength:any=0;

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    private http: HttpClient,
    private backgroundMode: BackgroundMode,
    public events: Events,
    private fcm: FcmService,
    public modalCtrl: ModalController,
        private menu: MenuController,
        private actionSheetCtrl: ActionSheetController,
        private popoverCtrl: PopoverController,
        private router: Router,
        private toast: Toast,
        public toastController: ToastController,
        public notif: NotificationService,
        private _translate: TranslateService,
        private badge: Badge
  ) {
    this.events.subscribe('parametre:update',(Param,time) => {
      this.parametre=Param;
      this._translate.use(this.parametre.langue.code);
    });
    this.events.subscribe('notification:read',(data,time) => {
      this.notifLength=data;
      /* this.badge.set(10);
this.badge.increase(1); */
      this.badge.clear();
    });
    if(localStorage.getItem("parametre")) {
      this.parametre=JSON.parse(localStorage.getItem("parametre"));
      this._translate.use(this.parametre.langue.code);
          }else {
            this._translate.use('fr');
          }
          this.http.get("assets/data/menu.json").subscribe(
            resp => {
              this.appPages = resp;
              localStorage.setItem('menu',JSON.stringify(resp));
            },
            err => {}
          );
   
    if(localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.badge.increase(1);
     // this.notifLength++;
    }

    this.initializeApp();
    this.backButtonEvent();
  }
  private async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 10000
    });
    toast.present();
  }
  private notificationSetup() {
    this.fcm.getToken();
    this.fcm.onNotifications().subscribe(
      (msg) => {
        if (this.platform.is('ios')) {
          this.presentToast(msg.aps.alert);
        } else {
          this.presentToast(msg.body);
          const title = msg.title ? msg.title : 'message';
          this.notif.sendNotification('message', title, msg.body);
        }
      });
  }
  // active hardware back button
  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
        // close action sheet
        try {
            const element = await this.actionSheetCtrl.getTop();
            if (element) {
                element.dismiss();
                return;
            }
        } catch (error) {
        }

        // close popover
        try {
            const element = await this.popoverCtrl.getTop();
            if (element) {
                element.dismiss();
                return;
            }
        } catch (error) {
        }

        // close modal
        try {
            const element = await this.modalCtrl.getTop();
            if (element) {
                element.dismiss();
                return;
            }
        } catch (error) {
            console.log(error);

        }

        // close side menua
        try {
            const element = await this.menu.getOpen();
            if (element !== null) {
                this.menu.close();
                return;

            }

        } catch (error) {

        }

        this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
           /*  if (outlet && outlet.canGoBack()) {
                outlet.pop();

            } else */ if (this.router.url === '/home-results' || this.router.url === '') {
                if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
                    // this.platform.exitApp(); // Exit from app
                    navigator['app'].exitApp(); // work in ionic 4

                } else {
                    this.toast.show(
                        `Appuyer à nouveau pour sortir.`,
                        '2000',
                        'center')
                        .subscribe(toast => {
                            // console.log(JSON.stringify(toast));
                        });
                    this.lastTimeBackPress = new Date().getTime();
                }
            }
        });
    });
}

  initializeApp() {
    this.platform
      .ready()
      .then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        if(localStorage.getItem('AUTHORIZATION')) {
          this.navCtrl.navigateRoot("/home-results");
          /* if(localStorage.getItem('activePage')) {
            this.navCtrl.navigateRoot(localStorage.getItem('activePage'));
          } */
          this.notificationSetup();
          this.backgroundMode.on('activate').subscribe(() => {
            this.notificationSetup();
          });
          this.backgroundMode.enable();
        } else {
          localStorage.clear();
          this.navCtrl.navigateRoot('');
        }
      })
      .catch(() => {});
 
    let that=this;
    this.events.subscribe("user:login", (user, time) => {
      that.user = user;
    });
    this.events.subscribe("user:update", (user, time) => {
      that.user = user;
    });
  }

  goToEditProgile() {
    this.navCtrl.navigateForward("edit-profile");
  }

  logout() {
  localStorage.clear();
    this.navCtrl.navigateRoot("/");
  }
 async readNotification() {
  this.menu.close();
    const that=this;
   let popover = await this.popoverCtrl.create({
      component: NotificationComponent,
     // event: ev,
      animated: true,
      showBackdrop: true,
      componentProps: { notifLength : that.notifLength,}
    });
    return await popover.present();
  }
}
