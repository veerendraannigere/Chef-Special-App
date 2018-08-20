import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { LoadingHandler } from '../../services/loading.handler';
import { SettingsService } from '../../pages/settings/settings.service';
@Component({
  selector: 'page-social',
  templateUrl: 'social.html'
})
export class SocialSettings {
  public socials: any;
  public userId: string;
  public emailId: string;
  public userName: string;
  constructor(public viewCtrl: ViewController, public storage: Storage, private alrtCtrl: AlertController, private settingsService: SettingsService, private navCtrl: NavController, private loadinghandler: LoadingHandler) {
    this.storage.get('loginResponse').then(ele => {
      this.userId = ele.userId;
      this.emailId = ele.email;
      this.userName = ele.userName;

      this.getSocials(this.userId);

    })
  }


  private getSocials(userId) {
    this.socials = [];
    this.loadinghandler.showloader();
    this.settingsService.getSocial(userId).finally(() => { }).subscribe(
      Response => {
        this.socials = Response['response'];

        this.loadinghandler.hideloader();
      },
      error => {
        this.loadinghandler.hideloader();

      });
  };

  //confiramtion to delete
  presentConfirm(socialtype) {
    let alert = this.alrtCtrl.create({
      title: 'Deactivate Account',
      message: 'Are you Sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteUser(socialtype);
          }
        }
      ]
    });
    alert.present();
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }

//delete user
  private deleteUser(socialtype) {
    var payload = {
      user_id: this.userId,
      social_media: socialtype

    }
    this.loadinghandler.showloader();
    this.settingsService.deactiveSocial(payload).finally(() => {this.loadinghandler.hideloader(); }).subscribe(
      Response => {
        if (Response['status'] == 200) {
          this.loadinghandler.presentToast(Response['response']);
          this.viewCtrl.dismiss(true);
         
        }
        if (Response['status'] == 400) {
          this.loadinghandler.presentToast(Response['error']);
        }
      },
      error => {
        this.loadinghandler.presentToast('Something went Wrong');
      });
  };
}