import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, PopoverController } from 'ionic-angular';
import { RestaurantDetails } from '../restaurant-details/restaurant-details';
import { DealsDetails } from '../../modals/dealsdetails/dealsdetails';
import { Storage } from '@ionic/storage';
import { DashboardService } from './dashboard.service';
import { Filter } from '../../modals/filter/filter';
import { LoadingHandler } from '../../services/loading.handler';
import { HaversineService, GeoCoord } from "ng2-haversine";
import { Geolocation } from '@ionic-native/geolocation';
import { ElasticsearchService } from '../search/elasticsearch.service';
import { AppConstants } from '../../app/app.constants';
import { Sort } from '../../modals/sort/sort';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { MenuDetails } from '../../modals/menudetails/menudetails';
import { SearchPage } from '../search/search';
import { RestaurantList } from '../restaurant-list/restaurant-list';
import { AppService } from '../../app/app.service';
/**
 * Generated class for the Dashboard component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class Dashboard {

  tabs: string;
  public getAllRestaurant: any;
  public currentLatitude: number;
  public currentLongitude: number;
  public resImgUrl: string;
  public userId: string;
  public sortstring;
  public greet: string;
  constructor(public navCtrl: NavController, private imageLoaderConfig: ImageLoaderConfig, private appService: AppService, public navParams: NavParams, private appConstants: AppConstants, public modalCtrl: ModalController, private popCtrl: PopoverController, public storage: Storage, private dashboardService: DashboardService, private loadingHandler: LoadingHandler, private haversineService: HaversineService, private esSearch: ElasticsearchService) {
    this.tabs = 'chefspecial';

    //for greeting msgs
    var myDate = new Date();
    var hrs = myDate.getHours();
    if (hrs < 12) {
      this.greet = 'Good Morning';
    }

    else if (hrs >= 12 && hrs <= 17) {
      this.greet = 'Good Afternoon';
    }

    else if (hrs >= 17 && hrs <= 24) {
      this.greet = 'Good Evening';
    }



    this.storage.get('loginResponse').then(ele => {
      if (ele && ele.userId) {
        this.userId = ele.userId;
      }


    });

    this.resImgUrl = this.appConstants.restaurantImgUrl;
    if (this.navParams.get('locality')) {
      var localityName = this.navParams.get('locality').label;
      this.navCtrl.push(RestaurantList, { Locality: localityName })
    }
    else if (this.navParams.get('nearby')) {
      var localityName = this.navParams.get('nearby');
      this.navCtrl.push(RestaurantList, { Nearby: localityName })
    }
  }

  //tab chnage and check geo location
  onSegmentChange(event) {
    if (event._value == 'restaurant') {
      if (this.appService.getlocation) {
        this.currentLatitude = this.appService.getlocation.latitude;
        this.currentLongitude = this.appService.getlocation.longitude;
      }
      else {
        this.storage.get('currentlocation').then(currentlocation => {
          if (currentlocation) {
            this.currentLatitude = currentlocation.latitude;
            this.currentLongitude = currentlocation.longitude;
          }
        });
      }
      this.getRestaurantList();
    }
  }
  //navigations
  navToDetails(item) {
    this.navCtrl.push(RestaurantDetails, { slug: item.slug, userId: this.userId });
  }
  gotodeals(item) {
    this.navCtrl.push(RestaurantDetails, { slug: item.slug, userId: this.userId, activeTab: 'deals' });
  }
  gotomenu(item) {
    this.navCtrl.push(RestaurantDetails, { slug: item.slug, userId: this.userId, activeTab: 'menu' });
  }

  //to get all restaurants
  private getRestaurantList() {
    this.loadingHandler.showloader();
    this.dashboardService.getallRestaurantList().finally(() => { }).subscribe(
      Response => {
        this.loadingHandler.hideloader();
        if (Array.isArray(Response['response'])) {
          this.getAllRestaurant = Response['response'];
          this.getAllRestaurant = this.getAllRestaurant.filter(w => w.slug != null);
          this.getAllRestaurant.forEach(restaurant => {
            restaurant['distance'] = this.getdistance(restaurant.latitude, restaurant.longitude);
            restaurant['cuisine'] = [];
            for (let key in restaurant.cuisines) {
              if (restaurant.cuisines.hasOwnProperty(key)) {
                restaurant['cuisine'].push(restaurant.cuisines[key]);
              }
            }
          });
        }
        console.log(this.getAllRestaurant);
      },
      error => {
        this.loadingHandler.hideloader();
      });
  }

  //to calculate diffrence
  getdistance(lattitude, longitude) {

    let currentPos: GeoCoord = {
      latitude: this.currentLatitude,
      longitude: this.currentLongitude
    };

    let restaurantPos: GeoCoord = {
      latitude: lattitude,
      longitude: longitude
    };

    let meters = this.haversineService.getDistanceInMeters(currentPos, restaurantPos);
    let kilometers = this.haversineService.getDistanceInKilometers(currentPos, restaurantPos);
    let miles = this.haversineService.getDistanceInMiles(currentPos, restaurantPos);


    return Math.round(kilometers * 10) / 10;
  }


  openMenu() {
    let menuModal = this.modalCtrl.create(MenuDetails);

    menuModal.onDidDismiss(data => {
      if (data) {

      }
    });
    menuModal.present();
  }

  public gottoSearch() {
    this.navCtrl.push(SearchPage);
  }
  opendealDetails(detailId) {
    let detailsModal = this.modalCtrl.create(DealsDetails, { detailId: detailId });

    detailsModal.onDidDismiss(data => {
    });
    detailsModal.present();
  }
}
