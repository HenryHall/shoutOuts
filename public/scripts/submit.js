var myApp = angular.module('myApp', []);

myApp.controller('submitController', ['$scope', '$http' function($scope, $http){

  //Dummy data
  var username = {
    username: "henry"
  };

  $http({
    method: 'GET',
    url: '/getData',
    data: username
  }).then(function(data){
    data = data.data;
    console.log(data);

  });

  //View selection
  $scope.tabs = [
    {url: './partials/form.html'},
    {url: './partials/thanks.html'}
  ];

  //Initialize with this partial
  $scope.activeTab = $scope.tabs[0];

  $scope.viewControl = function(tab){
    console.log('In tab change');

    $scope.activeTab = $scope.tabs[tab];

  };

}]);
