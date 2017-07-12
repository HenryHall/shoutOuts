
var myApp = angular.module('myApp', []);

myApp.config([function(){


}]);

myApp.controller('mainController', ['$scope', '$http', function( $scope, $http){


  //Calculate div width
  var rightHeader = document.getElementById('rightHeader');
  var leftHeader =  document.getElementById('leftHeader');
  var widthPercent = leftHeader.getBoundingClientRect().width / window.innerWidth;
  console.log(widthPercent);
  rightHeader.style.width = (1 - widthPercent - 0.11) * 100 + '%';
  console.log(1 - (parseFloat(rightHeader.style.width) / 100));

  rightHeader.style.height = leftHeader.getBoundingClientRect().height + 'px';
  leftHeader.style.width = (widthPercent + 0.1) * 100 + '%';
  console.log(leftHeader.style.width);

  $scope.currentQuestionIndex = -1;
  $scope.score = 0;


  //Get game data
  $http({
    method: 'GET',
    url: '/getData'
  }).then(function(data){
    console.log(data.data);

    $scope.user = data.data.user;

    $scope.currentTemplate = '../views/partials/landing.html'

    $scope.username = $scope.user.username;
    $scope.classList = data.data.classList;
    $scope.questions = data.data.questions;

  }, function(err){
    console.log(err);
  });


  //Display based on if $scope.username is defined, the laziest possible way I could have done this.  Display still shutters
  $scope.greeting = function(){
    if ($scope.username){
      return $scope.username;
    } else {
      return "You need a token to access this content.  Contact Henry with any problems."
    }
  };


  $scope.next = function(){

    $scope.currentQuestionIndex += 1;
    console.log("Going to question,", $scope.currentQuestionIndex + 1);
    // if ($scope.currentQuestionIndex == $scope.questions.length){
    if ($scope.currentQuestionIndex == 2){
      //Update completed status
      $http({
        method: 'PUT',
        url: '/complete'
      });
      //Done with questions
      $scope.currentTemplate = '../views/partials/memory.html';
    } else if ($scope.questions[$scope.currentQuestionIndex].imglink == null || $scope.questions[$scope.currentQuestionIndex].imglink == undefined){
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
      data: {questionId: $scope.questions[$scope.currentQuestionIndex].id, answer: $scope.chosenAnswer}
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
      method: 'POST',
      url: '/submit/memory',
      data: {memory: $scope.memoryIn}
    }).then(function(data){
      console.log(data.data);
      $scope.completed = true;
      $scope.memoryIn = '';
    });

  };


  $scope.submitTrivia = function(){

    $http({
      method: 'POST',
      url: '/submit/trivia',
      data: {question: $scope.triviaIn, classmate: angular.fromJson($scope.triviaAnswer)}
    }).then(function(data){
      console.log(data.data);
      $scope.completed = true;
      $scope.memoryIn = '';
    });

  };


  $scope.memoryStatus = function(){
    if ($scope.completed == true){
      return 'Add Another';
    } else {
      return 'Submit';
    }
  };


}]);

myApp.directive('myHeader', function(){
  return {
    restrict: 'E',
    // templateURL: '../views/partials/myHeader.html',
    replace: true,
    template: '<div id="headerContainer"><span id="leftHeader"><img id="prime" src="../assets/images/prime.png" alt=""><h2 id="greeting">{{greeting()}}</h2></span><span id="rightHeader"><div id="headerRightTop"></div><div id="headerRightBottom"></div></span></div>',
    link: function(scope, element, attr){

      //Calculate div width
      var rightHeader = document.getElementById('rightHeader');
      var leftHeader =  document.getElementById('leftHeader');
      angular.element(leftHeader).ready(function(){
        var widthPercent = leftHeader.getBoundingClientRect().width / window.innerWidth;
        console.log(widthPercent);
        rightHeader.style.width = (1 - widthPercent - 0.05) * 100 + '%';
        console.log(1 - (parseFloat(rightHeader.style.width) / 100));

        rightHeader.style.height = leftHeader.getBoundingClientRect().height + 'px';
        leftHeader.style.width = (widthPercent + 0.05) * 100 + '%';
        console.log(leftHeader.style.width);
      });




    }
  }
})
