import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { LoadingHandler } from '../../services/loading.handler';
import { ProfileService } from '../../pages/profile/profile.service';

@Component({
    selector: 'page-changepassword',
    templateUrl: 'changepassword.html',

})
export class Changepassword {
    passwordType: string = 'password';
    passwordIcon: string = 'eye';
    public changePasswordPayload: any;
    constructor(private profileServie: ProfileService, private viewCtrl: ViewController, private navparams: NavParams, private loadingHandler: LoadingHandler) {
        this.changePasswordPayload = {
            current_password: '',
            new_password: '',
            user_id: ''
        }
        this.changePasswordPayload.user_id = this.navparams.get('userId');
    }

    //password hide/show
    hideShowPassword() {
        this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
        this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    }

    //api call to change password
    changePassword() {
        this.loadingHandler.showloader()
        this.profileServie.changepassword(this.changePasswordPayload).finally(() => { this.loadingHandler.hideloader() }).subscribe(
            response => {
                if (response['status'] == 200) {
                    this.loadingHandler.presentToast('Password Changed Successfully');
                    this.viewCtrl.dismiss();

                }
                else {
                    this.viewCtrl.dismiss();
                    this.loadingHandler.presentToast(response['error']);
                }
            },
            error => {
                this.loadingHandler.presentToast('Something went Wrong');
                this.viewCtrl.dismiss();
            });

    }
    closeModal() {
        this.viewCtrl.dismiss();
    }
}
