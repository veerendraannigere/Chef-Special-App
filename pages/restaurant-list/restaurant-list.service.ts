import { Injectable } from '@angular/core';
import { Http, Request, RequestOptions, Headers, Response } from '@angular/http';
import { AppConstants } from '../../app/app.constants';
import { Observable } from 'rxjs';
import { HttpClient } from '../../services/http.service';

@Injectable()

export class RestaurantService {
    public filterData:any;
    constructor(private appconstants: AppConstants, private httpClient: HttpClient) {
    this.filterData={
        cuisines:'',
        diet:'',
        liquor:'',
        delivery:'',
        petFriendly:'',
        childFriendly:'',
    }
    }

    public getallRestaurantList(): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.getRestaurantListUrl;
        return this.httpClient.Get(url).map(this.extractData)
            .catch(this.handleError)
    }
    public getPopularRestaurant(): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.getPopularRestaurantUrl;
        return this.httpClient.Get(url).map(this.extractData)
            .catch(this.handleError)
    }
    public getAllSpecialRestaurant():Observable<Response>{
        let url:string=this.appconstants.baseUrl +this.appconstants.getSpecialDealRestaurantUrl;
        return this.httpClient.Get(url).map(this.extractData)
        .catch(this.handleError)
    }
    public getuserPreference(userId):Observable<Response>{
        let url:string=this.appconstants.baseUrl +this.appconstants.getuserprefUrl+'/'+userId;
        return this.httpClient.Get(url).map(this.extractData)
        .catch(this.handleError)
    }

    public getrestaurantBySpecial(slug): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.getRestaurantSpecialityRestaurantUrl+'/'+slug+'/'+1+'/'+0;
        return this.httpClient.Get(url).map(this.extractData)
            .catch(this.handleError)
    }
    public getrestaurantBycuisine(slug): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.getRestaurantListbyCuisineUrl+'/'+slug+'/'+1+'/'+0;
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