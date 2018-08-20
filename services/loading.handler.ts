import { AppConstants } from '../app/app.constants';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoadingController,ToastController,AlertController } from 'ionic-angular';

@Injectable()
export class LoadingHandler {

    public selectedContacts: Object;
    public isNotificationRoute: Object;
    public selectedContactUserid: Object;

    private _loading: any;

    constructor(
        private http: Http,
        private constants: AppConstants,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        private alertCtrl: AlertController) {
    }

    public showloader(): void {
        this._loading = this.loadingCtrl.create({
            content: 'Please wait...',
            
        });
        this._loading.present();
    }

    public hideloader(): void {
        setTimeout(() => {
            this._loading.dismiss();
        }, 1000);
    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
          message: msg,
          duration: 3000,
          position: 'bottom'
        });
    
        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });
    
        toast.present();
      }
      presentAlert() {
        let alert = this.alertCtrl.create({
          title: 'Login',
          subTitle: 'Please Login to Continue',
          buttons: ['Dismiss']
        });
        alert.present();
      }

      locationAlert() {
        let alert = this.alertCtrl.create({
          title: 'Location',
          subTitle: 'Please enable Device Location in  Mobile Settings',
          buttons: ['Dismiss']
        });
        alert.present();
      }
}
