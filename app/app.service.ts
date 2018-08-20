import { Injectable } from '@angular/core';
import { Http, Request, RequestOptions, Headers, Response } from '@angular/http';
import { AppConstants } from './app.constants';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
    public getlocation:any;
    constructor(private httpClient: Http, private appConstants: AppConstants) {

    }

    public getImage(): Observable<Response> {
        let url: string = this.appConstants.baseUrl + this.appConstants.getRestaurantListUrl;
        return this.httpClient.get(url).map(this.extractData)
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