import { Injectable } from '@angular/core';
import { Http, Request, RequestOptions, Headers, Response } from '@angular/http';
import { AppConstants } from '../../app/app.constants';
import { Observable } from 'rxjs';
import { HttpClient } from '../../services/http.service';

@Injectable()

export class ProfileService {
    private email: string;
    public userDetails;
    constructor(private appconstants: AppConstants, private httpClient: HttpClient, ) {

    }

    public getUserDetails(email): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.userDetailsUrl + '?email=' + email;
        return this.httpClient.Get(url).map(this.extractData)
            .catch(this.handleError)
    }

    public getUserDeals(userId): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.getmyDealsUrl + userId;
        return this.httpClient.Get(url).map(this.extractData)
            .catch(this.handleError)
    }
    public updateProfile(userPayload, userId): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.userUpdateUrl + '/' + userId;
        return this.httpClient.Put(url, userPayload).map(this.extractData)
            .catch(this.handleError)
    }

    public changepassword(changepasswordPayload): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.changePasswordUrl;
        return this.httpClient.Post(url, changepasswordPayload).map(this.extractData)
            .catch(this.handleError);
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