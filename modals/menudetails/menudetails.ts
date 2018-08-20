import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { LoadingHandler } from '../../services/loading.handler';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-menudetails',
    templateUrl: 'menudetails.html',

})
export class MenuDetails {
    
    constructor( private viewCtrl: ViewController, private navparams: NavParams, private loadingHandler: LoadingHandler) {}

    closeModal(){
        this.viewCtrl.dismiss();
  }
}