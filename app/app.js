(function ( ) {
	"use strict";
  /*
tutorial followed: https://scotch.io/tutorials/how-to-correctly-use-bootstrapjs-and-angularjs-together
code pen example: http://codepen.io/sevilayha/pen/ExKGs
  */
 
var app = angular.module('app', ['ui.bootstrap', 'ui.router','ngAnimate', 'ngTouch']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
		// HOME STATES AND NESTED VIEWS ========================================
		.state('home', {
			url: '/',
			templateUrl: 'partial-home.html',
			controller: 'BodyController'
		})
	
    .state('proposition', {
      url: '/proposition/:propID_urlParam',
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
    //upon arriving at a new url
    $scope.propositionPath = '/images/prop' + $stateParams.propID_urlParam + '.jpg';
    console.log('propositions shown: '+$scope.propsShown.length)
    // Define click function
    $scope.propositionClicked = function(choice){
        // ajax call to server to post
        var propData = {sessionID: $scope.sessionID, proposition: $scope.propositionPath, choice: choice};
        $http.post('/new_choice', propData).
         error(function(msg) {
             alert(msg);
         });       
        // get prediction every n choices
        if ($scope.propsShown.length % 5 == 0 && $scope.propsShown.length>0) {
          $http.post('/prediction',{sessionID: $scope.sessionID}).
            success(function(msg) {
              alert(msg);
            }).
            error(function(msg) {
              alert(msg);
            });
        }

        //Mark prop as shown. only mark the prop as shown after user has made a selection (otherwise user might go to about page and come back and it has used up a prop)
        if ($scope.propsShown.length < $scope.numProps) {
            $scope.propsShown.push($scope.propositionPath);
        } else{
          console.log('showed all propositions');
        }
        
        //come up with new propID for user then send off to new page
        //Get new prop id and ensure it hasn't already been shown
        var newPropID=Math.ceil(Math.random() * $scope.numProps);
        while ( ($.inArray('/images/prop' + newPropID + '.jpg', $scope.propsShown ) >= 0) && ($scope.propsShown.length < $scope.numProps ) ) {
            newPropID=Math.ceil(Math.random() * $scope.numProps);
        }

        $state.go('proposition',{'propID_urlParam':newPropID});
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
            $scope.resetSubmitForm();
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

app.controller('BodyController', function($http, $scope, $stateParams,$state) {
    // Initialize App Variables
    //updated on 7/19/2015 - moved these to the SessionCommonDataService
    //mainController is re-run every time the url/state is entered (so if user goes to check out about page and comes back, a new session starts)
    //Way to fix this would be to have a global sort of scope either through parent-child scope (which was what this, or with services, which was not used)
    //https://rclayton.silvrback.com/parent-child-controller-communication
    //http://crudbetter.com/angular-share-data-between-controllers/
    $scope.sessionID = 0;
    $scope.numProps = 0;
    $scope.propositionPath = '';
    $scope.propsShown = [];
    
    // Define Init Function
    $scope.init = function () {
       $http.get('/init').
         success(function(params) {
             $scope.sessionID = params.sessionID;
             $scope.numProps = params.numProps;
             var newPropID = Math.ceil(Math.random() * $scope.numProps);
             //huge PITA lesson learned, format of state.go param useage requires object, https://github.com/angular-ui/ui-router/issues/928
             $state.go('proposition',{'propID_urlParam':newPropID});
         }).
         error(function(data) {
             alert(data);
         });

    }
    $scope.init();

  //This listens for button presses (arrow keys throughout the whole app, attached to the body)
  //If it wasn't attached to the body, user would have to had specifically clicked on a div for it to be able to pick up arrow presses
	//It doesn't have to be fully defined though
  $scope.keyPressed = function(event){

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