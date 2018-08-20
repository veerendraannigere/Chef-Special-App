import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { LoadingHandler } from '../../services/loading.handler';
import { RestaurantService } from '../../pages/restaurant-list/restaurant-list.service';
import { Storage } from '@ionic/storage';
import { prefenceService } from '../../pages/create-account/preference.service';
import { FilterService } from './filter.service';
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
  providers: [FilterService]
})
export class Filter {
  data: Array<Object> = [];
  selFilterCount: number = 0;
  public userId: string;
  public delivery: any;
  public dietPreference: any;
  public cuisinePreference: any;
  public liquor: any;
  public petFriendly: any;
  public childFriendly: any;
  public getAllFilterData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public filterService: FilterService, public storage: Storage, public viewCtrl: ViewController, private restaurantService: RestaurantService, private loadingHandler: LoadingHandler, private preferenceService: prefenceService) {

    //if filter already set
    this.storage.get('filterData').then(filterData => {
      if (filterData && filterData.length > 0) {
        this.filterallData(filterData);
      }
      else {
        this.getPreference();
      }
    });
   
    this.petFriendly = [{
      name: 'Pet Friendly',
      active: false
    }]
    this.childFriendly = [{
      name: 'Child Friendly',
      active: false
    }]
    this.liquor = [{
      name: 'Liquor',
      active: false
    }]
    this.delivery = [{
      name: 'Delivery',
      active: false
    }]

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Filter');
  }

  toggleDetails(data) {
    if (data.showDetails) {
      data.showDetails = false;
      data.icon = 'ios-arrow-forward-outline';
    } else {
      data.showDetails = true;
      data.icon = 'ios-arrow-down-outline';
    }
  }

  closeModal() {
    this.viewCtrl.dismiss(false);

  }

  //grouping th filter
  getFilterList(): Array<Object> {

    return [{
      filterName: 'Cuisine',
      icon: 'ios-arrow-forward-outline',
      showDetails: false,
      innerFilter: this.cuisinePreference
    },
    {
      filterName: 'Diet',
      icon: 'ios-arrow-forward-outline',
      showDetails: false,
      innerFilter: this.dietPreference,
    }
      , {
      filterName: 'Delivery',
      icon: 'ios-arrow-forward-outline',
      showDetails: false,
      innerFilter: this.delivery
    },
    {
      filterName: 'Liquor',
      icon: 'ios-arrow-forward-outline',
      showDetails: false,
      innerFilter: this.liquor
    }, {
      filterName: 'Child Friendly',
      icon: 'ios-arrow-forward-outline',
      showDetails: false,
      innerFilter: this.childFriendly
    },
    {
      filterName: 'Pet Friendly',
      icon: 'ios-arrow-forward-outline',
      showDetails: false,
      innerFilter: this.petFriendly
    },

    ]

  };

  //filter selection
  onFilterSelected() {
    let selFilter = [];
    this.data.forEach(e => {
      selFilter = selFilter.concat(e['innerFilter'])
    });
    selFilter = selFilter.filter(w => w.active == true);
    this.selFilterCount = selFilter.length;
  };

  clearAllFilter() {
    this.data.forEach(e => {
      e['innerFilter'].forEach(ele => {
        ele['active'] = false;
      })
    });
    this.selFilterCount = 0;
  }

  //to get preference
  getPreference() {
    this.loadingHandler.showloader();
    this.preferenceService.getAllCuisines().finally(() => { this.loadingHandler.hideloader(); }).subscribe(
      response => {
        this.getAllFilterData = response['response'];
        this.storage.set('filterData', this.getAllFilterData)
        this.filterallData(this.getAllFilterData);
      },
      error => {

      });
  }

  //for selecting filter data

  filterallData(getAllFilterData) {
    if (Array.isArray(getAllFilterData)) {

      this.cuisinePreference = getAllFilterData.filter(w => w.type == 'cuisines');
      this.dietPreference = getAllFilterData.filter(w => w.type == 'diet');
      this.dietPreference.forEach(ele => {
        ele['active'] = false;

      });
      this.cuisinePreference.forEach(ele => {
        ele['active'] = false;

      });
    }
    this.data = this.getFilterList();
  }

  //formating response
  filterData() {
    var cuisines = this.cuisinePreference.filter(w => w.active == true);
    var diet = this.dietPreference.filter(w => w.active == true);
    var delivery = this.delivery.filter(w => w.active == true);
    var liquor = this.liquor.filter(w => w.active == true);
    var petFriendly = this.petFriendly.filter(w => w.active == true);
    var childFriendly = this.childFriendly.filter(w => w.active == true);
    if (cuisines.length > 0) {
      this.restaurantService.filterData.cuisines = cuisines;
    }
    if (diet.length > 0) {
      this.restaurantService.filterData.diet = diet;
    }
    if (delivery.length > 0) {
      this.restaurantService.filterData.delivery = delivery;
    }
    if (liquor.length > 0) {
      this.restaurantService.filterData.liquor = liquor;
    }
    if (petFriendly.length > 0) {
      this.restaurantService.filterData.petFriendly = petFriendly;
    }
    if (childFriendly.length > 0) {
      this.restaurantService.filterData.childFriendly = childFriendly;

    }
    this.viewCtrl.dismiss(true);
  }



}
