import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, PopoverController } from 'ionic-angular';
import { RestaurantDetails } from '../restaurant-details/restaurant-details';
import { Dashboard } from '../../pages/dashboard/dashboard';
import { Storage } from '@ionic/storage';
import { RestaurantService } from './restaurant-list.service';
import { Filter } from '../../modals/filter/filter';
import { LoadingHandler } from '../../services/loading.handler';
import { HaversineService, GeoCoord } from "ng2-haversine";
import { Geolocation } from '@ionic-native/geolocation';
import { ElasticsearchService } from '../search/elasticsearch.service';
import { AppConstants } from '../../app/app.constants';
import { Sort } from '../../modals/sort/sort';
import { ImageLoaderConfig } from 'ionic-image-loader';
@Component({
  selector: 'page-restaurant-list',
  templateUrl: 'restaurant-list.html',
})
export class RestaurantList {
  pageDetails: string;

  public getAllRestaurant: any;
  public currentLatitude: number;
  public currentLongitude: number;
  public resImgUrl: string;
  public userId: string;
  public sortstring;
  constructor(public navCtrl: NavController,private imageLoaderConfig: ImageLoaderConfig, public navParams: NavParams, private appConstants: AppConstants, public modalCtrl: ModalController, private popCtrl: PopoverController, public storage: Storage, private restaurantService: RestaurantService, private loadingHandler: LoadingHandler, private haversineService: HaversineService, private esSearch: ElasticsearchService) {
  
    //to get current location
    this.storage.get('currentlocation').then(currentlocation => {
      if (currentlocation) {
        this.currentLatitude = currentlocation.latitude;
        this.currentLongitude = currentlocation.longitude;
      }
      this.storage.get('loginResponse').then(ele => {
        if(ele && ele.userId){
          this.userId=ele.userId;
        }
      
  
      });

    });

   // call specific function based on nav
     if (this.navParams.get('Locality')) {
      this.storage.get('locality').then(ele => {
        this.pageDetails = ele.label;
        this.getelasticSearch();
      })
    }
    else if (this.navParams.get('cuisines')) {
      var slug =this.navParams.get('cuisines');
      this.pageDetails = 'Cuisine Based Restaurants';
     this.getRestaurantbyCuisines(slug);
    }
    else if (this.navParams.get('speciality')) {
      var slug =this.navParams.get('speciality');
      this.pageDetails = 'Speciality Based Restaurants';
     this.getRestaurantbySpecial(slug);
    }
    else if (this.navParams.get('Nearby')) {
      this.pageDetails = 'Nearby';
    }
    else if (this.navParams.get('filter')) {
      this.pageDetails = 'Filterd Restaurants';
      this.getFilterRestuarant();

    }
    else {
      this.pageDetails = this.navParams.get('PageDetail');
    }

//switch for different restaurant group
    switch (this.pageDetails) {
      case 'All Restaurants':
        this.getRestaurantList();
        break;

      case 'Most Popular':
        this.getPopularRestaurant();
        break;
      case 'Nearby':
        this.getnearbyRestautants();
        break;

      case 'Special Deals':
        this.getSpeicalRestaurant();
        break;
    }

    //this.getRestaurantList();

    this.resImgUrl = this.appConstants.restaurantImgUrl;
  }


//to get all restaurant list
  private getRestaurantList() {
    this.loadingHandler.showloader();
    this.restaurantService.getallRestaurantList().finally(() => { }).subscribe(
      Response => {
        this.loadingHandler.hideloader();
        if (Array.isArray(Response['response'])) {
          this.getAllRestaurant = Response['response'];
          this.getAllRestaurant=  this.getAllRestaurant.filter(w=> w.slug !=null);
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

  //to get popular list
  private getPopularRestaurant() {
    this.loadingHandler.showloader();
    this.restaurantService.getPopularRestaurant().finally(() => { }).subscribe(
      Response => {
        this.loadingHandler.hideloader();
        if (Array.isArray(Response['response'])) {
          this.getAllRestaurant = Response['response'];
          this.getAllRestaurant=  this.getAllRestaurant.filter(w=> w.slug !=null);
          this.getAllRestaurant.forEach(restaurant => {
            restaurant['distance'] = this.getdistance(restaurant.latitude, restaurant.longitude);
          });
        }
        console.log(this.getAllRestaurant);
      },
      error => {
        this.loadingHandler.hideloader();
      });
  }

  private getSpeicalRestaurant() {
    this.loadingHandler.showloader();
    this.restaurantService.getAllSpecialRestaurant().finally(() => { }).subscribe(
      Response => {
        this.loadingHandler.hideloader();
        if (Array.isArray(Response['response'])) {
          this.getAllRestaurant = Response['response'];
          this.getAllRestaurant=  this.getAllRestaurant.filter(w=> w.slug !=null);
          this.getAllRestaurant.forEach(restaurant => {
          
            restaurant['distance'] = this.getdistance(restaurant.latitude, restaurant.longitude);
           
          });
        }
        console.log(this.getAllRestaurant);
      },
      error => {
        this.loadingHandler.hideloader();
      });
  }

  private getRestaurantbyCuisines(slug) {
    this.loadingHandler.showloader();
    this.restaurantService.getrestaurantBycuisine(slug).finally(() => { }).subscribe(
      Response => {
        this.loadingHandler.hideloader();
        if (Array.isArray(Response['restaurant'])) {
          this.getAllRestaurant =Response['restaurant'];
          this.getAllRestaurant=  this.getAllRestaurant.filter(w=> w.slug !=null);
          this.getAllRestaurant.forEach(restaurant => {
          
            restaurant['distance'] = this.getdistance(restaurant.latitude, restaurant.longitude);
           
          });
        }
        console.log(this.getAllRestaurant);
      },
      error => {
        this.loadingHandler.hideloader();
      });
  }

  private getRestaurantbySpecial(slug) {
    this.loadingHandler.showloader();
    this.restaurantService.getrestaurantBySpecial(slug).finally(() => { }).subscribe(
      Response => {
        this.loadingHandler.hideloader();
        if (Array.isArray(Response['restaurant'])) {
          this.getAllRestaurant = Response['restaurant'];
          this.getAllRestaurant=  this.getAllRestaurant.filter(w=> w.slug !=null);
          this.getAllRestaurant.forEach(restaurant => {
          
            restaurant['distance'] = this.getdistance(restaurant.latitude, restaurant.longitude);
           
          });
        }
        console.log(this.getAllRestaurant);
      },
      error => {
        this.loadingHandler.hideloader();
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RestaurantList');
  }

  //navigation
  navToDetails(item) {
    this.navCtrl.push(RestaurantDetails, { slug: item.slug, userId: this.userId });
  }
  gotodeals(item) {
    this.navCtrl.push(RestaurantDetails, { slug: item.slug, userId: this.userId, activeTab: 'deals' });
  }
  gotomenu(item) {
    this.navCtrl.push(RestaurantDetails, { slug: item.slug, userId: this.userId, activeTab: 'menu' });
  }
  openFilters() {
    let filterModal = this.modalCtrl.create(Filter);

    filterModal.onDidDismiss(data => {
      if (data) {
        this.navCtrl.setRoot(Dashboard, { filter: 'filter' });
      }
    });
    filterModal.present();
  }

  //genral function to calculate distance
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

  getFilterRestuarant() {
    this.esSearch.getfilterSearch(this.restaurantService.filterData).then(
      response => {
        this.loadingHandler.hideloader();
        this.arrangeData(response);
      },

      error => {
        console.log(error);
        this.loadingHandler.hideloader();
      });


  }
  private getelasticSearch() {
    this.loadingHandler.showloader();
    this.storage.get('locality').then(ele => {

      this.esSearch.getRestaurantdata(ele.id).then(
        response => {
          this.loadingHandler.hideloader();
          this.arrangeData(response);
        },

        error => {
          console.log(error);
          this.loadingHandler.hideloader();
        });

    })

  }



  private getnearbyRestautants() {
    this.loadingHandler.hideloader();
    this.loadingHandler.showloader();
    this.esSearch.getnearbyRestaurantdata().then(
      response => {
        this.loadingHandler.hideloader();
        this.arrangeData(response);
      },

      error => {
        console.log(error);
        this.loadingHandler.hideloader();
      });

  }

  private restaurantrating() {
    this.loadingHandler.showloader();
    this.esSearch.restaurantrate().then(
      response => {
        this.loadingHandler.hideloader();
        this.arrangeData(response);
      },

      error => {
        console.log(error);
        this.loadingHandler.hideloader();
      });
  }

  //formating response
  arrangeData(data) {
    var arrTemp = [];
    data.hits.hits.forEach(ele => {
      arrTemp.push(ele._source);
    });
    this.getAllRestaurant = arrTemp;
    this.getAllRestaurant=  this.getAllRestaurant.filter(w=> w.slug !=null);
    this.getAllRestaurant.forEach(restaurant => {
      // restaurant['cuisine']=[];
      restaurant['distance'] = this.getdistance(restaurant.location.lat, restaurant.location.lon);
     
    });
  }

  //to open sort popup
  sort() {

    let popover = this.popCtrl.create(Sort, {});
    popover.present({
    });
    popover.onDidDismiss(data => {
      if (data) {
        if (data.slug == 'nearme') {
          this.getnearbyRestautants();
        }
        if (data.slug == 'restaurantrating') {
        //  this.restaurantrating();

        this.getAllRestaurant.sort((a, b) => {
          if (a.star_ratings < b.star_ratings) return 1;
          else if (a.star_ratings > b.star_ratings) return -1;
          else return 0;
        });
        }


      }
    });
  }
}



