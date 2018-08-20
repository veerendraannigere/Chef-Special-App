import { Component } from '@angular/core';
import { NavController, NavParams,ModalController } from 'ionic-angular';
import {ReachOut} from '../../modals/reachout/reachout';
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class Help {

  constructor(public navCtrl: NavController, public navParams: NavParams,private modalCtrl:ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Help');
  }
  gotoreachout(type){
    let generalseetingsModal = this.modalCtrl.create(ReachOut,{type:type});

    generalseetingsModal.onDidDismiss(data => {
    });
    generalseetingsModal.present();
  }
}
