(function ( ) {
	"use strict";
  /*
tutorial followed: https://scotch.io/tutorials/how-to-correctly-use-bootstrapjs-and-angularjs-together
code pen example: http://codepen.io/sevilayha/pen/ExKGs
  */
 
var app = angular.module('app', ['ui.bootstrap', 'ui.router']);

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
    
app.controller('mainController', function($scope,$stateParams,$state) {
    // Initialize App Variables
    $scope.sessionID = 0;
    $scope.numProps = 0;
    $scope.propositionID = '/images/prop2.jpg';
    $scope.propsShown = [];

    // Define Init Function
    $scope.init = function ($scope) {

       $.ajax({
         type: 'GET', 
         url: '/init', 
         dataType: 'json',
         context: $scope
       })
       .error(function() {
         $('.alert').show();
       })
       .success(function(params){
         this.sessionID = params.sessionID;
         this.numProps = params.numProps;
         this.propositionID = '/images/prop' + Math.ceil(Math.random() * this.numProps) + '.jpg';
         this.propsShown = [this.propositionID];
         $state.go('home');
       });

    }
    $scope.init($scope);
    
    // Define click function
    $scope.propositionClicked = function(choice){

        // ajax call to server to post 
        var propData = {sessionID: $scope.sessionID, proposition: $scope.propositionID, choice: choice};
        $.ajax({
          type: 'POST', 
          url: '/new_choice', 
          data: JSON.stringify(propData),
          contentType: 'application/json'
        })
        .error(function() {
          $('.alert').show();
        });

        // get prediction every n choices
        if ($scope.propsShown.length % 5 == 0) {
          $.ajax({
              type: 'POST', 
              url: '/prediction', 
              data: JSON.stringify({sessionID: $scope.sessionID}),
              contentType: 'application/json'            
          })
          .error(function() {
            $('alert').show();
          })
          .success(function(msg) {
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
});
 
app.controller('submitController', function($scope, $stateParams,$state) {
    // Define submit form function
    $scope.sendSubmitForm = function(submitFormData) {
        $.ajax({
          type: 'POST', 
          url: '/new_proposition', 
          data: JSON.stringify(submitFormData),
          contentType: 'application/json',
          context: $scope
        })
        .error(function() {
          $('.alert').show();
        })
        .success(function(){
          alert('Submission successful!');
        });
    };

    // Definei reset form function
    $scope.resetSubmitForm = function() {
      $scope.submitFormData = {};
    };

    $scope.resetSubmitForm();
	    
});
    
})(); 

// Hide intro div
$(document).ready(function(){
  $('.intro-text').on('click', function() {
    $(this).hide();
  });
});

//  NOTES  //

//reason why the whole thing is wrapped in parenthesis for javascript to work
//http://stackoverflow.com/questions/9053842/advanced-javascript-why-is-this-function-wrapped-in-parentheses



// in swipe.js, end goal:
// on user click track when swipe occurs with swipe.js code, 
// use toggleSlide out at same time toggleSlide in with newly created div (or hammerjs)
// delete old div after slide out