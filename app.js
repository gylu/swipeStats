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
		// nested list with custom controller
		.state('session', {
			url: "/proposition/{propositionID}", 
			templateUrl: 'partial-home.html',
			controller: 'mainController'
		})

	
		.state('submit', {
			url: '/submit',
			templateUrl: 'partial-submit.html',
			controller: 'mainController'
		})

	    .state('about', {
        	url: '/about',
			templateUrl: 'partial-about.html'
    });

        
});

app.controller('mainController', function($scope, $stateParams,$state) {
  
	// BUTTONS ======================
  
	// define some random object
	$scope.bigData = {};
  
	$scope.bigData.breakfast = false;
	$scope.bigData.lunch = false;
	$scope.bigData.dinner = false;
  
	// COLLAPSE =====================
	$scope.isCollapsed = false;
  
	
    $scope.message = 'test';
   
    $scope.scotches = [
        {
            name: 'Macallan 12',
            price: 50
        },
        {
            name: 'Chivas Regal Royal Salute',
            price: 10000
        },
        {
            name: 'Glenfiddich 1937',
            price: 20000
        }
    ];


	$scope.masterSubmitForm = {};

      $scope.sendSubmitForm = function(submitFormData) {
        $scope.masterSubmitForm = angular.copy(submitFormData);
		  console.log("submitted form")
      };

      $scope.resetSubmitForm = function() {
        $scope.submitFormData = {};
      };

      $scope.resetSubmitForm();

	$scope.propositionID=$stateParams.propositionID;
	$scope.proposition=[
		{
		id:0,
		url:"http://36.media.tumblr.com/b0ec176c76284cb905742f114ceedf01/tumblr_npsjk6aU751urogowo1_r1_1280.jpg"
		},
		{
		id:1,
		url:"http://41.media.tumblr.com/98c381d0fc8d09b79a5cef8cf1443d0a/tumblr_npo9rmGEbN1urogowo1_1280.jpg"
		},
		{
		id:2,
		url:"http://41.media.tumblr.com/5b0eba345fab6bb1c06813a9a2b1911f/tumblr_npewusvbnB1urogowo1_r1_1280.jpg"
		},
		{
		id:3,
		url:"http://41.media.tumblr.com/51c511ecebe3766e1d4614a0afa0ec8b/tumblr_npbe52tHGa1urogowo1_r1_1280.jpg"
		},
		{
		id:4,
		url:"http://40.media.tumblr.com/9de859ab20b97790b0d3ce4725532315/tumblr_np21lurXqd1urogowo1_r1_1280.jpg"
		},					   
	]
	
	$scope.propositionClicked = function(choice){
		console.log("propositionID:" + $scope.propositionID + ". Choice: " + choice)
		$state.go("session", {
		   propositionID: Math.ceil(Math.random() * 4)
		});
	}
});
	
	    
    
 })(); 
//reason why the whole thing is wrapped in parenthesis for javascript to work
//http://stackoverflow.com/questions/9053842/advanced-javascript-why-is-this-function-wrapped-in-parentheses