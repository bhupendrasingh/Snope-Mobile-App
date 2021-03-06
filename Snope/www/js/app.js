angular.module('ui.gravatar').config([
  'gravatarServiceProvider', function(gravatarServiceProvider) {
    gravatarServiceProvider.defaults = {
      size     : 100,
      "default": 'mm'  // Mystery man as default for missing avatars
    };

    // Use https endpoint
    //gravatarServiceProvider.secure = true;

    // Force protocol http, else will be file on Cordova, which will fail
    gravatarServiceProvider.protocol = 'http';

    // Override URL generating function
    //gravatarServiceProvider.urlFunc = function(options) {
      // Code to generate custom URL
    //};
  }
]);

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'uiGmapgoogle-maps', 'ngCordova', 'ui.gravatar', 'ngMask'])
.constant("apiAddress", "http://45.55.102.116/")
// .constant("apiAddress", "http://tunnel.shaneod.net/")

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $compileProvider) {

  

  $httpProvider.defaults.useXDomain = true;

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.pastJobs', {
    url: '/pastJobs',
    views: {
      'tab-pastJobs': {
        templateUrl: 'templates/pastJobs.html',
        //needs to be past jobs when endpoint is linked up
        controller: 'ListCtrl'
      }
    }
  })

  .state('tab.list', {
    url: '/list',
    views: {
        'tab-jobs': {
          templateUrl: 'templates/list.html',
          controller: 'ListCtrl'
        }
      }
  })

  .state('tab.inProgress', {
    url: '/inProgress',
    views: {
        'tab-inProgress': {
          templateUrl: 'templates/inProgress.html',
          //needs to be in-progress jobs when endpoint is linked up
          controller: 'ListCtrl'
        }
      }
  })


  //login page
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  //signup page
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignupCtrl'
  })
  
  .state('updateUser', {
    url: '/update',
    templateUrl: 'templates/updateUser.html',
    controller: 'UpdateUserCtrl',
    resolve: {
      user_data: function(userService) {
          var data = userService.getUserData()
          return data
      }
    }
  })

  .state('tab.jobDetail', {
    url: '/jobDetail/:id',
    views: {
        'tab-jobs': {
          templateUrl: 'templates/jobDetail.html',
          controller: 'JobDetailCtrl'
        }
      }
  })

  .state('tab.postJobForm', {
    url: '/postJobForm',
    views: {
      'tab-jobs': {
        templateUrl: 'templates/postJobForm.html',
        controller: 'PostJobCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');


})

.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyDu3ACzX5UEHrISWJyIDEYjN40IppUvbbM',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});


app.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            $rootScope.hideTabs = true;
            $scope.$on('$destroy', function() {
                $rootScope.hideTabs = false;
            });
        }
    };
});
