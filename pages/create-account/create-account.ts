import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events, PopoverController, ToastController } from 'ionic-angular';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EqualPasswordsValidator } from '../../validators/validators';
import { LoadingHandler } from '../../services/loading.handler';
import { CreateAccountService } from './create-account.service';
import { countryCodeService } from './countrycode.service';
import { preferenceModel, socialModel } from './preference.model';
import { prefenceService } from './preference.service';
import { Login } from '../login/login';
import { GooglePlus } from '@ionic-native/google-plus';
import { AppConstants } from '../../app/app.constants';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { CountryCode } from '../../modals/countrycode/countrycode';
import { Dashboard } from '../dashboard/dashboard';
@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html',
  providers: [countryCodeService]
})
export class CreateAccount {
  step: any;
  stepCondition: any;
  stepDefaultCondition: any;
  currentStep: any;
  public form: FormGroup;
  public first_name: AbstractControl;
  public last_name: AbstractControl;
  public phone_number: AbstractControl;
  public email: AbstractControl;
  public password: AbstractControl;
  public repeatPassword: AbstractControl;
  public send_mail = '1';
  public passwords: FormGroup;
  public countryCode: any;
  public ctrycode: AbstractControl;
  public ctrycodenum: string = '+91';
  public drinkPreference: any;
  public foodPreference: any;
  public dietPreference: any;
  public cuisinePreference: any;
  public preferencemodel = new preferenceModel();
  public socialmodel = new socialModel();
  public userId: string;
  public finalStep: boolean;
  public imgUrl: string;
  constructor(public navCtrl: NavController, fb: FormBuilder, private appconstants: AppConstants, private popCtrl: PopoverController, public navParams: NavParams, private toastCtrl: ToastController, private countryCodeService: countryCodeService, public alertCtrl: AlertController, public evts: Events, private loadingHandler: LoadingHandler, private createAccountService: CreateAccountService, private preferenceService: prefenceService, private googlePlus: GooglePlus, private facebook: Facebook) {
    this.imgUrl = this.appconstants.restaurantImgUrl;
    this.step = 1;//The value of the first step, always 1
    this.stepCondition = true;//Set to true if you don't need condition in every step
    this.stepDefaultCondition = this.stepCondition;//Save the default condition for every step
    //You can subscribe to the Event 'step:changed' to handle the current step

    this.evts.subscribe('step:changed', step => {
      //Handle the current step if you need

      this.currentStep = step[0];
      if (step == 2 && this.finalStep) {
        this.register(this.form.value);
      }
      //Set the step condition to the default value
      this.stepCondition = this.stepDefaultCondition;
    });
    this.evts.subscribe('step:next', () => {

      //Do something if next
      console.log('Next pressed: ', this.currentStep);
    });
    this.evts.subscribe('step:back', () => {
      //Do something if back
      console.log('Back pressed: ', this.currentStep);
    });
    this.evts.subscribe('comeback', () => {
      //Do something if back
      console.log('Back pressed: ', "came");
      this.step = 1;
    });
    this.evts.subscribe('reset', () => {
      //Do something if back
      this.navCtrl.setRoot(Dashboard);
    });

    //form group for validation
    this.form = fb.group({
      'ctrycode': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'first_name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'last_name': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'phone_number': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'email': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(1)])]
      }, { validator: EqualPasswordsValidator.validate('password', 'repeatPassword') })
    });
    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.ctrycode = this.form.controls['ctrycode'];
    this.phone_number = this.form.controls['phone_number'];
    this.email = this.form.controls['email'];
    this.passwords = <FormGroup>this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
    this.form.get('ctrycode').setValue('+91');
    this.getPreference();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAccount');
  }

  //for dealselection
  dealAlert(event) {
    if (event.checked) {
      this.send_mail = '1';
    }
    else {
      this.send_mail = '0';
    }
  }

  //to get all preference
  getPreference() {
    this.preferenceService.getAllCuisines().finally(() => { }).subscribe(
      response => {
        var getAllCuisines = response['response'];
        if (Array.isArray(getAllCuisines)) {
          this.foodPreference = getAllCuisines.filter(w => w.type == 'food');
          this.cuisinePreference = getAllCuisines.filter(w => w.type == 'cuisines');
          this.dietPreference = getAllCuisines.filter(w => w.type == 'diet');

          this.foodPreference.forEach(ele => {
            ele['active'] = false;

          });
          this.dietPreference.forEach(ele => {
            ele['active'] = false;

          });
          this.cuisinePreference.forEach(ele => {
            ele['active'] = false;

          });
        }


      },
      error => {

      });
  }


  //on finish wizard
  onFinish() {
    this.register(this.form.value);

  }

  //registration
  register(form) {
    form['send_mail'] = this.send_mail;
    form.phone_number = form.ctrycode + form.phone_number;
    console.log(form);
    this.loadingHandler.showloader();
    this.createAccountService.usersignup(form).finally(() => { this.loadingHandler.hideloader(); }).subscribe(
      response => {
        if (response.status == 200) {
          this.userId = response['response']['id'];
          this.finalStep = false;
          this.savePreference();
        }
        if (response.status == 400) {
          this.finalStep = true;
          this.evts.publish('comeBack');
          this.presentToast(response['error']);
        }
      },
      error => {

      });
  };



  toggle() {
    this.stepCondition = !this.stepCondition;
  }
  getIconStep2() {
    return this.stepCondition ? 'unlock' : 'lock';
  }

  getIconStep3() {
    return this.stepCondition ? 'happy' : 'sad';
  }
  getLikeIcon() {
    return this.stepCondition ? 'thumbs-down' : 'thumbs-up';
  }
  goToExample2() {
    // this.navCtrl.push(DynamicPage);
  }

  //validation of form
  inputChange(event) {
    if (this.form.value.first_name != "" && this.form.value.email != "" && this.form.value.passwords.password.length > 1 && this.form.value.passwords.repeatPassword.length > 1 && this.form.value.passwords.password == this.form.value.passwords.repeatPassword) {
      this.evts.publish('validForm');
    }
    else {
      this.evts.publish('invalidForm');
    }
  }
  textChange(e) {
    if (e.target.value && e.target.value.trim() !== '') {
      this.stepCondition = true;
    } else {
      this.stepCondition = false;
    }
  }

