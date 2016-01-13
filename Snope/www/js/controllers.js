angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope) {
  })


  .controller('InProgressCtrl', function ($scope, $stateParams) {

  })


  .controller('LoginCtrl', function ($scope, $stateParams, $http, $state, apiAddress, userService) {
    $scope.user = {};
    $scope.message = "";
    //$scope.formattedPhoto = "data:image/png;base64,"+ $scope.job.photo;

    $scope.authenticate = function () {
      $http.post(apiAddress + 'api/login', $scope.user).then(function (response) {


        if (response.data.statusCode === 200) {
          var userObject = {};
          userObject['userId'] = response.data.userId;
          userObject['userType'] = response.data.userType;

          userService.setUser(userObject);


          if (userObject.userType == "shoveler") {
            $state.go("tab.list");
          } else if (userObject.userType == "customer") {
            $state.go("tab.postJobForm");
          } else {
            alert("userType not correct");
          }

        } else {
          $scope.message = response.data.message;
        }


      });
      console.log($scope.user)
      //$scope.message = "password invalid";
    };

  })

  .controller('SignupCtrl', function ($scope, $stateParams, $state, $http, apiAddress, userService) {
    $scope.user = {};
    // $scope.type = "Shoveler";

    $scope.signup = function () {


      $http.post(apiAddress + 'api/users', $scope.user)

        .then(function (response) {

          if (response.data.statusCode == 200) {

            var userObject = {};
            userObject['userId'] = response.data.userId;
            userObject['userType'] = response.data.userType;

            userService.setUser(userObject);


            if (userObject.userType == "shoveler") {
              $state.go("tab.list");
            } else if (userObject.userType == "customer") {
              $state.go("tab.postJobForm");
            } else {
              alert("userType not correct");
            }


          } else if (response.data.statusCode == 500) {
            alert(response.data.message);
          }
        });

    };
  })

  .controller('UpdateUserCtrl', function ($scope, $stateParams, $state, $http, apiAddress, userService, user_data) {
    // user_data is loaded by a resolve (router)
    $scope.user = user_data.data;
    $scope.update = function () {
      $http.put(apiAddress + 'api/users/' + $scope.user._id, $scope.user)
        .then(function (response) {
          if (response.status == 200 && response.data.message == "User successfully updated!") {
            var user = userService.getUser();
            user.userType = $scope.user.type;
            userService.setUser(user);
            if (user.userType == "shoveler") {
              $state.go("tab.list");
            } else if (user.userType == "customer") {
              $state.go("tab.postJobForm");
            } else {
              alert("userType not correct");
            }
          } else {
            alert(response);
          }
        });
    };
  })

  .controller('GlobalTabCtrl', function ($scope, userService, $state) {
    $scope.setLink = function () {
      var user = userService.getUser();


      if (user.userType == "shoveler") {
        $state.go("tab.list");
      } else if (user.userType == "customer") {
        $state.go("tab.postJobForm");
      }

    }

  })

  .controller('ListCtrl', ['$state', '$scope', 'JobService', function ($state, $scope, JobService) {
    //get open jobs available to shoveler
    JobService.GetOpenJobsForShoveler().then(function (result) {
      $scope.jobs = result;
    });


  }])

  .controller('JobDetailCtrl', ['$scope', '$stateParams', '$log', '$timeout', 'JobService', 'uiGmapGoogleMapApi', 'userService', function ($scope, $stateParams, $log, $timeout, JobService, uiGmapGoogleMapApi, userService) {
    var jobId = $stateParams.id;
    JobService.GetJob(jobId).then(function (result) {
      $scope.job = result;

      var latitude = parseFloat($scope.job.latitude);
      var longitude = parseFloat($scope.job.longitude);

      $scope.user = userService.getUser();

      $scope.map = {center: {latitude: latitude, longitude: longitude}, zoom: 16};
      $scope.marker = {
        id: 0,
        coords: {
          latitude: latitude,
          longitude: longitude
        }
      };
    });



  }])


  .controller('PastJobsCtrl', ['$scope', 'JobService', 'userService', function ($scope, JobService, userService) {
    var user = userService.getUser();
    var userId = user.userId;
    JobService.GetCompletedJobsForShoveler(userId).then(function (result) {
      $scope.jobs = result;


    });

  }])

  .controller('TabCtrl', function ($state, $scope, $rootScope) {
    var hideTabsStates = ['login'];

    $rootScope.$on('$ionicView.beforeEnter', function () {
      $rootScope.hideTabs = ~hideTabsStates.indexOf($state.current.name)
    });
  })

  .controller('PostJobCtrl', ['$scope', 'Camera', '$http', 'uiGmapGoogleMapApi', '$cordovaGeolocation', 'apiAddress', 'userService', function ($scope, Camera, $http, uiGmapGoogleMapApi, $cordovaGeolocation, apiAddress, userService) {

    $scope.job = {};
    var user = userService.getUser();
    $scope.job['customerId'] = user.userId;

    $scope.getUserLocation = function () {

      var posOptions = {timeout: 10000, enableHighAccuracy: true};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var lat = position.coords.latitude
          var lng = position.coords.longitude


          $scope.getUserAddressFromLocation(lat, lng);
        }, function (err) {
          debugger;
          // error
        });
    }

    $scope.getUserAddressFromLocation = function (lat, lng) {

      uiGmapGoogleMapApi.then(function (maps) {
        var latlng = {lat: lat, lng: lng};
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'location': latlng}, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {

            if (results[1]) {


            } else {
              alert('No results found');
            }
          } else {
            alert('Geocoder failed due to: ' + status);
          }
        });
      });
    }


    $scope.geocodeAddress = function () {
      uiGmapGoogleMapApi.then(function (maps) {
        //create Google geocoder
        var geocoder = new google.maps.Geocoder();
        //gather address information from post job form
        var addressString = $scope.job.address + ", " + $scope.job.city + ", " + $scope.job.state + ", " + $scope.job.zipCode;
        //find lat and lng associate with user-entered address
        geocoder.geocode({address: addressString}, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {

            $scope.job['latitude'] = results[0].geometry.location.G;
            $scope.job['longitude'] = results[0].geometry.location.K;

            //submit job only after successful geocoding

            $scope.postJob();

          } else {
            alert("We couldn't find your address. Please try again. Error: " + status);
          }
        });
      });
    };


    $scope.getPhoto = function () {

      var cameraOptions = {
        quality: 50,
        destinationType: navigator.camera.DestinationType.DATA_URL,
        sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Album
        encodingType: 0     // 0=JPG 1=PNG
      };

      navigator.camera.getPicture(function (imageData) {
        $scope.$apply(function() {
          $scope.formattedPhoto = "data:image/png;base64,"+  imageData;
        alert("photo created");
        }); 

      }, function (err) {

        alert("Error: " + err);

      }, cameraOptions);

    };

    $scope.confirmChangePhoto = function(){
      var result = window.confirm("Would you like to retake the picture?");
      debugger;
    };

    $scope.postJob = function () {


      $http.post(apiAddress + 'api/jobs', $scope.job)
        .then(function (response) {

          $state.go('tab.inProgress')
          if (response.data.statusCode == 200) {

          } else if (response.data.statusCode == 500) {

          }
        });
    }


  }]);
