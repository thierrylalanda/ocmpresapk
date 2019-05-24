import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { IncidentService } from './incident.service';
import { AlertController, Platform, ActionSheetController,Events } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class IncidentTraitementService {
user;
  constructor(private api: ApiService,
    private http: HttpClient,
    public incidentP:IncidentService,
    public events:Events,
    public alertCtrl:AlertController) {
      if(localStorage.getItem('user')) {
        this.user=JSON.parse(localStorage.getItem('user'));
      }
    }

 async fermerIncident(incident) {
const alert = await this.alertCtrl.create({
    header: 'Fermeture',
    message: 'Fermeture de l\'incident encours',
    inputs:[
      {
        type:'text',
        name:'description',
        placeholder:'description fermeture'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
        }
      }, {
        text: 'Ok',
        handler: (data) => {
          let datar = {
                  id: "" + incident.id,
                  commentaire: data.description,
                  user:""+this.user.id
                };
          this.incidentP.fermerIncident(datar).subscribe(
            resp => {
              if( resp instanceof Array && resp.length ===0){

              } else {
                if(resp.incident) {
                let newI=resp.incident;
                this.events.publish("incident:update", newI, Date.now());
                }
              }
            }
          );
        }
      }
    ]
  });
  await alert.present();
  }

  async repondreIncident(incident) {
    const alert = await this.alertCtrl.create({
      header: 'Réponse',
      message: 'Réponse de l\'incident encours',
      backdropDismiss:false,
      inputs:[
        {
          type:'text',
          name:'description',
          placeholder:'réponse'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'danger',
          handler: (blah) => {
          }
        }, {
          text: 'Ok',
          cssClass: 'secondary',
          handler: (data) => {
            /* const datar = {
                    id: "" + incident.id,
                    commentaire: data.description,
                     user:""+this.user.id,
                     statut: data.statut
                  }; */
                  if(data.description && data.description!== "") {
                    this.selectStatutIncident(incident,data.description);
                  }
          }
        }
      ]
    });
    await alert.present();
  }

  async selectStatutIncident(incident,description) {
    const alert = await this.alertCtrl.create({
      header: 'Statut',
      message: 'Satut de l\'incident encours',
      backdropDismiss:false,
      inputs:[
        {
          name: 'statut',
          type: 'radio',
          label: 'Encours',
          value: '501',
          checked: true
        },
        {
          name: 'statut',
          type: 'radio',
          label: 'Demande Fermeture',
          value: '502'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'danger',
          handler: (blah) => {
          }
        }, {
          text: 'Ok',
          cssClass: 'secondary',
          handler: (data) => {
            const datar = {
                    id: "" + incident.id,
                    commentaire: description,
                     user:""+this.user.id,
                     statut: data
                  };
                  console.log(datar);
            this.incidentP.repondreIncident(datar).subscribe(
              resp => {
                if( resp instanceof Array && resp.length ===0) {
                  } else {
                  if(resp.incident) {
                  const newI=resp.incident;
                  this.events.publish("incident:update", newI, Date.now());
                  }
                }
              }
            );
          }
        }
      ]
    });
    await alert.present();
  }
}
