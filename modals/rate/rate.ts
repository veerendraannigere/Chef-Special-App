import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { LoadingHandler } from '../../services/loading.handler';
import { Storage } from '@ionic/storage';
import { RestaurantDetailsService } from '../../pages/restaurant-details/restaurant-details.service';
@Component({
  selector: 'page-rate',
  templateUrl: 'rate.html',
})
export class RateDish {
  private menuId: string;
  public overAllRate: string;
  public ratePayload: any;
  public ratepercent: string = '0';
  constructor(public navCtrl: NavController, public restaurantService: RestaurantDetailsService, public loadingHandler: LoadingHandler, public navParams: NavParams, public storage: Storage, public viewCtrl: ViewController, ) {
    this.ratePayload = {
      stars: '',
      dish_id: '',
      user_id: ''
    }

    this.menuId = this.navParams.get('Id');

  }
  //to calculate percentage
  onModelChange(e) {
    if (e == 1) {
      this.ratepercent = '20';
    }
    if (e == 2) {
      this.ratepercent = '40';
    }
    if (e == 3) {
      this.ratepercent = '60';
    }
    if (e == 4) {
      this.ratepercent = '80';
    }
    if (e == 5) {
      this.ratepercent = '100';
    }
  }

  //for post rating
  public postRating() {

    this.storage.get('loginResponse').then(ele => {
      if (ele && ele.userId) {
        this.ratePayload['user_id'] = ele.userId;
        this.ratePayload['dish_id'] = this.menuId;
        this.restaurantService.postdishRate(this.ratePayload).finally(() => { }).subscribe(
          Response => {
            if (Response['status'] == 200) {
              this.loadingHandler.presentToast(Response['message']);
              this.viewCtrl.dismiss(true);
            }
            else if (Response['status'] == 400) {
              this.loadingHandler.presentToast(Response['message']);
              this.viewCtrl.dismiss(false);
            }


          },
          error => {
            this.loadingHandler.presentToast('Something went Wrong');
            this.viewCtrl.dismiss(false);
          });
      }
      else {
        this.loadingHandler.presentAlert();
      }

    })

  }
  closeModal() {
    this.viewCtrl.dismiss(false);
  }



}
