import { Component } from '@angular/core';
import { NavController, NavParams,ViewController,AlertController } from 'ionic-angular';
import {AppConstants} from '../../app/app.constants';
import {countryCodeService} from './countrycode.service';
@Component({
  selector: 'page-countrycode',
  templateUrl: 'countrycode.html',
})

//class to get country code for phonenumber
export class CountryCode {
  public  countryCode:any;
  public tempCountrycode:any;
  constructor(public navCtrl: NavController,private alertCtrl: AlertController,private countrycodeService:countryCodeService, public viewCtrl: ViewController,private appConstants:AppConstants,public navParams: NavParams) {
  
  this.getcountryCode();
  
  }

  //get all country code from json
  getcountryCode() {
    this.countrycodeService.getCountrycode().finally(() => { }).subscribe(
      response => {
        this.countryCode = response;
        this.tempCountrycode=response;
      }

    )
  }
 
  closeModal(item){
    this.viewCtrl.dismiss(item);
  }

  //search function to country code
  getItems(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.tempCountrycode = this.tempCountrycode.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      
    
    } else {
      this.tempCountrycode=this.countryCode;
    }
  }
}
