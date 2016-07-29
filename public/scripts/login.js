
var myApp = angular.module('myApp', []);

myApp.controller('loginController', ['$scope', '$http', '$window', function( $scope , $http, $window){

  $scope.register = function(){
    var regObject = {
      email: $scope.email,
      password: $scope.password
    };

    $http({
      method: 'POST',
      url: '/register',
      data: regObject
    });
  };

  $scope.login = function (){
    var loginObject = {
    username: $scope.email,
    password: $scope.password
  };
  console.log(loginObject);

  $http({
    method: "POST",
    url: '/loginRoute',
    data: loginObject
  }).error(function(err){
      console.log(err);
        $window.location.href = 'views/failure.html';
    })
    .then(function(data){
      console.log("In then with data", data);
      $window.location.href = './views/submit.html';
    });
  };

}]);
