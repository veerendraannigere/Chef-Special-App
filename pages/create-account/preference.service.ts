import { Injectable } from '@angular/core';
import { Http, Request, RequestOptions, Headers, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AppConstants } from '../../app/app.constants';
import { Observable } from 'rxjs';
import { HttpClient } from '../../services/http.service';


@Injectable()
export class prefenceService {
  public drinkPreference: any;
  public foodPreference: any;
  public dietPreference: any;
  public cuisinePreference: any;
  constructor(private httpClient: HttpClient, private appConstants: AppConstants, public storage: Storage, ) {


  }


  public getAllCuisines(): Observable<Response> {
    let url: string = this.appConstants.baseUrl + this.appConstants.allCategoryUrl;
    return this.httpClient.Get(url).map(this.extractData)
      .catch(this.handleError)
  }
  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    let err = JSON.parse(error._body);
    return Observable.throw(err);
  }
}
