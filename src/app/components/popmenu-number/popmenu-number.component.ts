import { Component, OnInit, Input } from "@angular/core";
import { PopoverController,ToastController, Events, AlertController } from "@ionic/angular";
import { PhoneService } from "src/app/shared/utile/phone.service";
@Component({
  selector: "app-popmenu-edit-commande",
  template: "<ion-item (click)='callNumber()'><ion-icon name='call' slot='start' color='primary'></ion-icon>Appeler</ion-item>"+
  "<ion-item (click)='saveNumber()'><ion-icon name='contact' slot='start' color='primary'></ion-icon>Enregister</ion-item>"
})
export class PopmenuNumberComponent implements OnInit {
  @Input() societe;
  constructor(
    public popCtrl: PopoverController,
    public toastCtrl: ToastController,
    public events: Events,
    public phone: PhoneService,
    public alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  dismiss() {
    this.popCtrl.dismiss();
  }

  callNumber() {
    this.phone.CallNumber(this.societe.tel);

    this.popCtrl.dismiss();
  }
 async saveNumber() {
    this.popCtrl.dismiss();
    const contact ={
        tel: this.societe.tel,
        nom: this.societe.nom
    };
    const SaveYourCommande = await this.alertCtrl.create({
      header: "Enregistrer un contact",
     // message: "Total :",
      inputs: [
          {
              name: "tel",
              value: contact.tel,
              placeholder: "numéro",
              type: "number"
            },
        {
          name: "nom",
          value: contact.nom,
          placeholder: "votre message",
          type: "text"
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {}
        },
        {
          text: 'Enregistrer',
          handler: async data => {
            if (data.tel && data.nom) {
              contact.nom=data.nom;
              contact.tel=data.tel;
              this.phone.SaveContact(contact).then(
                resp=> {
                  this.sendTaoster('Votre contact a bien été enregistré');
                },
                err=> {
                  this.sendTaoster(' contact non enregistré');
                }
              );
            }
          }
        }
      ]
    });
    SaveYourCommande.present();
  }
async  sendSMS() {
    this.popCtrl.dismiss();
    const SaveYourCommande = await this.alertCtrl.create({
        header: "Envoyer un message",
       // message: "Total :",
        inputs: [
            {
                name: "number",
                value: this.societe.tel,
                placeholder: "votre message",
                type: "text"
              },
          {
            name: "message",
            placeholder: "votre message",
            type: "text"
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {}
          },
          {
            text: 'Envoyer',
            handler: async data => {
              if (data.message && data.number) {
                this.phone.sendMessage(data).then(
                    val=> { this.sendTaoster('Votre message a bien été envoyé'); },
                    err =>{ }
                );
              }
            }
          }
        ]
      });
      SaveYourCommande.present();
  }
  async sendTaoster(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      closeButtonText: 'OK',
      showCloseButton: true
    });
    return toast.present();
  }
}
