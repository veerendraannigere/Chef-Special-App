import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { LoadingHandler } from '../../services/loading.handler';
import { SettingsService } from '../../pages/settings/settings.service';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {
  public notificationPayload: any;
  public notificationSettings: any;
  public dealsFlag: boolean;
  public menuFlag: boolean;
  public announcementFlag: boolean;

  constructor(public viewCtrl: ViewController, private loadingHandler: LoadingHandler, private settingsService: SettingsService, public storage: Storage) {
    this.notificationPayload = {
      feature_id: "",
      user_id: "",
      send_mail: ""
    }

    //to get al l settings from local
    this.storage.get('loginResponse').then(loginresponse => {

      this.notificationPayload.user_id = loginresponse.userId;
      this.storage.get('notificationsettings').then(notificationsettings => {
        this.notificationSettings = notificationsettings;
        if (this.notificationSettings.length > 0) {
          this.notificationSettings.forEach(ele => {
            if (ele.feature_id == 1 && ele.send_mail == 1) {
              this.dealsFlag = true;
            }
            if (ele.feature_id == 2 && ele.send_mail == 1) {
              this.menuFlag = true;
            }
            if (ele.feature_id == 3 && ele.send_mail == 1) {
              this.announcementFlag = true;
            }
          });
        }
      });
    });

  }
  //payload creation 
  deals(event) {
    if (event.checked) {
      this.notificationPayload.feature_id = '1';
      this.notificationPayload.send_mail = '1';
      this.changesettings();
    }
    else {
      this.notificationPayload.feature_id = '1';
      this.notificationPayload.send_mail = '0';
      this.changesettings();
    }

  }
  menu(event) {
    if (event.checked) {
      this.notificationPayload.feature_id = '2';
      this.notificationPayload.send_mail = '1';
      this.changesettings();
    }
    else {
      this.notificationPayload.feature_id = '2';
      this.notificationPayload.send_mail = '0';
      this.changesettings();
    }

  }

  announcement(event) {
    if (event.checked) {
      this.notificationPayload.feature_id = '3';

      this.notificationPayload.send_mail = '1';
      this.changesettings();
    }
    else {
      this.notificationPayload.feature_id = '3';
      this.notificationPayload.send_mail = '0';
      this.changesettings();
    }

  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  //to change settings
  private changesettings() {
    this.loadingHandler.showloader();
    this.settingsService.postNotificationSettings(this.notificationPayload).finally(() => { this.loadingHandler.hideloader(); }).subscribe(
      Response => {

        this.notificationSettings.forEach(ele => {
          if (ele.feature_id == this.notificationPayload.feature_id) {
            ele.send_mail = this.notificationPayload.send_mail
          }
        });
        this.storage.set('notificationsettings', this.notificationSettings);
        this.loadingHandler.presentToast('Setting updated Successfully');


      },
      error => {
        this.loadingHandler.presentToast('Something went Wrong!!!');
      });
  };
}