//select foodprefence
  foodChanged($event, item) {
    if (item.active) {
      this.preferencemodel.food.push(item.id);
    }
    else {
      let index = this.preferencemodel.food.indexOf(item.id);
      this.preferencemodel.food.splice(index, 1);
      // console.log(this.preferencemodel.food);
    }
  }
//select diet
  dietChanged($event, item) {
    if (item.active) {
      this.preferencemodel.diet.push(item.id);
    }
    else {
      let index = this.preferencemodel.diet.indexOf(item.id);
      this.preferencemodel.diet.splice(index, 1);
      //  console.log(this.preferencemodel.dietPreference);
    }
  }

  //select cuisine
  cuisineChanged($event, item) {
    if (item.active) {
      this.preferencemodel.cuisines.push(item.id);
    }
    else {
      let index = this.preferencemodel.cuisines.indexOf(item.id);
      this.preferencemodel.cuisines.splice(index, 1);
      console.log(this.preferencemodel.cuisines);
    }
  }


  //save all preference
  public savePreference() {
    if (this.userId) {
      this.preferencemodel['user_id'] = this.userId;
      this.createAccountService.postPreference(this.preferencemodel).finally(() => { this.loadingHandler.hideloader(); }).subscribe(
        response => {
          this.redirecttoLogin();
          this.preferencemodel = new preferenceModel();
        },
        error => {
          this.loadingHandler.presentToast('Something Went Wrong!');
        });
    } else {
      this.loadingHandler.presentToast('Something went Wrong!. Please Try Again');

    }

  }

  //social google register
  public googleLogin() {
    this.loadingHandler.showloader();
    this.googlePlus.login({ scopes: 'https://www.googleapis.com/auth/userinfo.profile' })
      .then(res => {
        console.log(res);
        this.socialmodel.first_name = res.givenName;
        this.socialmodel.last_name = res.familyName;
        this.socialmodel.email = res.email;
        this.socialmodel.gmail_token = res.accessToken;
        this.socialReg(this.socialmodel);
        this.loadingHandler.hideloader();


      })
      .catch(err => {
        console.error(err)
        this.loadingHandler.hideloader();
        // this.presentToast(err)
      });
  }


  //social facebook register
  public facebookLogin() {
    this.loadingHandler.showloader();
    this.facebook.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {
        this.facebook.api('/' + res.authResponse.userID + '/?fields=id,email,first_name,middle_name,last_name', []).then(profile => {
          //gify("prof"+profile));
          this.socialmodel.first_name = profile.first_name;
          this.socialmodel.last_name = profile.last_name;
          this.socialmodel.email = profile.email;
          this.socialmodel.facebook_token = res.authResponse.accessToken;
          if (profile.email) {
            this.socialReg(this.socialmodel);
          }
          else {
            this.facebookALert();
          }

          this.loadingHandler.hideloader();
        })

      })
      .catch(e => {
        console.log('Error logging into Facebook', e);
        this.loadingHandler.hideloader();
      });
  }

//social register
  public socialReg(payload) {
    this.createAccountService.socialRegister(payload).finally(() => { }).subscribe(
      response => {
        if (response['status'] == 200) {
          this.presentToast('Registration Successfull');
          this.navCtrl.setRoot(Login);
        }
        if (response['status'] == 400) {
          this.presentToast(response['message']);

        }
      },
      error => {
        console.log('err' + error);
      });
  }


//toaster
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  //redirection
  redirecttoLogin() {
    let alert = this.alertCtrl.create({
      title: 'Registration SuccessFull',
      //message: 'Do you want to buy this book?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.setRoot(Login);
          }
        }
      ]
    });
    alert.present();
  }


  //alert  for if email not found in facebook
  facebookALert() {
    let alert = this.alertCtrl.create({
      title: 'Failed to get Email Address',
      buttons: [
        {
          text: 'Ok',
          handler: () => {

          }
        }
      ]
    });
    alert.present();
  }

  pop(e) {
    let popover = this.popCtrl.create(CountryCode);

    popover.present({

    });
    popover.onDidDismiss(data => {
      if (data) {
        this.ctrycodenum = data;
        this.form.get('ctrycode').reset();
        this.form.get('ctrycode').setValue(data);

      }
    })

  }
}
