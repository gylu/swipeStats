(function ( ) {
	"use strict";
  /*
tutorial followed: https://scotch.io/tutorials/how-to-correctly-use-bootstrapjs-and-angularjs-together
code pen example: http://codepen.io/sevilayha/pen/ExKGs
  */
 
var app = angular.module('app', ['ui.bootstrap', 'ui.router','ngAnimate', 'ngTouch']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
		// HOME STATES AND NESTED VIEWS ========================================
		.state('home', {
			url: '/home',
			templateUrl: 'partial-home.html',
			controller: 'mainController'
		})
	
		.state('submit', {
			url: '/submit',
			templateUrl: 'partial-submit.html',
			controller: 'submitController'
		})

	    .state('about', {
        	url: '/about',
			templateUrl: 'partial-about.html'
    });

        
});

app.controller('introDivController', function($scope) {
    // Initialize hideIntro
    $scope.hideIntro = false;
});
    
app.controller('mainController', function($http, $scope,$stateParams,$state) {    
    // Initialize App Variables
    $scope.sessionID = 0;
    $scope.numProps = 0;
    $scope.propositionID = '';
    $scope.propsShown = [];

    // Define Init Function
    $scope.init = function () {
       $http.get('/init').
         success(function(params) {
             $scope.sessionID = params.sessionID;
             $scope.numProps = params.numProps;
             $scope.propositionID = '/images/prop' + Math.ceil(Math.random() * $scope.numProps) + '.jpg';
             $scope.propsShown = [$scope.propositionID];        
         }).
         error(function(data) {
             alert(data);
         });
    }
    $scope.init();
    
    // Define click function
    $scope.propositionClicked = function(choice){

        // ajax call to server to post 
        var propData = {sessionID: $scope.sessionID, proposition: $scope.propositionID, choice: choice};
        $http.post('/new_choice', propData).
         error(function(msg) {
             alert(msg);
         });       

        // get prediction every n choices
        if ($scope.propsShown.length % 5 == 0) {
          $http.post('/prediction',{sessionID: $scope.sessionID}).
            success(function(msg) {
              alert(msg);
            }).
            error(function(msg) {
              alert(msg);
            });
        }

        // Get new prop id and ensure it hasn't already been shown
        $scope.propositionID = '/images/prop' + Math.ceil(Math.random() * $scope.numProps) + '.jpg';
        while ( ($.inArray($scope.propositionID, $scope.propsShown ) >= 0) && ($scope.propsShown.length < $scope.numProps ) ) {
            $scope.propositionID = '/images/prop' + Math.ceil(Math.random() * $scope.numProps) + '.jpg';
        }
        if ($scope.propsShown.length < $scope.numProps) {
          $scope.propsShown.push($scope.propositionID);
        }
      }

    $scope.$parent.keyPressed = function(event){
      console.log(event.keyCode + " In child scope.");
      if (event.keyCode == 38)
          console.log("up arrow");
      else if (event.keyCode == 39){
          console.log("right arrow");
        $scope.propositionClicked(1);
      }
      else if (event.keyCode == 40)
        console.log("down arrow");
      else if (event.keyCode == 37){
          console.log("left arrow");
        $scope.propositionClicked(0);
      }
    }
});
 
app.controller('submitController', function($http,$scope,$stateParams,$state) {
    // Define submit form function
    $scope.sendSubmitForm = function(submitFormData) {
        $http.post('/new_proposition', submitFormData).
          success(function(){
            alert('Submission successful!');
          }).
          error(function(msg){
            alert(msg);
          });
    };

    // Definei reset form function
    $scope.resetSubmitForm = function() {
      $scope.submitFormData = {};
    };

    $scope.resetSubmitForm();
	    
});

//this controller listens for button presses (arrow keys throughout the whole app, attached to the body)
//if it wasn't attached to the body, user would have to had specifically clicked on a div for it to be able to pick up arrow presses
app.controller('BodyController', function($scope, $stateParams,$state) {
	$scope.keyPressed = function(event){
	    console.log(event.keyCode + " In parent scope");
	    if (event.keyCode == 38)
	        console.log("up arrow");
	    else if (event.keyCode == 39){
	        console.log("right arrow");
	    	$scope.propositionClicked(1);
	    }
	    else if (event.keyCode == 40)
	    	console.log("down arrow");
	    else if (event.keyCode == 37){
	        console.log("left arrow");
	    	$scope.propositionClicked(0);
    	}
    }
});
})(); 

//  NOTES  //

//reason why the whole thing is wrapped in parenthesis for javascript to work
//http://stackoverflow.com/questions/9053842/advanced-javascript-why-is-this-function-wrapped-in-parentheses



// in swipe.js, end goal:
// on user click track when swipe occurs with swipe.js code, 
// use toggleSlide out at same time toggleSlide in with newly created div (or hammerjs)
// delete old div after slide out