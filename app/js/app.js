'use strict';
// Login Page
var loginApp = angular.module('loginApp', ['ui.router', 'loginController', 'loginService']);

loginApp.config(function($stateProvider, $urlRouterProvider) { 

    $urlRouterProvider.otherwise('/');
  
    $stateProvider
        .state('login', {

            url: '/',

            views: {
                // login step 1
                'main': {

                    templateUrl: '_loginstep1.html',

                    controller: 'MainCtl'
                },
                // login step 2
                'setUsername' : {

                    templateUrl: '_loginstep2.html',

                    controller: 'SetUsernameCtl'
                },
                // login step 3
                'profilePicture' : {

                    templateUrl: '_loginstep3.html',

                    controller: 'SetProfilePictureCtl'
                },
                // login step 4
                'login': {

                    templateUrl: '_loginstep4.html',

                    controller: 'LoginCtl'
                },
                // login step 5
                'setEmailPassword': {

                    templateUrl: '_loginstep5.html',

                    controller: 'setEmailPasswordCtl'
                },
                // login step 6-7
                'healthcarePro': {

                    templateUrl: '_loginstep6.html',

                    controller: 'healthcareProCtl'
                },
                // login step 8
                'loggedInProfile': {

                    templateUrl: '_loginstep8.html',

                    controller: 'LoggedInProfileCtl'
                }
            }
        });
});

// Home Page
var homeApp = angular.module('homeApp', [ 'ui.router', 'ngMaterial', 'wu.masonry','ngAnimate',
  'homeController',
  'homeService',
  'profileController',
  'settingController'
  ]);

homeApp.config(function($stateProvider, $urlRouterProvider) {   
    $urlRouterProvider.otherwise('/');
  
    $stateProvider
      .state('home', {
        url: '/',
        views: {
          'header': {
            templateUrl: 'view/share/_header.html',
            controller: 'HeaderCtrl'
          },
          'main-section': {
            templateUrl: 'view/home/_content.html',
            controller: 'ContentCtrl'
          }
        }
      }) 
});

homeApp.config(function($stateProvider, $urlRouterProvider) {   
    $urlRouterProvider.otherwise('/');
  
    $stateProvider
      .state('profile', {
        url: '/profile',
        views: {
          'header': {
            templateUrl: 'view/share/_header.html',
            controller: 'HeaderCtrl'
          },
          'main-section': {
            templateUrl: 'view/profile/_content.html',
            controller: 'ContentProfileCtrl'
          }
        }
    });   
});


homeApp.config(function($stateProvider, $urlRouterProvider) {   
    $urlRouterProvider.otherwise('/');
  
    $stateProvider
      .state('privacy', {
        url: '/privacy',
        views: {
          'header': {
            templateUrl: 'view/share/_header.html',
            controller: 'HeaderCtrl'
          },
          'main-section': {
            templateUrl: 'view/privacy/_content.html',
            controller: 'ContentCtrl'
          }
        }
    });   
});

homeApp.config(function($stateProvider, $urlRouterProvider) {   
    $urlRouterProvider.otherwise('/');
  
    $stateProvider
      .state('setting', {
        url: '/setting',
        views: {
          'header': {
            templateUrl: 'view/share/_header.html',
            controller: 'HeaderCtrl'
          },
          'main-section': {
            templateUrl: 'view/setting/_content.html',
            controller: 'ContentCtrl'
          }
        }
    });   
});
