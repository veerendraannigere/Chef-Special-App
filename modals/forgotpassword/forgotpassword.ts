import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { LoginService } from '../../pages/login/login.service';
import { LoadingHandler } from '../../services/loading.handler';
@Component({
    selector: 'page-forgotpassword',
    templateUrl: 'forgotpassword.html'
})
export class ForgotPassword {
    public email: string;

    constructor(private loginService: LoginService, public navCtrl: NavController, private loadingHandler: LoadingHandler, private viewCtrl: ViewController) { }

    forgot() {
        this.loadingHandler.showloader();
        this.loginService.forgot(this.email).finally(() => { this.loadingHandler.hideloader(); }).subscribe(
            response => {
                if (response['status'] == 200) {
                    this.loadingHandler.presentToast("Success");
                    this.viewCtrl.dismiss();
                }

                if (response['status'] == 400) {
                    this.loadingHandler.presentToast(response['response']);
                }

            },
            error => {
                this.loadingHandler.presentToast('Something went Wrong');
            });
    }
    closeModal() {
        this.viewCtrl.dismiss();
    }
}