import { Component } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { NavController, ModalController, NavParams, ToastController, Events } from 'ionic-angular';
import { LoginModel } from './login.model';
import { LoginService } from './login.service';
import { Storage } from '@ionic/storage';

import { LoadingHandler } from '../../services/loading.handler';
import { ProfileService } from '../profile/profile.service';
import { ForgotPassword } from '../../modals/forgotpassword/forgotpassword';
import { Dashboard } from '../dashboard/dashboard';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  private loginModel = new LoginModel();
  public loggedInFlag: boolean = false;
  public loginResponse: any;
  public userDetails: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private loadingHandler: LoadingHandler, private loginService: LoginService, private toastCtrl: ToastController, public storage: Storage, public events: Events, private googlePlus: GooglePlus, private fb: Facebook, private profileService: ProfileService) {
  
    //login payload
    this.loginResponse = {
      userName: '',
      userId: '',
      email: '',
      password: '',
    }
    this.events.subscribe('updateUser', (email) => {
      this.getUserDetail(email);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  //sign in 
  public signIn() {
    this.loadingHandler.showloader();
    this.loginService.login(this.loginModel).finally(() => { }).subscribe(
      response => {
        if (response.status == 200) {
          this.loadingHandler.hideloader();
          this.loggedInFlag = true;
          this.storage.set('isLoggedIn', this.loggedInFlag);
          this.loginResponse.userName = response['response']['first_name'];
          this.loginResponse.email = response['response']['email'];
          this.loginResponse.userId = response['response']['id'];
          this.storage.set('loginResponse', this.loginResponse);
          this.loginService.logindetails = this.loginResponse;
          this.events.publish('loggedin');
          this.navCtrl.setRoot(Dashboard);
          this.getUserDetail(response['response']['email']);
        }

        if (response.status == 400) {
          this.presentToast(response['error']);
          this.loadingHandler.hideloader();
        }
      },
      error => {

      });
  }

  //toaster
  presentToast(error) {
    let toast = this.toastCtrl.create({
      message: error,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  //google login
  public googleLogin() {
    this.loadingHandler.showloader();
    this.googlePlus.login({})
      .then(res => {
        console.log(res);
        this.loadingHandler.hideloader();
        var payload = {
          email: '',
          gmail_token: ''
        }
        payload.email = res.email;
        payload.gmail_token = res.accessToken;
        this.socialLogin(payload);


      })
      .catch(err => {
        console.error(err)
        this.loadingHandler.hideloader();
        this.presentToast(err)
      });
  }

  //facebook login
  public facebookLogin() {
    this.loadingHandler.showloader();
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {
        this.fb.api('/' + res.authResponse.userID + '/?fields=id,email,first_name,middle_name,last_name', []).then(profile => {
          this.loadingHandler.hideloader();
          var payload = {
            email: '',
            facebook_token: ''
          }
          payload.email = profile.email;
          payload.facebook_token = res.authResponse.accessToken;
          this.socialLogin(payload);
        })
        
      })
      .catch(e => {
        console.log('Error logging into Facebook', e);
        this.loadingHandler.hideloader();
      });
  }


  //common socialacount api
  public socialLogin(payload) {
    this.loginService.sociallogin(payload).finally(() => { }).subscribe(
      response => {
        if (response['status'] == 400) {
          this.loggedInFlag = true;
          this.getUserDetail(response['response']['email']);
          this.storage.set('isLoggedIn', this.loggedInFlag);
          this.loginResponse.userName = response['response']['first_name'];
          this.loginResponse.email = response['response']['email'];
          this.loginResponse.userId = response['response']['id'];
          this.events.publish('loggedin');
          this.navCtrl.setRoot(Dashboard);
        }
        if (response['status'] == 210) {
          this.presentToast(response['message']);
        }
      },
      error => {
        console.log('err' + error);
      });
  }


  // toget user details
  private getUserDetail(email) {

    this.profileService.getUserDetails(email).finally(() => { }).subscribe(
      response => {
        this.userDetails = response;

        this.storage.set('userDetails', this.userDetails);
        this.storage.set('notificationsettings', this.userDetails.notification_setting);
        this.loginResponse.userName = this.userDetails.user.first_name;
        this.loginResponse.email = this.userDetails.user.email;
        this.loginResponse.userId = this.userDetails.user.id;
        this.storage.set('loginResponse', this.loginResponse);
        this.loginService.logindetails = this.loginResponse;
      },
      error => {

      });
  }

  forgotPassword() {
    let forgotpassword = this.modalCtrl.create(ForgotPassword, {});
    forgotpassword.present({
    });
  }
}
