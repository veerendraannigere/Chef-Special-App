import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { HomeService } from "../home/home.service";
import { ImageLoaderConfig } from 'ionic-image-loader';
import {RestaurantList} from '../restaurant-list/restaurant-list';
import {LoadingHandler}from '../../services/loading.handler';
@Component({
  selector: 'page-cuisines-list',
  templateUrl: 'cuisines-list.html',
})
export class CusinesList {

  public getAllData: any;
  public pageDetail:string;

  private cusinesFlag:boolean;
  constructor(public navCtrl: NavController,private imageLoaderConfig: ImageLoaderConfig,private loadingHandler:LoadingHandler, public navParams: NavParams, public modalCtrl: ModalController, private homeService: HomeService) {
   
    // call api based on navparam
   if(this.navParams.get('cuisines')){
      this.getAllData=this.homeService.cuisinesList;
      this.pageDetail='Cuisines';
      this.cusinesFlag=true;
      this.getallcuisines();
    }
    if(this.navParams.get('speciality')){
      this.getAllData=this.homeService.specialityList;
      this.pageDetail='Specialities';
      this.cusinesFlag=false
      this.getspeciality();
    }
  }

  //for restaurant list
  gotoRestaurantList(item){
    if(this.cusinesFlag){
      this.navCtrl.push(RestaurantList, { cuisines: item });
    }else{
      this.navCtrl.push(RestaurantList, { speciality: item });
    }
    
  }

 //to get all cuisines
  private getallcuisines() {
    this.getAllData=[];
    this.loadingHandler.showloader();
    this.homeService.getAllCuisines().finally(() => {}).subscribe(
      Response => {
        this.getAllData = Response['response'];
    
       this.loadingHandler.hideloader();
      },
      error => {
      this.loadingHandler.hideloader();

      });
  };

  //to get all speciality
  private getspeciality() {
  
    this.loadingHandler.showloader();
    this.homeService.getSpecialRestaurants().finally(() => {}).subscribe(
      Response => {
        this.getAllData = Response['response'];
    
       this.loadingHandler.hideloader();
      },
      error => {
      this.loadingHandler.hideloader();

      });
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad RestaurantList');
  }




}
