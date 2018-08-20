import { Injectable } from '@angular/core';
import { Http, Request, RequestOptions, Headers, Response } from '@angular/http';

import { AppConstants } from '../../app/app.constants';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {
    public logindetails:any;
    constructor(private httpClient: Http, private appConstants: AppConstants) {

    }

    public login(loginDetails): Observable<Response> {
        let url: string = '' + this.appConstants.baseUrl + this.appConstants.loginUrl;
        return this.httpClient.post(url, loginDetails)
            .map(this.extractData)
            .catch(this.handleError)
    }
    public sociallogin(loginDetails): Observable<Response> {
        let url: string = '' + this.appConstants.baseUrl + this.appConstants.getsocialuserLogin;
        return this.httpClient.post(url, loginDetails)
            .map(this.extractData)
            .catch(this.handleError)
    }

    public forgot(email): Observable<Response> {
        var payload={
            email: email
        }
        let url: string = '' + this.appConstants.baseUrl + this.appConstants.forgotPasswordUrl;
        return this.httpClient.post(url, payload)
            .map(this.extractData)
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