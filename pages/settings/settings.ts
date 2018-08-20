import { Component } from '@angular/core';
import { NavController, NavParams,ModalController,Events } from 'ionic-angular';
import { NotificationPage } from '../../modals/notification/notification';
import {GeneralSettingsPage} from '../../modals/generalsettings/generalsettings';
import {SocialSettings} from '../../modals/social/social';
import {Dashboard} from '../dashboard/dashboard';
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  constructor(private navCtrl: NavController,private modalCtrl:ModalController,public events: Events) { }
 
  gotonotification() {
    let notificationModal = this.modalCtrl.create(NotificationPage);

    notificationModal.onDidDismiss(data => {
    });
    notificationModal.present();
  }

  //to open general settings
  gotogeneralsettings(){
    let generalsetingsModal = this.modalCtrl.create(GeneralSettingsPage);

    generalsetingsModal.onDidDismiss(data => {
      if(data){
        this.navCtrl.setRoot(Dashboard);
        this.events.publish('logout');
      }
    });
    generalsetingsModal.present();
  }

  //to open social settings
  gotosocialsettings(){
    let socialModal = this.modalCtrl.create(SocialSettings);

    socialModal.onDidDismiss(data => {
      if(data){
        this.navCtrl.setRoot(Dashboard);
        this.events.publish('logout');
      }
    });
    socialModal.present();
  }
  }
