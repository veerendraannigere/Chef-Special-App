import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AppConstants } from './app.constants';
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Diagnostic } from '@ionic-native/diagnostic';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { HttpClient } from '../services/http.service';
import { LoadingHandler } from '../services/loading.handler';
import { MyApp } from './app.component';
import { SearchPage } from '../pages/search/search';
import { CreateAccount } from '../pages/create-account/create-account';
import {ForgotPassword} from '../modals/forgotpassword/forgotpassword';
import {MenuDetails} from '../modals/menudetails/menudetails';
import { Login } from '../pages/login/login';
import { Profile } from '../pages/profile/profile';
import { Help } from '../pages/help/help';
import { RestaurantList } from '../pages/restaurant-list/restaurant-list';
import { RestaurantDetails } from '../pages/restaurant-details/restaurant-details';
import { CusinesList } from '../pages/cuisines/cuisines-list';
import { Filter } from '../modals/filter/filter';
import { RateDish } from '../modals/rate/rate';
import {Changepassword} from '../modals/changepassword/changepassword';
import { Sort } from '../modals/sort/sort';
import { RateRestaurant } from '../modals/restaurantrate/restaurantrate';
import { SettingsPage } from '../pages/settings/settings';
import {CountryCode} from '../modals/countrycode/countrycode';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Popover } from '../pages/profilepopover/profilepopover';
import { ProfileEdit } from '../pages/profileedit/profileedit';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonSimpleWizard } from '../components/wizard/ion-simple-wizard.component';
import { IonSimpleWizardStep } from '../components/wizard/ion-simple-wizard.step.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ionic2RatingModule } from 'ionic2-rating';
import { GoogleMap, GoogleMaps } from '@ionic-native/google-maps';
import { HaversineService } from "ng2-haversine";
import { Geolocation } from '@ionic-native/geolocation';
import { MainPipe } from '../pipes/pipe.module';
import { DealsDetails } from '../modals/dealsdetails/dealsdetails';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { NotificationPage } from '../modals/notification/notification';
import { GeneralSettingsPage } from '../modals/generalsettings/generalsettings';
import { SocialSettings } from '../modals/social/social';
import { ReachOut } from '../modals/reachout/reachout';
import {countryCodeService} from '../modals/countrycode/countrycode.service';
import {Dashboard} from '../pages/dashboard/dashboard';
//service
import { HomeService } from '../pages/home/home.service';
import {SettingsService} from '../pages/settings/settings.service';
import { RestaurantService } from '../pages/restaurant-list/restaurant-list.service';
import { RestaurantDetailsService } from '../pages/restaurant-details/restaurant-details.service';
import {DashboardService} from '../pages/dashboard/dashboard.service';
import { ProfileService } from '../pages/profile/profile.service';
import { CreateAccountService } from '../pages/create-account/create-account.service';
import { DealsDetailsService } from '../modals/dealsdetails/dealsdetails.service';
import { prefenceService } from '../pages/create-account/preference.service';
import { LoginService } from '../pages/login/login.service';
import { AppService } from './app.service';
import { ElasticsearchService } from '../pages/search/elasticsearch.service';
import { SearchService } from '../pages/search/search.service';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    MyApp,
    Dashboard,
    SearchPage,
    CreateAccount,
    Login,
    Profile,
    ForgotPassword,
    CusinesList,
    DealsDetails,
    Help,
    MenuDetails,
    RestaurantList,
    RestaurantDetails,
    Filter,
    Changepassword,
    SocialSettings,
    RateDish,
    RateRestaurant,
    Popover,
    ProfileEdit,
    IonSimpleWizard,
    IonSimpleWizardStep,
    SettingsPage,
    NotificationPage,
    GeneralSettingsPage,
    ReachOut,
    CountryCode,
    Sort

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AutoCompleteModule,
    HttpModule,
    MainPipe,
    IonicImageLoader.forRoot(),
    IonicModule.forRoot(MyApp, {
      pageTransition: 'ios-transition',
      platform: {
        android: {
          pageTransition: 'ios'
        },
      }
    }),
    Ionic2RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Dashboard,
    SearchPage,
    CreateAccount,
    Login,
    Profile,
    CountryCode,
    Help,
    Changepassword,
    ForgotPassword,
    RestaurantList,
    RestaurantDetails,
    CusinesList,
    Filter,
    MenuDetails,
    SocialSettings,
    RateDish,
    RateRestaurant,
    Popover,
    ProfileEdit,
    SettingsPage,
    DealsDetails,
    NotificationPage,
    GeneralSettingsPage,
    ReachOut,
    Sort

  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    AppConstants,
    HttpClient,
    RestaurantService,
    RestaurantDetailsService,
    LoadingHandler,
    HomeService,
    HaversineService,
    LoginService,
    CreateAccountService,
    prefenceService,
    ElasticsearchService,
    GooglePlus,
    Facebook,
    AppService,
    DealsDetailsService,
    ProfileService,
    SettingsService,
    SearchService,
    DashboardService,
    Geolocation,
    countryCodeService,
    OpenNativeSettings,
    Diagnostic,
    SocialSharing,
    NativeGeocoder,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: Storage, useFactory: provideStorage }
  ]
})

export class AppModule { }
export function provideStorage() { return new Storage(); };