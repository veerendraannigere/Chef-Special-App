import { Injectable } from '@angular/core';
import { Http, Request, RequestOptions, Headers, Response } from '@angular/http';
import { AppConstants } from '../../app/app.constants';
import { Observable } from 'rxjs';
import { HttpClient } from '../../services/http.service';

@Injectable()

export class RestaurantDetailsService {
    constructor(private appconstants: AppConstants, private httpClient: HttpClient) {

    }

    //to get restaurant details with login and without login
    public getRestaurantDetails(slug, userId): Observable<Response> {
        if (userId) {
            var url: string = this.appconstants.baseUrl + this.appconstants.getRestaurantDetailUrl + '/' + slug + '/' + userId;
        }
        else {
            var url: string = this.appconstants.baseUrl + this.appconstants.getRestaurantDetailUrl + '/' + slug;
        }

        return this.httpClient.Get(url).map(this.extractData)
            .catch(this.handleError)
    }

    //to get stamping details
    public getuserStamping(userId, restId) {
        let url: string = this.appconstants.baseUrl + this.appconstants.getStampingUrl + '/' + userId + '/' + restId;
        return this.httpClient.Get(url).map(this.extractData)
            .catch(this.handleError)
    }

    //to post fav
    public postFavrt(favtPayload): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.postFavtUrl;
        return this.httpClient.Post(url, favtPayload).map(this.extractData)
            .catch(this.handleError)
    }

    public postFollow(followPayload): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.followUrl;
        return this.httpClient.Post(url, followPayload).map(this.extractData)
            .catch(this.handleError)
    }
    //to post dish rate
    public postdishRate(dishPayload): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.postDishRateUrl;
        return this.httpClient.Post(url, dishPayload).map(this.extractData)
            .catch(this.handleError)
    }

    public postRestaurantRate(restaurantPayload): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.postRestaurantRateUrl;
        return this.httpClient.Post(url, restaurantPayload).map(this.extractData)
            .catch(this.handleError)
    }

    public postStamp(stampPayload): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.getStampingUrl;
        return this.httpClient.Post(url, stampPayload).map(this.extractData)
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