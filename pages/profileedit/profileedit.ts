import { Component } from '@angular/core';
import { NavController, AlertController, App, ViewController, ModalController, Events } from 'ionic-angular';
import { ProfileService } from '../profile/profile.service';
import { LoadingHandler } from '../../services/loading.handler';
import { EditModel } from './profileeditmodel';
import { Storage } from '@ionic/storage';
import { Profile } from '../profile/profile';
import { Changepassword } from '../../modals/changepassword/changepassword';
@Component({
    selector: 'page-profileedit',
    templateUrl: 'profileedit.html',
    styles: ['./profileedit.scss'],
})
export class ProfileEdit {
    public userDetails = new EditModel();
    public userId: string;
    constructor(public navCtrl: NavController, private alertCtrl: AlertController, public evts: Events, private modalCtrl: ModalController, private loadingHandler: LoadingHandler, public storage: Storage, private profileservice: ProfileService) {
        //get data from local storage
        this.storage.get('userDetails').then(userDetails => {
            this.userDetails['first_name'] = userDetails.user.first_name;
            this.userDetails['last_name'] = userDetails.user.last_name;
            this.userDetails['mobile'] = '+' + userDetails.user.mobile;
            this.userDetails['email'] = userDetails.user.email;
            this.userDetails['send_mail'] = '1';
            this.userId = userDetails.user.id;

        });

        console.log(this.userDetails);

    }
    //profile update
    public updateProfile() {
        this.storage.get('loginResponse').then(ele => {
            var userId = ele.userId;
            this.loadingHandler.showloader();
            this.profileservice.updateProfile(this.userDetails, userId).finally(() => { this.loadingHandler.hideloader(); }).subscribe(
                Response => {
                    if (Response.status == 200) {
                        this.loadingHandler.presentToast('Profile Updated Successfull');
                        this.navCtrl.popTo(Profile);
                        this.getUserDetail(this.userDetails['email']);

                    }
                },
                error => {
                    this.loadingHandler.presentToast('Something went Wrong')
                });


        });


    }

    dealAlert(event) {
        if (event.checked) {
            this.userDetails.send_mail = '1';
        }
        else {
            this.userDetails.send_mail = '0';
        }
    }

    changePassword(myEvent) {

        let popover = this.modalCtrl.create(Changepassword, { userId: this.userId });

        popover.present({
            ev: myEvent
        });
        popover.onDidDismiss(data => {

        });
    }

    private getUserDetail(email) {

        this.profileservice.getUserDetails(email).finally(() => { }).subscribe(
            response => {
                this.evts.publish('updateUser', email);
                this.storage.set('userDetails', response);
            },
            error => {

            });
    }
}