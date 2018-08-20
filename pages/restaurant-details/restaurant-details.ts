import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform, NavController, NavParams, AlertController, ModalController, PopoverController, Events } from 'ionic-angular';
import { RestaurantDetailsService } from './restaurant-details.service';
import { DealsDetails } from '../../modals/dealsdetails/dealsdetails';
import { Storage } from '@ionic/storage';
import { LoadingHandler } from '../../services/loading.handler';
import { Login } from '../login/login';
import * as moment from 'moment';
import { AppConstants } from '../../app/app.constants';
import { RateDish } from '../../modals/rate/rate';
import { RateRestaurant } from '../../modals/restaurantrate/restaurantrate';
import { favtModel, followModel, stampModel } from './restaurant.model';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ImageLoaderConfig } from 'ionic-image-loader';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';

@Component({
  selector: 'page-restaurant-details',
  templateUrl: 'restaurant-details.html',
})
export class RestaurantDetails {
  data: Array<Object> = [];
  public slugName: string;
  restaurant: any;
  public restaurantDetail;
  map: GoogleMap;
  public overview: any;
  public menus: any;
  public deals: any;
  public ratings: any;
  public loyalty: any;
  public opening_hours: any;
  public opening_hours_temp: any;
  public favtPayload = new favtModel();
  public followPayload = new followModel();
  public stampingPayload = new stampModel();
  public userId: string;
  public maxStamp: number;
  public userStamp = [];
  public stampItems = [];
  public isloggedInFlag: boolean;
  public starRatings: any;
  public recentRating: any;
  public oneStar: any;
  public twoStar: any;
  public reedemCode: any;
  public threeStar: any;
  public fourStar: any;
  public fiveStar: any;
  public overAllpercent: any;
  public overAllRate: any;
  public overAllRating: any;
  public offer: any;
  public photos: any;
  public resImgUrl: string;
  public favroutesFlag: boolean = false;
  public followingFlag: boolean = false;
  public showButton: boolean = true;
  public dishRate: number;
  public dealsImgUrl: string;
  public restaurantRate: string;
  weeks: Array<string> = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];



  @ViewChild('map_canvas')
  public map_canvas: ElementRef;
  constructor(public navCtrl: NavController, private imageLoaderConfig: ImageLoaderConfig, public events: Events, public navParams: NavParams, private socialSharing: SocialSharing, private appConstants: AppConstants, public modalCtrl: ModalController, public popoverCtrl: PopoverController, public loadingHandler: LoadingHandler, public platform: Platform, public storage: Storage, public alertCtrl: AlertController, private restaurantDetailsService: RestaurantDetailsService) {
    this.resImgUrl = this.appConstants.restaurantImgUrl;
    this.dealsImgUrl = this.appConstants.dealsImgUrl;

    platform.ready().then(() => {

    });


  }

  ionViewDidLoad() {

    this.slugName = this.navParams.get('slug');
    if (this.navParams.get('activeTab')) {
      this.restaurant = this.navParams.get('activeTab');
    } else {
      this.restaurant = 'overview';
    }
    this.userId = this.navParams.get('userId');
    this.getRestaurantDetail();

  }

  public gotoDetails(dealsId) {
    this.navCtrl.push(DealsDetails, { dealsId })
  }


  //get restaurant details
  private getRestaurantDetail() {
    this.loadingHandler.showloader();
    this.restaurantDetailsService.getRestaurantDetails(this.slugName, this.userId).finally(() => { }).subscribe(
      response => {
        this.overview = response['restaurant'];
        this.restaurantRate = this.overview.star_ratings;
        this.photos = response['photos'];
        this.dishRate = Math.round(response['avg_dish_rating'] * 100) / 100;
        if (response['following'] == 1) {
          this.followingFlag = true;
        }
        else {
          this.followingFlag = false;
        }
        if (response['favroutes'] == 1) {
          this.favroutesFlag = true;
        }
        else {
          this.favroutesFlag = false;
        }
        this.favtPayload['restaurant_id'] = this.overview.id;
        this.followPayload['restaurant_id'] = this.overview.id;
        this.opening_hours = response['opening_hours'];
        this.opening_hours_temp = this.opening_hours.slice(0, 2);
        if (response['menus'].length > 0) {
          this.menus = response['menus'];
        }
        this.menus = response['menus'];
        this.starRatings = response['star_ratings'];
        this.startratings();
        this.recentRating = response['recent_ratings'];

        this.loadMap();
        if (this.menus && this.menus.length > 0) {
          this.weeks.forEach(e => {
            this.menus[e] = response['menus'].filter(w => w[e] == 1);
          })
        }
        if (response['deals'].length > 0) {
          this.deals = response['deals'];
        }

        this.loyalty = response['loyalty'];
        if (this.loyalty.length > 0) {
          this.stampItems = [];
          this.maxStamp = this.loyalty[0].no_of_stamps;
          var number = this.maxStamp;

          for (var i = 1; i <= this.maxStamp; i++) {

            this.stampItems.push({ i: i, used: false });
          }



        }
        this.data = this.getFilterList();
        this.loadingHandler.hideloader();

      },
      error => {

      });
  }
  //rating calculation
  private startratings() {
    var total = this.starRatings[1] + this.starRatings[2] + this.starRatings[3] + this.starRatings[4] + this.starRatings[5];
    this.oneStar = (((this.starRatings[1]) / total) * 100);
    this.twoStar = ((this.starRatings[2]) / total) * 100;
    this.threeStar = ((this.starRatings[3]) / total) * 100;
    this.fourStar = ((this.starRatings[4]) / total) * 100;
    this.fiveStar = ((this.starRatings[5]) / total) * 100;
    this.overAllRating = (5 * this.starRatings[5] + 4 * this.starRatings[4] + 3 * this.starRatings[3] + 2 * this.starRatings[2] + 1 * this.starRatings[1]) / total;
    this.overAllRating = Math.round(this.overAllRating * 100) / 100;
    this.overAllpercent = (this.overAllRating / 5) * 100;
    this.overAllpercent = Math.round(this.overAllpercent * 100) / 100;
  }

  //change tab fun
  onSegmentChange(event) {
    if (event._value == 'overview') {
      this.loadMap();
    }
    if (event._value == 'loyalty') {
      this.showButton = false;
      this.storage.get('loginResponse').then(loginResponse => {
        if (loginResponse && loginResponse.userId) {
          this.userId = loginResponse.userId;
          this.isloggedInFlag = true;
          this.getuserStamp(this.userId);
        }
        else {

        }
      });
    } else {
      this.showButton = true;
    }

  }
  public dayCalculate(rateDate) {
    var today = moment(new Date());
    var startDate = moment(rateDate);
    var end = today.diff(startDate, 'hours');
    console.log(end);
    return end;

  }

  //get stamping
  private getuserStamp(userId) {
    this.loadingHandler.showloader();
    this.restaurantDetailsService.getuserStamping(userId, this.overview.id).finally(() => { this.loadingHandler.hideloader(); }).subscribe(
      response => {
        this.userStamp = response['response'][0];
        if (this.userStamp) {
          this.maxStamp = this.userStamp['max_stamping'];
          var usedStamp = this.userStamp['current_stamping'];
          this.reedemCode = this.userStamp['redeem_code'];
          this.offer = this.userStamp['offer'];
          this.stampItems = [];
          for (var i = 1; i <= this.maxStamp; i++) {
            this.stampItems.push({ i: i, used: false });
          }
          var i = 1;
          this.stampItems.forEach(ele => {
            if (i <= usedStamp) {
              ele['used'] = true;
              i = i + 1;
            }
          })
          if (this.maxStamp == usedStamp) {
            this.showAlert();
          }
        }


        console.log(this.stampItems);
      },
      error => {

      });
  }

  getFilterList(): Array<Object> {
    var dataList = [];
    this.weeks.forEach(e => {
      dataList.push({
        filterName: e,
        icon: 'ios-arrow-forward-outline',
        showDetails: false,
        source: this.menus[e],
      })
    });
    return dataList;
  };

  //accordian close open
  toggleDetails(data) {
    if (data.showDetails) {
      data.showDetails = false;
      data.icon = 'ios-arrow-forward-outline';
    } else {
      data.showDetails = true;
      data.icon = 'ios-arrow-down-outline';
    }
  };

  //to favt/unfavt
  public postfavt(status) {

    this.favtPayload['favroutes'] = status;
    this.storage.get('loginResponse').then(ele => {
      if (ele && ele.userId) {
        this.favtPayload['user_id'] = ele.userId;
        this.loadingHandler.showloader();
        this.restaurantDetailsService.postFavrt(this.favtPayload).finally(() => { this.loadingHandler.hideloader(); }).subscribe(
          Response => {
            this.events.publish('updateUser', ele.email);
            if (Response.status == 200) {

              if (status == 1) {
                this.favroutesFlag = true;
                this.loadingHandler.presentToast('Restaurant Added to your Favorites List');
              }
              else {
                this.favroutesFlag = false;
                this.loadingHandler.presentToast('Restaurant Removed from your Favorites List');
              }

            }
          },
          error => {
          });
      }
      else {
        this.loadingHandler.presentAlert();

      }
    })
  }

  //follow/unfollow
  public postfollowing(status) {

    this.followPayload['following'] = status;
    this.storage.get('loginResponse').then(ele => {
      if (ele && ele.userId) {
        this.followPayload['user_id'] = ele.userId;
        this.loadingHandler.showloader();
        this.restaurantDetailsService.postFollow(this.followPayload).finally(() => {
          this.loadingHandler.hideloader();
        }).subscribe(
          Response => {
            this.events.publish('updateUser', ele.email);
            if (Response.status == 200) {
              if (status == 1) {
                this.followingFlag = true;
                this.loadingHandler.presentToast('You are following this Restaurant');

              }
              else {
                this.followingFlag = false;
                this.loadingHandler.presentToast('You are unfollowing this Restaurant');
              }

            }

          },
          error => {

          });
      }
      else {

        this.loadingHandler.presentAlert();
      }

    })

  }

  //navigation to deal detail
  opendealDetails(detailId) {
    let detailsModal = this.modalCtrl.create(DealsDetails, { detailId: detailId });

    detailsModal.onDidDismiss(data => {
    });
    detailsModal.present();
  }


  //google map of restaurant
  loadMap() {

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.overview.latitude,
          lng: this.overview.longitude
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.
        this.map.addMarker({
          title: 'Ionic',
          icon: 'blue',
          animation: 'DROP',
          position: {
            lat: this.overview.latitude,
            lng: this.overview.longitude
          }
        })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert('clicked');
              });
          });

      });
  }

  //alert to enter pin
  showPrompt() {
    if (this.isloggedInFlag) {
      let prompt = this.alertCtrl.create({
        title: '',
        message: "Please ask your waiter to enter secrete pin",
        inputs: [
          {
            name: 'secret',
            placeholder: 'Secret Pin'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: data => {
              console.log(data.secret);
              this.postStamp(data.secret);
              console.log('Saved clicked');
            }
          }
        ]
      });
      prompt.present();
    }
    else {
      this.loadingHandler.presentAlert();
    }
  }


  private postStamp(secretData) {
    this.stampingPayload.user_id = this.userId;
    this.stampingPayload.restaurant_id = this.overview.id;
    this.stampingPayload.pin = secretData;
    this.restaurantDetailsService.postStamp(this.stampingPayload).finally(() => { }).subscribe(
      Response => {
        if (Response.status == 200 || Response.status == 250) {
          this.loadingHandler.presentToast("Stamping Done Successfully");
          this.getuserStamp(this.userId);
        }
        else if (Response.status == 400) {
          this.loadingHandler.presentToast(Response['message']);
        }

      },
      error => {

      });

  }

  //redeem alert
  showAlert() {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: '<span text-justify>Congrats , Stamping was successful!! on completing  offer!!. Your Reedem Code is' + this.reedemCode + '</span>',
      message: "<p>Offer Details :</p><p>" + this.offer + "</p>",
      buttons: ['OK']
    });
    alert.present();
  };


  //to show open hours
  public showMore() {
    this.opening_hours_temp = this.opening_hours;
  }

  public showLess() {
    this.opening_hours_temp = this.opening_hours.slice(0, 2);
  }



  loginAlert() {
    let alert = this.alertCtrl.create({
      title: 'Not Signed In',
      message: 'Please Login to for stamping',
      buttons: [
        {
          text: 'No thanks',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Login',
          handler: () => {
            this.navCtrl.push(Login);
          }
        }
      ]
    });
    alert.present();
  };


  givedishRate(myEvent, menu) {

    let popover = this.popoverCtrl.create(RateDish, { Id: menu.id });

    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      if (data) {
        this.getRestaurantDetail();
      }
    });
  }

  //ratings
  giverestaurantRate(myEvent) {

    let popover = this.popoverCtrl.create(RateRestaurant, { Id: this.overview.id });

    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      if (data) {
        this.getRestaurantDetail();
      }
    });
  }


  round(item) {
    return Math.round(item * 100) / 100;
  }


  //socal share
  share() {
    // Share via email
    this.socialSharing.share(this.overview.title, 'TestSubject', this.resImgUrl + this.photos[0].filename, this.appConstants.socialSharingUrl + '/' + this.overview.slug).then(() => {
      // Success!
    }).catch((error) => {
      // Error!
      console.log(error);
    });
  }
}

