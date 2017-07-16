
var myApp = angular.module('myApp', []);

myApp.config([function(){


}]);

myApp.controller('mainController', ['$scope', '$http', function( $scope, $http){


  $scope.currentQuestionIndex = -1;
  $scope.score = 0;


  //Get game data
  $http({
    method: 'GET',
    url: '/getData'
  }).then(function(data){
    $scope.user = data.data.user;

    if ($scope.user.completed == true){
      $scope.currentTemplate = '../views/partials/complete.html';
    } else {
      $scope.currentTemplate = '../views/partials/landing.html'
    }

    $scope.username = $scope.user.username;
    $scope.classList = data.data.classList;
    $scope.questions = data.data.questions;
    $scope.score = $scope.user.score;

    //Resize header
    var rightHeader = document.getElementById('rightHeader');
    var leftHeader =  document.getElementById('leftHeader');

    angular.element(leftHeader).ready(function(){
      var widthPercent = (leftHeader.getBoundingClientRect().width + 15) / window.innerWidth;
      rightHeader.style.width = (1 - widthPercent - .01) * 100 + '%';

      rightHeader.style.height = leftHeader.getBoundingClientRect().height + 'px';
      leftHeader.style.width = (widthPercent) * 100 + '%';
    });


  }, function(err){
    console.log(err);
  });

  $scope.incrementScore = function(){
    $scope.score++;
  }


  //Display based on if $scope.username is defined, the laziest possible way I could have done this.  Display still stutters
  $scope.greeting = function(){
    if ($scope.username){
      return $scope.username;
    } else {
      return "You need a token to access this content.  Contact Henry with any problems."
    }
  };


  $scope.next = function(){

    $scope.currentQuestionIndex += 1;
    if ($scope.currentQuestionIndex == $scope.questions.length - 1){
      //Update completed status
      $http({
        method: 'PUT',
        url: '/complete/finished'
      });
      //Done with questions
      $scope.currentTemplate = '../views/partials/complete.html';
    } else {
      $scope.currentTemplate = '../views/partials/question.html';
    }
  };


  $scope.goToMemories = function(){
    $scope.currentTemplate = '../views/partials/memories.html';
  };


}])

.controller('questionController', ['$scope', '$http', function($scope, $http){

  $scope.submitAnswer = function(){
    //Submit the answer, return the score
    $http({
      method: 'PUT',
      url: '/submitAnswer',
      data: {questionId: $scope.questions[$scope.currentQuestionIndex].triviaid, answer: $scope.chosenAnswer}
    }).then(function(data){
      if (data.data.outcome == true){
        $scope.incrementScore();
      }
      console.log(data.data.outcome);
    });

    //Go to next question
    $scope.chosenAnswer.hidden = true;
    $scope.chosenAnswer = '';
    $scope.next();
  };

}])

.controller('completeController', ['$scope', '$http', function($scope, $http){

  $scope.playAgain = function(){
    $http({
      method: 'PUT',
      url: '/complete/playAgain'
    })
    .then(function(data){
      console.log("Going home!");
      location.reload();
    });
  };

}])


.controller('memoryController', ['$scope', '$http', function($scope, $http){
  $scope.classListIndex;
  $scope.memoryPartial = "../views/partials/memoryControl.html";

  //Grab all memories
  $http({
    method: 'GET',
    url: '/getMemories'
  }).then(function(data){
    var memories = data.data;
    $scope.classList.forEach(function(student){
      student.memories = [];
      memories.forEach(function(memory){
        if(student.id == memory.id){
          student.memories.push(memory.memory);
        }
      });
      //Set the imglink
      student.imglink = '../assets/images/Nu/' + student.name.replace(' ', '').toLowerCase() + '.jpg';
    });
    //Pick a random starting student
    $scope.classListIndex = Math.floor(Math.random() * ($scope.classList.length - 1));
    $scope.currentStudent = $scope.classList[$scope.classListIndex];
    //The url needs to be set this way to avoid conflict with server auth
    angular.element(document.getElementById('studentImg')).ready(function(){
      document.getElementById('studentImg').style['background-image'] = 'url(' + $scope.currentStudent.imglink + ')'
    });
  });


  $scope.prevClassmate = function(){
    $scope.setMemoryPartial("../views/partials/memoryControl.html");
    if ($scope.classListIndex - 1 < 0){
      $scope.classListIndex = $scope.classList.length - 1;
    } else {
      $scope.classListIndex--;
    }
    $scope.currentStudent = $scope.classList[$scope.classListIndex];
    //The url needs to be set this way to avoid conflict with server auth
    angular.element(document.getElementById('studentImg')).ready(function(){
      document.getElementById('studentImg').style['background-image'] = 'url(' + $scope.currentStudent.imglink + ')'
    });

  };


  $scope.nextClassmate = function(){
    // $scope.memoryPartial = "../views/partials/memoryControl.html";
    $scope.setMemoryPartial("../views/partials/memoryControl.html");
    if ($scope.classListIndex + 1 >= $scope.classList.length){
      $scope.classListIndex = 0;
    } else {
      $scope.classListIndex++;
    }
    $scope.currentStudent = $scope.classList[$scope.classListIndex];
    //The url needs to be set this way to avoid conflict with server auth
    angular.element(document.getElementById('studentImg')).ready(function(){
      document.getElementById('studentImg').style['background-image'] = 'url(' + $scope.currentStudent.imglink + ')'
    });
  };


  $scope.showSubmitPartial = function(){
    if ($scope.currentStudent.id == $scope.user.id){
      $scope.setMemoryPartial("../views/partials/submitMemory.html");
    } else {
      $scope.setMemoryPartial("../views/partials/submitTrivia.html");
    }
  };


  $scope.cancel = function(){
    $scope.setMemoryPartial("../views/partials/memoryControl.html");
  };

  $scope.setMemoryPartial = function(url){
    $scope.memoryPartial = url;
  }

}])


.controller('submitTriviaController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout){

  $scope.submitTrivia = function(){
    $http({
      method: 'POST',
      url: '/submit/trivia',
      data: {question: $scope.triviaIn, classmate: $scope.currentStudent}
    }).then(function(data){
      console.log(data.data);
      $scope.triviaIn = '';

      $scope.setMemoryPartial("../views/partials/thanks.html");
      $timeout(function(){$scope.setMemoryPartial("../views/partials/memoryControl.html");}, 3000);

    });
  };

}])


.controller('submitMemoryController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout){

  $scope.submitMemory = function(){
    $http({
      method: 'POST',
      url: '/submit/memory',
      data: {memory: $scope.memoryIn}
    }).then(function(data){
      console.log(data.data);

      //Add it to the classlist and update currentStudent
      $scope.classList.forEach(function(student){
        if (student.id == $scope.user.id){
          student.memories.push($scope.memoryIn);
        }
      });
      $scope.currentStudent = $scope.classList[$scope.classListIndex];

      $scope.memoryIn = '';

      $scope.setMemoryPartial("../views/partials/thanks.html");
      $timeout(function(){$scope.setMemoryPartial("../views/partials/memoryControl.html");}, 3000);

    });
  };

}]);


myApp.directive('myHeader', function(){
  return {
    restrict: 'E',
    // templateURL: '../views/partials/myHeader.html',
    replace: true,
    template: '<div id="headerContainer"><span id="leftHeader"><img id="prime" src="../assets/images/prime.png" alt=""><h2 id="greeting">{{greeting()}}</h2></span><span id="rightHeader"><div id="headerRightTop"></div><div id="headerRightBottom"></div></span></div>',
    link: function(scope, element, attr){

    }
  }
})
