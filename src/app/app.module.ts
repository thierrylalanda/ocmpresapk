import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

// Modal Pages
import { ImagePageModule } from "./pages/modal/image/image.module";
import { SearchFilterPageModule } from "./pages/modal/search-filter/search-filter.module";

// Components
import { NotificationsComponent } from './components/notifications/notifications.component';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AuthentificationService } from './service/authentification/authentification.service';
import { AuthGuard } from './guard/auth-guard.guard';
import { MapDataService } from './service/map.data.service';
//import { OrderByPipe } from './shared/pipes/orderby.pipe';
import { DateProvider } from '../app/service/date';
import { TextToSpeekService } from '../app/shared/utile/text-to-speek.service';
import { PrinterService } from '../app/shared/utile/printer.service';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { NotificationService } from '../app/shared/utile/notification.service';
import { StarPRNT } from '@ionic-native/star-prnt/ngx';
import { PopmenuNumberComponent } from '../app/components/popmenu-number/popmenu-number.component';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Contacts} from '@ionic-native/contacts/ngx';
import { PhoneService } from '../app/shared/utile/phone.service';
import { SMS } from '@ionic-native/sms/ngx';
import { Printer } from '@ionic-native/printer/ngx';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SignatureComponent } from './components/signature/signature-component';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { SynchronisationService } from '../app/service/synchronisation/synchronisation';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HttpLoaderFactory } from './http-loader-factory';
import { ScanBarCodeService } from '../app/shared/utile/scan-bar-code.service';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { CameraService } from './shared/utile/camera.service';
import { PopmenuPrinterComponent } from "./components/popmenu-printer/popmenu-printer.component";
import { NotificationComponent } from './components/notification/notification.component';
import { Badge } from '@ionic-native/badge/ngx';
import { HelpPipe } from './help.pipe';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';
import { FcmService } from "./service/pushnotification/fcm.service";
var config = {
  apiKey: "AIzaSyDrNp-2Txkq6yBOAqHj0VgGLwHP3mVXTKc",
  authDomain: "ocmapp-8ebde.firebaseapp.com",
  databaseURL: "https://ocmapp-8ebde.firebaseio.com",
  projectId: "ocmapp-8ebde",
  storageBucket: "ocmapp-8ebde.appspot.com",
  messagingSenderId: "373541527793"
};
@NgModule({
  declarations: [
    PopmenuPrinterComponent,
    AppComponent,
    NotificationsComponent,
    PopmenuNumberComponent,
    SignatureComponent,
    NotificationComponent,
    HelpPipe],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    IonicStorageModule.forRoot({
      name: '__ocm',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    SignaturePadModule,
    HttpClientModule,
    ImagePageModule,
    SearchFilterPageModule,
  ],
  entryComponents: [NotificationComponent,NotificationsComponent, PopmenuNumberComponent,SignatureComponent,PopmenuPrinterComponent],
  providers: [
    Camera,
    Badge,
    BluetoothSerial,
    File,
    FileOpener,
    BarcodeScanner,
    DatePicker,
    Printer,
    SMS,
    Contacts,
    CallNumber,
    StarPRNT,
    Vibration,
    TextToSpeech,
    StatusBar,
    SplashScreen,
    DateProvider,
    BackgroundMode,
    NativeStorage,
    MapDataService,
    TextToSpeekService,
    PhonegapLocalNotification,
    NotificationService,
    SynchronisationService,
    PhoneService,
    PrinterService,
    CameraService,
    ScanBarCodeService,
    Firebase,
    FcmService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    AuthentificationService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
