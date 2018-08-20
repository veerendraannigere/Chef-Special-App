import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, SearchResponse } from 'elasticsearch';
import { Storage } from '@ionic/storage';
import { AppService } from '../../app/app.service';
@Injectable()
export class ElasticsearchService {

  private client: Client;
  private currentLatitude;
  private currentLongitude;
  constructor(public storage: Storage, private appService: AppService) {


    if (!this.client) {
      this.connect();
    }
  }

  private connect() {
    this.client = new Client({
      host: 'http://142.93.15.170:9200',
      log: 'trace'
    });
  }

  public getRestaurantdata(locality): Promise<SearchResponse<any>> {
    return this.client.search({
      index: 'dev_chefspecial',
      type: 'restaurants',
      body: {
        query: {
          bool: {
            must: {
              term: { locality: locality }
            }
          }
        }
      }
    })
  }

  public restaurantrate(): Promise<SearchResponse<any>> {
    return this.client.search({
      index: 'dev_chefspecial',
      type: 'restaurants',
      body: {
        // sort:[  {"star_ratings" : {"order" : "desc"}}] ,
        query: {
          bool: {
            must: {
              match_all:{}
            }
          }
        } 
      }
    })
  }

  public getnearbyRestaurantdata(): Promise<SearchResponse<any>> {
    if (this.appService.getlocation) {
      this.currentLatitude = this.appService.getlocation.latitude;
      this.currentLongitude = this.appService.getlocation.longitude;
    } else {
      this.storage.get('currentlocation').then(currentlocation => {
        this.currentLatitude = currentlocation.latitude;
        this.currentLongitude = currentlocation.longitude;

      });
    }


    return this.client.search({
      index: 'dev_chefspecial',
      type: 'restaurants',
      body: {
        query: {
          bool: {
           
            filter: {
              geo_distance: {
                distance: "5km",
                location: {
                  lat: this.currentLatitude,
                  lon: this.currentLongitude
                }
              }
            }

          }
        }
      }
    })
  }
  public getfilterSearch(payLoad): Promise<SearchResponse<any>> {
    var childFriendly;
    var petFriendly;
    var cuisines=[];
    var diet=[];
    var delivery;
    var liquor;
    if(payLoad.cuisines.length>0){
      payLoad.cuisines.forEach(element => {
        cuisines.push(element.id);
        
      });
      var stringcuisines= cuisines.toString();
    }
    else{
      stringcuisines='';
    }
    if(payLoad.diet.length>0){
      payLoad.diet.forEach(element => {
        diet.push(element.id);
        
      });
    
      var stringdiet= diet.toString();
    }
    else{
      stringdiet='';
    }
    if(payLoad.delivery.length>0){
     
     var  stringdelivery='yes';
    }
    else{
      stringdelivery='no';
    }
    if(payLoad.liquor.length>0){
     var stringliquor='yes';
    }
    else{
      stringliquor='no';
    }
    if (payLoad.childFriendly.length > 0) {
      childFriendly = 'yes';
    }
    else {
      childFriendly = 'no';
    }
    if (payLoad.petFriendly.length > 0) {
      petFriendly = 'yes';
    }
    else {
      petFriendly = 'no';
    }

    return this.client.search({
      index: 'dev_chefspecial',
      type: 'restaurants',
      body: {
        query: {
          bool: {
            should: [
              {
                term: {
                  child_friendly: childFriendly
                }
              }, {
                term: {
                  pet_Friendly: petFriendly
                }
              },
              {
                term: {
                  cuisines: stringcuisines
                }
              },
              {
                term: {
                  diet: stringdiet
                }
              },
              {
                term: {
                  delivery: stringdelivery
                }
              },
              {
                term: {
                  serves_alcohol: stringliquor
                }
              }

            ]
          }
        }
      }
    });
  }
  isAvailable(): any {
    return this.client.ping({
      requestTimeout: Infinity,
      body: 'hello JavaSampleApproach!'
    });
  }
}