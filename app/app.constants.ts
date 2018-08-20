export class AppConstants {
    public readonly baseUrl: string = "https://apiprod.chefspecials.co/";
    //login
    public readonly loginUrl: string = 'loginuser';
    //Register
    public readonly registeruserUrl: string = "registeruser";
    //Restaurant
    public readonly getRestaurantListUrl: string = "restaurants";
    public readonly getRestaurantListbyCuisineUrl: string = 'welcomepage/restaurantbycuisines';
    public readonly getSpecialityRestaurantUrl: string = 'welcomepage/specialities';
    public readonly getRestaurantSpecialityRestaurantUrl: string = 'welcomepage/listSpecialities';
    public readonly getDashboardUrl: string = 'welcomepage/dashboard';
    public readonly getPopularRestaurantUrl: string = "getpopularrestaurants";
    public readonly getRestaurantDetailUrl: string = "restaurant";
    public readonly getSpecialDealRestaurantUrl: string = "getspecialdealsrestaurants";
    public readonly postFavtUrl: string = 'addtomyfav';
    public readonly postRestaurantRateUrl: string = 'starratings';
  
    public readonly allCategoryUrl: string = 'welcomepage/allcuisines';
    // Cuisines
    public readonly getAllCuisinesUrl: string = 'welcomepage/listCuisines';
    //dealsDetails
    public readonly getdealDeatailsUrl: string = 'deals';
    //googleprofile
    public readonly googleProfileImageUrl = 'https://www.googleapis.com/plus/v1/people/';

    //user
    public readonly userDetailsUrl: string = 'getuserdetails';
    public readonly userUpdateUrl: string = 'users';
    public readonly userDeactiveUrl: string = 'user/deactivate';
    public readonly changePasswordUrl: string = 'user/changepassword';
    public readonly deactivateSocialMediaUrl: string = 'user/deactivatesocialmedia';
    public readonly getSocialUrl: string = 'user/socialmedias';
    public readonly getmyDealsUrl: string = 'user/deals/';
    public readonly forgotPasswordUrl: string = 'passwordreset';


    //location
    public readonly localitybyautocompleteUrl: string = 'localitybyautocomplete';
    //stamps
    public readonly getStampingUrl: string = 'stampuser';

    //preference
    public readonly saveUserPreferenceUrl: string = 'userpreference';
    public readonly getuserprefUrl: string = 'getuserpref';

    //userdetails
    public readonly getuserDetailsUrl: 'getuserdetails';

    //feedback
    public readonly feedbackUrl: string = 'feedback';

    //follow
    public readonly followUrl: string = 'follow_unfollow';

    //dishrate
    public readonly postDishRateUrl: string = 'dishrating';

    //notification
    public readonly notifySettingUrl: string = 'notifysettings';

    //socialLogin
    public readonly getSocialUserRegisterUrl: string = 'getsocialuser_register';
    public readonly getsocialuserLogin: string = 'getsocialuser_login';



    //ImgUrls
    public readonly restaurantImgUrl: string = 'https://chefspecial.nyc3.digitaloceanspaces.com/restaurant_default_images/';
    public readonly cuisineImgUrl: string = 'https://chefspecial.nyc3.digitaloceanspaces.com/restaurant_cuisine_images/';
    public readonly menuImgUrl: string = 'https://chefspecial.nyc3.digitaloceanspaces.com/restaurant_menu_images/';
    public readonly dealsImgUrl: string = 'https://chefspecial.nyc3.digitaloceanspaces.com/restaurant_deals_images/';

    //socialSharing:
    public readonly socialSharingUrl: string = 'https://chefspecials.co/';



}