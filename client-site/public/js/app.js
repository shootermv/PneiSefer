angular.module("Trempi",['ngRoute', 'ngResource', 'ui.bootstrap'])
.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.	  
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).
      when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'registerCtrl'
      }).	  
	  when('/whoami', {
        templateUrl: 'partials/whoami.html',
        controller: 'WhoAmICtrl'
      }).	  
      when('/form', {
        templateUrl: 'partials/form.html',
        controller: 'FormCtrl'
      }).
      when('/list', {
        templateUrl: 'partials/list.html',
        controller: 'ListCtrl'
      }).	  
      otherwise({
        redirectTo: '/login'
      });
 }])
 .run([ function () { 	    
	   /* new FastClick(document.body);*/
 }])	
.constant('serverUrl','http://localhost:3000')// 'http://trempi.herokuapp.com')	
.constant('realDevice',false)// true)