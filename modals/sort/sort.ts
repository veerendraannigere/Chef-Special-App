import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { LoadingHandler } from '../../services/loading.handler';
import { Storage } from '@ionic/storage';
import { RestaurantDetailsService } from '../../pages/restaurant-details/restaurant-details.service';
@Component({
  selector: 'page-sort',
  templateUrl: 'sort.html',

})
export class Sort {
  private menuId: string;
  public overAllRate: string;
  public ratePayload: any;
  public items: any;

  constructor(public navCtrl: NavController, public restaurantService: RestaurantDetailsService, public loadingHandler: LoadingHandler, public navParams: NavParams, public storage: Storage, public viewCtrl: ViewController, ) {
    //sort option
    this.items = [
      {
        id: 1,
        name: 'Near Me',
        slug: 'nearme'
      },
      {
        id: 2,
        name: 'Restaurant Rating',
        slug: 'restaurantrating'
      },]
  }
  itemSelected(item) {
    this.viewCtrl.dismiss(item);
  }
  closeModal() {
    this.viewCtrl.dismiss(false);
  }
}
