import { Component } from '@angular/core';
import { NavController,AlertController, NavParams,ViewController } from 'ionic-angular';
import{ProfileService} from '../../pages/profile/profile.service';
import { Storage } from '@ionic/storage';
import {LoadingHandler} from '../../services/loading.handler';
import{ProfileEdit} from '../../pages/profileedit/profileedit';
import {SettingsService} from '../../pages/settings/settings.service';

@Component({
  selector: 'page-generalsettings',
  templateUrl: 'generalsettings.html'
})
export class GeneralSettingsPage {
  public userDetails:any;
  constructor( public viewCtrl: ViewController,public storage:Storage,private settingsService:SettingsService,private alertCtrl:AlertController, private profileService:ProfileService,private navCtrl:NavController,private loadinghandler:LoadingHandler){
    this.storage.get('userDetails').then(userDetails =>{
      this.userDetails=userDetails;
    });  
  }
 

  closeModal(){
    this.viewCtrl.dismiss();
  }
  gotoProfile(){
    this.navCtrl.push(ProfileEdit);
  }

  //confirmation for delete
  presentConfirm() {
    let alert = this.alertCtrl.create({
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
           this.deleteUser();
          }
        }
      ]
    });
    alert.present();
  }

  //to delete account
  private deleteUser(){
    this.settingsService.deactiveUser(this.userDetails.user.id).finally(()=>{}).subscribe(
      Response =>{
       if(Response['status']==200){
         this.loadinghandler.presentToast(Response['response']);
         this.viewCtrl.dismiss(true);
       }
       else{
        this.loadinghandler.presentToast(Response['Message']);
       }
      },
      error=>{

      });
  };
}