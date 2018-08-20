import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ReachoutService } from './reachout.service';
import { AppConstants } from '../../app/app.constants';
import { LoadingHandler } from '../../services/loading.handler';
@Component({
  selector: 'page-reachout',
  templateUrl: 'reachout.html',
  providers: [ReachoutService]
})
export class ReachOut {


  public feedbackPayload: any;
  public name: string;
  constructor(public navCtrl: NavController, private reachoutService: ReachoutService, private navParms: NavParams, private alertCtrl: AlertController, private loadingHandler: LoadingHandler, public viewCtrl: ViewController, private appConstants: AppConstants, public navParams: NavParams, public storage: Storage) {

    this.feedbackPayload = {
      email: '',
      feedback: '',
      type: ''
    }
    //for modal title
    if (this.navParams.get('type') == 1) {
      this.name = 'Reach Out';
      this.feedbackPayload.type = "reach_out"
    }
    if (this.navParams.get('type') == 2) {
      this.name = 'Patner with Us';
      this.feedbackPayload.type = "patner_with_us"
    }
    if (this.navParams.get('type') == 3) {
      this.name = 'Help and Support';
      this.feedbackPayload.type = "help_support"
    }
    this.feedbackPayload.type = this.navParams.get('type');
    this.storage.get('loginResponse').then(loginResponse => {
      if (loginResponse) {
        this.feedbackPayload.email = loginResponse.email;
      }
      this.feedbackPayload.email = '';
    });
  }
  //feed back submit
  private feedBackSubmit() {
    this.loadingHandler.showloader();
    this.reachoutService.feedBack(this.feedbackPayload).finally(() => { this.loadingHandler.hideloader(); }).subscribe(
      Response => {
        if (Response.status == 200) {
          this.loadingHandler.presentToast('FeedBack Sent Successfully');
        } else {
          this.loadingHandler.presentToast('Something went Wrong!!!');
        }

      },
      error => {
        this.loadingHandler.presentToast('Something went Wrong!!!');
      });
  };

  closeModal() {
    this.viewCtrl.dismiss();
  }



}
