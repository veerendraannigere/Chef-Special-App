import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, AlertController, Events } from 'ionic-angular';
import { Popover } from '../profilepopover/profilepopover';
import { ProfileService } from './profile.service';
import { Storage } from '@ionic/storage';
import { HaversineService, GeoCoord } from "ng2-haversine";
import { RestaurantDetails } from '../restaurant-details/restaurant-details';
import { AppConstants } from '../../app/app.constants';
import { LoadingHandler } from '../../services/loading.handler';
import * as moment from 'moment';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {
  profile: any = 'favorites';
  public userDetails: any;
  public currentLatitude: any;
  public currentLongitude: any;
  public favourites: any;
  public mydeals: any;
  public userId: string;
  public resImgUrl: string;
  public notifications: any;
  public ratings: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, public evts: Events, private alrtCtrl: AlertController, private loadingHandler: LoadingHandler, private haversineService: HaversineService, private appConstants: AppConstants, public storage: Storage, private profileService: ProfileService) {

    this.resImgUrl = this.appConstants.restaurantImgUrl;

    this.getData();

    this.evts.subscribe('updateUser', () => {

      this.getData();
    });
  }

  private getData() {
    this.storage.get('loginResponse').then(ele => {
      this.storage.get('userDetails').then(userDetails => {
        this.userDetails = userDetails;
        this.profileService.userDetails = this.userDetails.user;
        this.getUserDetail();
        this.storage.get('currentlocation').then(currentlocation => {
          if (currentlocation) {
            this.currentLatitude = currentlocation.latitude;
            this.currentLongitude = currentlocation.longitude;
          };
        });
      });

    });
  }
  private getUserDetail() {
    this.userId = this.userDetails.user.id;
    this.favourites = this.userDetails.user_favroutes;
    this.notifications = this.userDetails.user_notifications;
    this.ratings = this.userDetails.user_ratings;
    this.favourites.forEach(restaurant => {
      restaurant['distance'] = this.getdistance(restaurant.latitude, restaurant.longitude);
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Profile');
  }
  presentPopover(ev) {
    let popover = this.popoverCtrl.create(Popover, );

    popover.present({
      ev: ev,

    });
  }

  //to calculate distance
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

  //navigation
  gotodeals(item) {
    this.navCtrl.push(RestaurantDetails, { slug: item.slug, userId: this.userId, activeTab: 'deals' });
  }
  gotomenu(item) {
    this.navCtrl.push(RestaurantDetails, { slug: item.slug, userId: this.userId, activeTab: 'menu' });
  }
  navToDetails(item) {
    this.navCtrl.push(RestaurantDetails, { slug: item.slug, userId: this.userId });
  }
  public userdeals() {
    this.profileService.getUserDeals(this.userDetails.user.id).finally(() => { }).subscribe(
      response => {
        this.mydeals = response['response'];
      },
      error => {

      });
  }

  //tab chnage
  onSegmentChange(event) {
    if (event._value == 'deals') {
      this.userdeals();
    }
  }

  //day diff calculation
  public dayCalculate(notificationDate) {
    var today = moment(new Date());
    var duration = moment.duration(today.diff(notificationDate));

    var days = duration.asDays();
    days = Math.round(days * 100) / 100;
    return days;

  }

  redeemALert(item) {
    let alert = this.alrtCtrl.create({
      title: 'Redeem Code',
      message: "<p> Your Redeem Code is <strong>" + item.redeem_code + "</strong> for Offer:" + '"' + item.offer + '"',
      buttons: [
        {
          text: 'Ok',
          handler: () => {

          }
        }
      ]
    });
    alert.present();
  }


}
