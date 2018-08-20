import { Injectable } from '@angular/core';
import { Http, Request, RequestOptions, Headers, Response } from '@angular/http';
import { AppConstants } from '../../app/app.constants';
import { Observable } from 'rxjs';
import { HttpClient } from '../../services/http.service';

@Injectable()

export class HomeService {
    public cuisinesList:any;
    public specialityList:any;
    constructor(private appconstants: AppConstants, private httpClient: HttpClient) {

    }

    public getAllCuisines(): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.getAllCuisinesUrl;
        return this.httpClient.Get(url).map(this.extractData)
            .catch(this.handleError)
    }

    

    public getSpecialRestaurants(): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.getSpecialityRestaurantUrl;
        return this.httpClient.Get(url).map(this.extractData)
            .catch(this.handleError)
    }
    public getdashboard(): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.getDashboardUrl;
        return this.httpClient.Post(url,'').map(this.extractData)
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