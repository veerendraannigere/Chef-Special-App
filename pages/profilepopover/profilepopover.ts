import { Component } from '@angular/core';
import { NavController, AlertController, App, ViewController, ModalController, Events } from 'ionic-angular';
import { ProfileEdit } from '../profileedit/profileedit';
import { Dashboard } from '../../pages/dashboard/dashboard';
@Component({
    selector: 'page-profilepopover',
    templateUrl: 'profilepopover.html',
    styles: ['./profilepopover.scss'],
})
export class Popover {
    constructor(public navCtrl: NavController, private alertCtrl: AlertController, public appCtrl: App, public viewCtrl: ViewController, public events: Events) { }

    public gotoEditProfile() {
        this.viewCtrl.dismiss().then(() => {
            this.appCtrl.getRootNav().push(ProfileEdit);
        });
    }

    public logout() {
        this.viewCtrl.dismiss().then(() => {
            this.appCtrl.getRootNav().setRoot(Dashboard);
            this.events.publish('logout');
        });

    }
}