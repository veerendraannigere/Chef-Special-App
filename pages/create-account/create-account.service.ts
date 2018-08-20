import { Injectable } from '@angular/core';
import { Http, Request, RequestOptions, Headers, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AppConstants } from '../../app/app.constants';
import { Observable } from 'rxjs';
import { HttpClient } from '../../services/http.service';

@Injectable()
export class CreateAccountService {
  
    constructor(private httpClient: HttpClient, private appConstants: AppConstants, public storage: Storage, ) {
        
    }
   
   //user signupapi
    public usersignup(values: Object): Observable<Response> {
        var password = values['passwords']['password'];
        window.console.log(password);
        let url: string = '' + this.appConstants.baseUrl + this.appConstants.registeruserUrl;
        let user: Object = {
            first_name: values["first_name"],
            last_name:values["last_name"],
            mobile:values["phone_number"],
            email:values["email"],
            password:password
        };
        let body = JSON.stringify(user);
        return this.httpClient.Post(url, user)
            .map(this.extractData)
            .catch(this.handleError);
    }

    //post preference
    public postPreference(preferencePayload): Observable<Response> {
        let url: string = '' + this.appConstants.baseUrl + this.appConstants.saveUserPreferenceUrl;
        return this.httpClient.Post(url, preferencePayload)
            .map(this.extractData)
            .catch(this.handleError)
    }
    public socialRegister(Payload): Observable<Response> {
        let url: string = '' + this.appConstants.baseUrl + this.appConstants.getSocialUserRegisterUrl;
        return this.httpClient.Post(url, Payload)
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