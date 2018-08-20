import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { LoadingHandler } from '../../services/loading.handler';
import { Storage } from '@ionic/storage';
import { RestaurantDetailsService } from '../../pages/restaurant-details/restaurant-details.service';
@Component({
  selector: 'page-restaurantrate',
  templateUrl: 'restaurantrate.html',

})
export class RateRestaurant {
  private menuId: string;
  public overAllRate: string;
  public ratePayload: any;
  constructor(public navCtrl: NavController, public restaurantService: RestaurantDetailsService, public loadingHandler: LoadingHandler, public events: Events, public navParams: NavParams, public storage: Storage, public viewCtrl: ViewController) {
    this.ratePayload = {
      stars: '',
      restaurant_id: '',
      user_id: ''
    }

    this.menuId = this.navParams.get('Id');

  }

//to post rating
  public postRating() {

    this.storage.get('loginResponse').then(ele => {
      if (ele && ele.userId) {
        this.ratePayload['user_id'] = ele.userId;
        this.ratePayload['restaurant_id'] = this.menuId;
        this.restaurantService.postRestaurantRate(this.ratePayload).finally(() => { }).subscribe(
          Response => {
            if (Response['status'] == 200) {
              this.loadingHandler.presentToast("Rated Successfully");
              this.viewCtrl.dismiss(true);
              this.events.publish('updateUser', ele.email);
            }
            else if (Response['status'] == 400) {
              this.loadingHandler.presentToast(Response['error']);
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
