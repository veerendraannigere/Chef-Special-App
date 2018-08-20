import { Component } from '@angular/core';
import { NavController, NavParams,ViewController,AlertController } from 'ionic-angular';

import{DealsDetailsService} from './dealsdetails.service';
import {AppConstants} from '../../app/app.constants';
import {LoadingHandler} from '../../services/loading.handler';
import { ImageLoaderConfig } from 'ionic-image-loader';
@Component({
  selector: 'page-dealsdetails',
  templateUrl: 'dealsdetails.html'
})
export class DealsDetails {
  public detailId:string;
  public getDealsDetail:any;
  public dealsImgUrl:any;
  constructor(public navCtrl: NavController,private dealsDetailsService:DealsDetailsService,private imageLoaderConfig: ImageLoaderConfig,private loadingHandler:LoadingHandler,private alertCtrl: AlertController, public viewCtrl: ViewController,private appConstants:AppConstants,public navParams: NavParams) {
   this.detailId= this.navParams.get('detailId');
   this.dealsImgUrl=this.appConstants.dealsImgUrl;
  this.getdealsDetails(this.detailId);
  
  }

  //to get details of deal
  private getdealsDetails(detailId){
    this.loadingHandler.showloader();
    this.dealsDetailsService.getDealsDetails(detailId).finally(()=>{this.loadingHandler.hideloader();}).subscribe(
      Response =>{
       this.getDealsDetail=Response['response'];
      },
      error=>{

      });
  };

  closeModal(){
    this.viewCtrl.dismiss();
  }
}
