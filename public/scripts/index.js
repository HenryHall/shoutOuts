
var myApp = angular.module('myApp', []);

myApp.config([function(){


}]);

myApp.controller('mainController', ['$scope', '$http', function( $scope, $http){

  $scope.currentQuestionIndex = -1;
  $scope.score = 0;

  //Parse url
  $scope.token = getQueryString('token');
  console.log("Your token:", $scope.token);

  //Send token, get data
  $http({
    method: 'POST',
    url: '/getData',
    data: {token: $scope.token}
  }).then(function(data){
    console.log(data);
    if (data.data.completed == true){
      //Load memory.html
      $scope.completed = true;
      $scope.score = data.data.score;
      $scope.currentTemplate = '../views/partials/memory.html';
    } else {
      $scope.currentTemplate = '../views/partials/landing.html'
    }

    $scope.username = data.data.username;
    $scope.classList = data.data.classList;
    $scope.results = data.data.results;

  }, function(err){
    console.log(err);
  });


  //Display based on if $scope.username is defined, the laziest possible way I could have done this.  Display still shutters
  $scope.greeting = function(){
    if ($scope.username){
      return "Welcome, " + $scope.username;
    } else {
      return "You need a token to access this content.  Contact Henry with any problems."
    }
  };


  $scope.next = function(){

    $scope.currentQuestionIndex += 1;
    console.log("Going to question,", $scope.currentQuestionIndex + 1);
    if ($scope.currentQuestionIndex == $scope.results.length){
    // if ($scope.currentQuestionIndex == 2){
      //Update completed status
      $http({
        method: 'PUT',
        url: '/complete',
        data: {token: $scope.token}
      });
      //Done with questions
      $scope.currentTemplate = '../views/partials/memory.html';
    } else if ($scope.results[$scope.currentQuestionIndex].imglink == null || $scope.results[$scope.currentQuestionIndex].imglink == undefined){
      $scope.currentTemplate = '../views/partials/question.html';
    } else {
      $scope.currentTemplate = '../views/partials/questionWithImg.html';
    }
  };

}])

.controller('questionController', ['$scope', '$http', function($scope, $http){

  $scope.submitAnswer = function(){
    //Submit the answer, return the score
    $http({
      method: 'PUT',
      url: '/submitAnswer',
      data: {questionId: $scope.results[$scope.currentQuestionIndex].id, answer: $scope.chosenAnswer, token: $scope.token}
    }).then(function(data){
      if (data.data.outcome == true){
        $scope.score += 1;
      }
      console.log(data.data.outcome);
    });

    //Go to next question
    $scope.chosenAnswer.hidden = true;
    $scope.chosenAnswer = '';
    $scope.next();
  };

}])

.controller('memoryController', ['$scope', '$http', function($scope, $http){

  $scope.submitMemory = function(){

    $http({
      method: 'PUT',
      url: '/submitMemory',
      data: {token: $scope.token, memory: $scope.memoryIn}
    }).then(function(data){
      console.log(data.data);
      $scope.completed = true;
      $scope.memoryIn = '';
    });

  };


  $scope.memoryStatus = function(){
    if ($scope.completed == true){
      return 'Update';
    } else {
      return 'Submit';
    }
  };


}]);


function getQueryString( field, url ) {
  var href = url ? url : window.location.href;
  var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
  var string = reg.exec(href);
  return string ? string[1] : null;
};
