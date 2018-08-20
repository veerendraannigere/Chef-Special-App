import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SettingsPage } from '../pages/settings/settings';
import { Dashboard } from '../pages/dashboard/dashboard';
import { SearchPage } from '../pages/search/search';
import { Login } from '../pages/login/login';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Help } from '../pages/help/help';
import { CreateAccount } from '../pages/create-account/create-account';
import { Profile } from '../pages/profile/profile';
import { Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LoginService } from '../pages/login/login.service';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { AppService } from './app.service';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Dashboard;
  public showDynamicPage: boolean = true;
  public loginResponse: any;
  public currentlocation: any;
  private pages: Array<{ title: string, icon: string, component: any, isBackbtn: boolean, isLoggedIn: boolean }>;
  dynamicPages: Array<{ title: string, icon: string, component: any, isBackbtn: boolean }>;

  constructor(public platform: Platform, public statusBar: StatusBar, private diagnostic: Diagnostic, private alertCtrl: AlertController, private openNativeSettings: OpenNativeSettings, private nativeGeocoder: NativeGeocoder, private appService: AppService, public storage: Storage, private loginService: LoginService, public splashScreen: SplashScreen, public events: Events, private geolocation: Geolocation) {
    this.initializeApp();
    this.currentlocation = {
      latitude: '',
      longitude: ''
    }
    this.checkLocation();



    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Profile', icon: 'contact', component: Profile, isBackbtn: false, isLoggedIn: false },
      { title: 'Discover', icon: 'bulb', component: Dashboard, isBackbtn: false, isLoggedIn: true },
      { title: 'Search', icon: 'search', component: SearchPage, isBackbtn: false, isLoggedIn: true },
      { title: 'Settings', icon: 'ios-settings', component: SettingsPage, isBackbtn: false, isLoggedIn: false },
      { title: 'Help & Info', icon: 'information-circle', component: Help, isBackbtn: false, isLoggedIn: true }
    ];

    this.dynamicPages = [
      { title: 'Create Account', icon: 'add', component: CreateAccount, isBackbtn: true },
      { title: 'Sign-in', icon: 'contact', component: Login, isBackbtn: true },
    ];

    this.events.subscribe('loggedin', () => {
      this.getuserInfo();
      this.pages.forEach(element => {
        element.isLoggedIn = true;
      });
      this.showDynamicPage = false;    // will show the log out button now
    });
    this.events.subscribe('logout', () => {
      this.logout();
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.isLoggedIn();
      this.getuserInfo();
      this.getcurrentLocation();
      // this.currentLocation();

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.isBackbtn) {
      this.nav.push(page.component);
    } else {
      this.nav.setRoot(page.component);
    }

  }

  private getcurrentLocation() {
    this.storage.remove('currentlocation');
    this.geolocation.getCurrentPosition().then((resp) => {
      var currentLatitude = resp.coords.latitude;
      var currentLongitude = resp.coords.longitude;
      this.getlocationName(currentLatitude, currentLongitude);
      this.currentlocation.latitude = currentLatitude;
      this.currentlocation.longitude = currentLongitude;
      this.storage.set('currentlocation', this.currentlocation);
      this.appService.getlocation = this.currentlocation;

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  public isLoggedIn() {
    this.storage.get('isLoggedIn').then((isLoggedIn) => {
      if (isLoggedIn) {
        this.events.publish('loggedin');

      }
    });

  }

  private getuserInfo() {
    if (this.loginService.logindetails) {
      this.loginResponse = this.loginService.logindetails;
    }
    else {
      this.storage.get('loginResponse').then(loginResponse => {
        if (loginResponse != null || loginResponse != undefined) {
          this.loginResponse = loginResponse;
        }

      });
    }
  }
  public logout() {
    this.storage.clear();
    this.showDynamicPage = true;
    this.nav.setRoot(Dashboard);
    this.pages = [
      { title: 'Profile', icon: 'contact', component: Profile, isBackbtn: false, isLoggedIn: false },
      { title: 'Discover', icon: 'bulb', component: Dashboard, isBackbtn: false, isLoggedIn: true },
      { title: 'Search', icon: 'search', component: SearchPage, isBackbtn: false, isLoggedIn: true },
      { title: 'Settings', icon: 'ios-settings', component: SettingsPage, isBackbtn: false, isLoggedIn: false },
      { title: 'Help & Info', icon: 'information-circle', component: Help, isBackbtn: false, isLoggedIn: true },

    ];
  }

  getlocationName(currentLatitude: number, currentLongitude: number) {
    this.nativeGeocoder.reverseGeocode(currentLatitude, currentLongitude)
      .then((result: NativeGeocoderReverseResult) => {
        console.log("location" + result);
        this.storage.set('currentlocality', result[0]['subAdministrativeArea']);
      })
      .catch((error: any) => console.log("data" + error));

  }

  //to check device location on
  checkLocation() {
    this.diagnostic.isLocationEnabled().then(
      (isAvailable) => {
        if (isAvailable) {
          console.log('Is available? ' + isAvailable);
          this.getcurrentLocation();
        }
        else {
          this.presentConfirm()
        }


      }).catch((e) => {
        console.log(e);

      });


  };

  //to enable device location
  presentConfirm() {
    let alert = this.alertCtrl.create({

      message: 'Please turn on Location Services in Settings to allow Chef Special to determine your location',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Settings',
          handler: () => {
            this.openSettings();
          }
        }
      ]
    });
    alert.present();
  }
  openSettings() {
    this.openNativeSettings.open('location').then(data => {

      this.getcurrentLocation();
    });
  }
}
