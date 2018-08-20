// import { Observable } from 'rxjs/Rx';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { LoadingHandler } from './loading.handler';



@Injectable()
export class HttpClient {
    public authtokenQ: string;
    public pushNotification: any;

    constructor(private http: Http, public storage: Storage, public toastCtrl: ToastController, private loading: LoadingHandler, ) {
        this.authtokenQ = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImYzMTQwYzI1OGEwYzc0NTA3ZmY4M2NmMWZhNmQzOWM4YzkzODEzNDQ0YTE0MjUyN2VjNjViNDg4MGRlNjcxYTExNDU0MmI0ZGZiNDM4MzA1In0.eyJhdWQiOiI4IiwianRpIjoiZjMxNDBjMjU4YTBjNzQ1MDdmZjgzY2YxZmE2ZDM5YzhjOTM4MTM0NDRhMTQyNTI3ZWM2NWI0ODgwZGU2NzFhMTE0NTQyYjRkZmI0MzgzMDUiLCJpYXQiOjE1MTg2MDM2NTcsIm5iZiI6MTUxODYwMzY1NywiZXhwIjoxNTUwMTM5NjU3LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.jvtJVR4cyo6MvV5Tp29mb2aZCGtj8w23j8iJQdObgfQi3df03k_Ir1aFxqMhapEZMtN7sqHXedUak9Ens5Fo8eqszw9-EvRsPAbBGjrB8IiDMi9XsCNeGlYG2YGXw75ejMXB9mMDlaWr5ivWoq0-zWnQXf7FaoPJjw--iCqwy-qw6fT22OC5VjeILxwbQXQ-sjbos3vtt6i7U6P0evs7noPSNheLoPNe4LMuAnwtuLiLCnVj45iOmCtRDq-Qd1Kul5rsX1prKnNVPVCMVwZDFcQ7UsQ1vLrRk5A6V8g_g4iiplMuFOVopKnMhT_t85HbRzDsfyL6nznccXi1CuF1KAVIWTEFs0VOJo8Opvfh169DWwjwmBrRe-vexLVw_8LnIg2t5Q4mtRX0Ypfi8gdS3BvHGCzUzQCvuBLPM2Zag7b8uXDieSo82-Y8CRHigqxTamGDOk-mssIhQzhJ8-Y92i2fKNvIzES37F7ZAsuO0AvGGjmx9Nc1M610Oa0CD6nGLvm1MLkKDcvoL9020psLEcJiCjNR_-z_vw3PaLrca-jlKk-pr-ceeNSf1q2zm5SpzoyVjQz256MfeipdodO40f8pNqVGWKsdCrMGfipSly9o0nEOTBA2uRnKrQhBYDCk4ZFGp1FIUxBdnvTe6ibxLkdKQZ04QzqGlqApFAfoHYY";
    }

    Get(url: string, isAuthRequired: boolean = true, options?: RequestOptionsArgs): Observable<Response> {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        if (isAuthRequired)
            headers.append('Authorization', this.authtokenQ);
        let newOptions = new RequestOptions({
            headers: headers
        });
        return this.http.get(url, Object.assign({}, options, newOptions)).do((res: Response) => {
            this.onSubscribeSuccess(res);
        }, (error: any) => {
            this.onSubscribeError(error);
        }).finally(() => {
            this.onFinally();
        });

        // this.spinner.show();

    }


    Post(url: string, body: any, isAuthRequired: boolean = true, options?: RequestOptionsArgs): Observable<Response> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        if (isAuthRequired)
            headers.append('Authorization', this.authtokenQ);
        let newOptions = new RequestOptions({
            headers: headers
        });
        return this.http.post(url, body, Object.assign({}, options, newOptions)).do((res: Response) => {
            this.onSubscribeSuccess(res);
        }, (error: any) => {
            this.onSubscribeError(error);
        }).finally(() => {
            this.onFinally();
        });
    }

    PostXXX(url: string, body: any, isAuthRequired: boolean = true, options?: RequestOptionsArgs): Observable<Response> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        if (isAuthRequired)
            headers.append('Authorization', this.authtokenQ);
        let newOptions = new RequestOptions({
            headers: headers
        });
        return this.http.post(url, body, Object.assign({}, options, newOptions)).do((res: Response) => {
            this.onSubscribeSuccess(res);
        }, (error: any) => {
            this.onSubscribeError(error);
        }).finally(() => {
            this.onFinally();
        });
    }

    Put(url: string, body: any, isAuthRequired: boolean = true, options?: RequestOptionsArgs): Observable<Response> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        if (isAuthRequired)
            headers.append('Authorization', this.authtokenQ);
        let newOptions = new RequestOptions({
            headers: headers
        });
        return this.http.put(url, body, Object.assign({}, options, newOptions)).do((res: Response) => {
            this.onSubscribeSuccess(res);
        }, (error: any) => {
            this.onSubscribeError(error);
        }).finally(() => {
            this.onFinally();
        });
    }

    Delete(url: string, isAuthRequired: boolean = true, options?: RequestOptionsArgs): Observable<Response> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        if (isAuthRequired)
            headers.append('Authorization', this.authtokenQ);
        let newOptions = new RequestOptions({
            headers: headers
        });
        return this.http.delete(url, Object.assign({}, options, newOptions)).do((res: Response) => {
            this.onSubscribeSuccess(res);
        }, (error: any) => {
            this.onSubscribeError(error);
        }).finally(() => {
            this.onFinally();
        });
    }



    onSubscribeSuccess(res: any) {
    }

    onSubscribeError(err: any) {

        if (navigator.onLine) {

        }
    }

    onFinally() {

    }

    showToast(msg) {
        const toast = this.toastCtrl.create({
            message: msg,
            duration: 3000
        });
        toast.present();
    }
}
