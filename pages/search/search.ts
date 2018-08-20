import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Dashboard} from '../../pages/dashboard/dashboard';
import { ElasticsearchService } from './elasticsearch.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchService } from './search.service';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;
  status: string;
  isConnected = false;
  form: FormGroup;
  unFilteredData = [];
  filteredData = [];
  currentlocality:string;
  constructor(public navCtrl: NavController, private fbuilder: FormBuilder, private storage:Storage, public navParams: NavParams, private es: ElasticsearchService, private cd: ChangeDetectorRef, private searchService: SearchService) {

    this.selectedItem = navParams.get('item');
    
      this.storage.get('currentlocality').then(currentlocality => {
      this.currentlocality=currentlocality;
      })

   
  }

  

  public search(event) {
    
    var searchtext = event.value.toLowerCase();
    this.searchService.getLoaction(searchtext).finally(() => { }).subscribe(
      response => {
        this.unFilteredData=[];
        for (var key in response)
          this.unFilteredData.push({id:key, label: response[key] })
      },
      error => {

      });
  }
  public nearby(){
    this.navCtrl.setRoot(Dashboard, {nearby:'Near by Restaurants'})
  }
  public gotoRestaurant(item){
    this.storage.set('locality',item)
    this.navCtrl.setRoot(Dashboard, {locality:item})

  }

}
