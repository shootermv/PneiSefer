'use strict';

/* jasmine specs for controllers go here */


describe('Controllers', function() {	
	beforeEach(module('Trempi'));
	
	var serverUrl='http://localhost:3000';
	
    describe('LoginCtrl nothing strored in storage', function() {		  		
		var  $rootScope, $scope, $location, Auth, $controller;
		
		beforeEach(inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();						
			$location = jasmine.createSpyObj('$location',['path']);	
			var store = [];
			//store['user'] = '{\"name\":\"shlomo\"}';
            spyOn(localStorage, 'getItem').andCallFake(function (key) {
				return store[key];
			});				
			
            Auth = $injector.get('Auth');			
			

			//mockin the Auth
	
			
            //init the controller:
		    $controller = $injector.get('$controller');	
			$controller('LoginCtrl',{  				
				'$scope':$scope,
				'$location':$location,
				'Auth':Auth				
			});		
		})); 
							
		it('user should be empty',function(){	
            expect($scope.user).toEqual({});					
		});
		
	})
	
    describe('LoginCtrl - if something already inside storage', function() {			  		
		var $rootScope, $scope, $location, Auth, $controller;
		
		beforeEach(inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();						
			$location = jasmine.createSpyObj('$location',['path']);
			var store = [];
			store['user'] = '{\"name\":\"shlomo\"}';
            spyOn(localStorage, 'getItem').andCallFake(function (key) {
				return store[key];
			});			
			Auth = $injector.get('Auth');

            //init the controller:
		    $controller = $injector.get('$controller');	
			$controller('LoginCtrl',{  				
				'$scope':$scope,
				'$location':$location,
				'Auth':Auth				
			});		
		})); 
		
			
		it('should redirect to /list if user is stored in storage',function(){	           
			expect($location.path).toHaveBeenCalledWith('list');
		});
		
	});
	

	
    describe('WhoAmICtrl', function() {
	    var $rootScope, $scope, $location, Auth, $controller;
		beforeEach(inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();						
			$location = jasmine.createSpyObj('$location',['path']);	
			var store = [];
			store['user'] = '{\"name\":\"shlomo\"}';
            spyOn(localStorage, 'getItem').andCallFake(function (key) {
				return store[key];
			});				
			Auth = $injector.get('Auth');
			
            //init the controller:
		    $controller = $injector.get('$controller');	
			$controller('WhoAmICtrl',{  				
				'$scope':$scope,
				'$location':$location,
				'Auth':Auth				
			});
		})); 
        	
	    it('WhoAmICtrl - scope.user must be defined',function(){	 
			expect($scope.user).toBeDefined();
            expect($scope.user.type).toEqual('driver')		
		})			
	
	});
	//if user not defined the controller should redirect to login page
    describe('WhoAmICtrl', function() {
	    var $rootScope, $scope, $location, Auth, $controller;
		beforeEach(inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();						
			$location = jasmine.createSpyObj('$location',['path']);	
			var store = [];
			//store['user'] = '{\"name\":\"shlomo\"}';
            spyOn(localStorage, 'getItem').andCallFake(function (key) {
				return store[key];
			});				
			Auth = $injector.get('Auth');
			
            //init the controller:
		    $controller = $injector.get('$controller');	
			$controller('WhoAmICtrl',{  				
				'$scope':$scope,
				'$location':$location,
				'Auth':Auth				
			});
		})); 
        	
		it('should redirect to /login if user not authenticated',function(){	           
			expect($location.path).toHaveBeenCalledWith('login');
		});		
	
	});
		
	
    describe('FormCtrl	', function() {
	    var $rootScope, $scope, $location, Auth, $controller;
		beforeEach(inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();	
            //for validation
            $scope.tremp_details={$invalid:false}
			$location = jasmine.createSpyObj('$location',['path']);	
			var store = [];
			store['user'] = '{\"name\":\"shlomo\"}';
            spyOn(localStorage, 'getItem').andCallFake(function (key) {
				return store[key];
			});				
			
            Auth = $injector.get('Auth');
			//spy
			spyOn(Auth, 'updateUserDetails').andCallThrough();
			
            //init the controller:
		    $controller = $injector.get('$controller');	
			$controller('FormCtrl',{  				
				'$scope':$scope,
				'$location':$location,
				'Auth':Auth				
			});
		})); 
        	
	    it('FormCtrl - scope.user must be defined',function(){	 
			expect($scope.user).toBeDefined();
            $scope.goToListPage();
            expect(Auth.updateUserDetails).toHaveBeenCalled() 			
		})
		
	});
	
	
	
	describe('ListCtrl	', function() {
		var $rootScope, $scope, $location, Auth, Tremps, $controller, $httpBackend;
		beforeEach(inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();	
			$location = jasmine.createSpyObj('$location',['path']);	
			var store = [];
			store['user'] = '{\"name\":\"shlomo\"}';
            spyOn(localStorage, 'getItem').andCallFake(function (key) {
				return store[key];
			});				
			$httpBackend = $injector.get('$httpBackend');
			$httpBackend.expectPOST(serverUrl+'/registerDevice', {regid:'12345'}).respond(200);
            Auth = $injector.get('Auth');
			Tremps = {
			   getTremps:function(){}
			}
			$controller = $injector.get('$controller');	
			$controller('ListCtrl',{  				
				'$scope':$scope,
				'$location':$location,
				'Auth':Auth,
				'Tremps':Tremps
			});
		})); 
 		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});       		
	    it('ListCtrl - scope.user must be defined',function(){ 
			expect($scope.user).toBeDefined();
			expect(angular.isFunction(Tremps.getTremps)).toEqual(true);
			$httpBackend.flush();
			
		})	
		
	})
	
	
	
	
});