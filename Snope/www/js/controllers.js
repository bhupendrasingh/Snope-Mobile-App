angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('LoginCtrl', function($scope, $stateParams, $http) {
  $scope.user = {};
  $scope.message = "";
  $scope.authenticate = function(){
    console.log($scope.user)
    $scope.message = "password invalid";
  };

})

.controller('SignupCtrl', function($scope, $stateParams,$state, $http) {
  $scope.user = {};
  // $scope.type = "Shoveler";

  $scope.signup = function(){


    $http.post('http://45.55.102.116/api/users', $scope.user)
    .then(function(response){
      
      if(response.data.statusCode == 200) {
        //alert(response.message);
        $state.go('list');
      } else if(response.data.statusCode == 500){
        //alert(response.message);
      }
    });

  };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('ListCtrl', ['$scope', 'JobService',function($scope, JobService){
    JobService.GetJobs().then(function(result){
    $scope.jobs = result;  
    
  });
  

}])

.controller('JobDetailCtrl', ['$stateParams', '$scope', '$log', '$timeout', 'JobService', 'uiGmapGoogleMapApi',function($stateParams, $scope, $log, $timeout, JobService, uiGmapGoogleMapApi){
var jobId = $stateParams.id;
  $scope.job = JobService.GetJob(jobId);
  var latitude = parseFloat($scope.job.latitude);
  var longitude = parseFloat($scope.job.longitude);

 // 
    $scope.map = {center: {latitude: latitude, longitude: longitude }, zoom: 16 };    
    $scope.marker = {
      id: 0,
      coords: {
        latitude: latitude,
        longitude: longitude
      }
    };
}])


.controller('PastJobsShovelerCtrl', ['$scope', 'JobService',function($scope, JobService){
  $scope.jobs = JobService.GetJobs();

}])

.controller('PostJobCtrl', ['$scope', 'Camera','cordovaGeolocationModule',function($scope, Camera, cordovaGeolocationModule){

  $scope.job = {};
  $scope.job['latitude'] = 40;
  $scope.job['longitude'] = 40;

  
  $scope.getPhoto = function() {


    Camera.getPicture().then(function(imageURI) {
      console.log(imageURI);
    }, function(err) {
      console.err(err);
    });

  };

  $scope.postJob = function(){
    $http.post('http://45.55.102.116/api/jobs', $scope.job)
    .then(function(response){
      
        alert("post success!");        
      if(response.data.statusCode == 200) {      
      
      } else if(response.data.statusCode == 500){

      }                    
    });    

};

}]);
