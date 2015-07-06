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
    
app.controller('mainController', function($scope,$stateParams,$state, $rootScope) {
   $scope.init = function () {
       /*
       $.ajax({
         type: 'GET', url: '/init', contentType: 'application/json', dataType: 'json'
       })
       .error(function() {
         $('.alert').show();
       })
       .success(function(params){
         $scope.sessionID = params.sessionID;
         $scope.numProps = params.numProps;
       }); */
       $scope.sessionID = 1;
       $scope.numProps = 5;
       $scope.propositionID = '/app/images/prop' + Math.ceil(Math.random() * $scope.numProps) + '.jpg';
       $scope.propsShown = [$scope.propositionID];
   }
   $scope.init();

	$scope.propositionClicked = function(choice){
		$rootScope.style = styles[choice];
		console.log("for proposition: "+$scope.propositionID + ", user selected: " +choice);
        // ajax call to server to post
        /*var propData = {sessionID: $scope.sessionID, proposition: $scope.propositionID, choice: choice};
        
        $.ajax({
          type: 'POST', url: '/new_proposition', data: propData
        })
        .error(function() {
          $('.alert').show();
        });
        */
        $scope.propositionID = '/app/images/prop' + Math.ceil(Math.random() * $scope.numProps) + '.jpg';
        /*while ( ($.inArray($scope.propositionID, $scope.propsShown ) >= 0) && ($scope.propsShown.length < $scope.numProps ) {
            $scope.propositionID = '/app/images/prop' + Math.ceil(Math.random() * $scope.numProps) + '.jpg';
        }
        if ($scope.propsShown.length < $scope.numProps) {
          $scope.propsShown.push($scope.propositionID);
        }*/
        // if propsShown.length % 5 == 0, get prediction from server and show
	}
	
	//stuff for swiping using angular's ng-touch
	$scope.direction = 'left';
	$scope.currentIndex = 0;

	$scope.setCurrentSlideIndex = function (index) {
		$scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
		$scope.currentIndex = index;
	};

	$scope.isCurrentSlideIndex = function (index) {
		return $scope.currentIndex === index;
	};

	$scope.prevSlide = function () {
		$scope.direction = 'left';
		$scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
	};

	$scope.nextSlide = function () {
		$scope.direction = 'right';
		$scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
	};
	
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

  var styles = {
    // appear from right
    0: '.enter-setup {   position:absolute;   -webkit-transition: 0.5s ease-out all;   -webkit-transform:translate3d(100%,0,0)  }  .enter-setup.enter-start {   position:absolute;  -webkit-transform:translate3d(0,0,0)}  .leave-setup {   position:absolute;   -webkit-transition: 0.5s ease-out all;   -webkit-transform:translate3d(0,0,0)} .leave-setup.leave-start {   position:absolute;  -webkit-transform:translate3d(-100%,0,0) };',
    // appear from left
    1: '.enter-setup {   position:absolute;   -webkit-transition: 0.5s ease-out all; -webkit-transform:translate3d(-100%,0,0)}  .enter-setup.enter-start {   position:absolute;   -webkit-transform:translate3d(0,0,0) }  .leave-setup {   position:absolute;   -webkit-transition: 0.5s ease-out all;  -webkit-transform:translate3d(0,0,0)} .leave-setup.leave-start {   position:absolute;  -webkit-transform:translate3d(100%,0,0) };'
  };
  $rootScope.style=styles[0];
});
    
app.controller('submitController', function($scope, $stateParams,$state) {
	
	$scope.masterSubmitForm = {};

      $scope.sendSubmitForm = function(submitFormData) {
        $scope.masterSubmitForm = angular.copy(submitFormData);
		  console.log("submitted form")
      };

      $scope.resetSubmitForm = function() {
        $scope.submitFormData = {};
      };

      $scope.resetSubmitForm();

});


app.controller('BodyController', function($scope, $stateParams,$state) {
	$scope.$parent.keyPressed = function(event){
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

app.animation('.slide-animation', function () {
	return {
		addClass: function (element, className, done) {
			var scope = element.scope();

			if (className == 'ng-hide') {
				var finishPoint = element.parent().width();
				if(scope.direction !== 'right') {
					finishPoint = -finishPoint;
				}
				TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
			}
			else {
				done();
			}
		},
		removeClass: function (element, className, done) {
			var scope = element.scope();

			if (className == 'ng-hide') {
				element.removeClass('ng-hide');

				var startPoint = element.parent().width();
				if(scope.direction === 'right') {
					startPoint = -startPoint;
				}

				TweenMax.set(element, { left: startPoint });
				TweenMax.to(element, 0.5, {left: 0, onComplete: done });
			}
			else {
				done();
			}
		}
	};
});	
		
 })(); 
//reason why the whole thing is wrapped in parenthesis for javascript to work
//http://stackoverflow.com/questions/9053842/advanced-javascript-why-is-this-function-wrapped-in-parentheses