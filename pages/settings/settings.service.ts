import { Injectable } from '@angular/core';
import { Http, Request, RequestOptions, Headers, Response } from '@angular/http';
import { AppConstants } from '../../app/app.constants';
import { Observable } from 'rxjs';
import { HttpClient } from '../../services/http.service';

@Injectable()

export class SettingsService {
    public filterData:any;
    constructor(private appconstants: AppConstants, private httpClient: HttpClient) {
  
    }

    public deactiveUser(userId): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.userDeactiveUrl+'/'+userId;
        return this.httpClient.Post(url,userId).map(this.extractData)
            .catch(this.handleError)
    }
    public getSocial(userId): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.getSocialUrl+'/'+userId;
        return this.httpClient.Get(url).map(this.extractData)
            .catch(this.handleError)
    }
    public deactiveSocial(payLoad): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.deactivateSocialMediaUrl;
        return this.httpClient.Post(url,payLoad).map(this.extractData)
            .catch(this.handleError)
    }

    public postNotificationSettings(payload): Observable<Response> {
        let url: string = this.appconstants.baseUrl + this.appconstants.notifySettingUrl;
        return this.httpClient.Post(url,payload).map(this.extractData)
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