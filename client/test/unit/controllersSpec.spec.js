'use strict';

/* jasmine specs for controllers go here */


describe('Controllers', function() {	
	beforeEach(module('Trempi'));
	
	
	
    describe('LoginCtrl nothing strored in storage', function() {		  		
		var  $rootScope, $scope, $location, Auth, $controller;
		
		beforeEach(inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();						
			$location = jasmine.createSpyObj('$location',['path']);	
			

			//mockin the Auth
			Auth = {
				user: {},				
                login:function(user, success){
					success();
				}				
			};	
			
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
			
			Auth = {
				user: {name:'מלכה סלע'},				
                login:function(user, success){
					success();
				}
			};
			
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
		//test successfull login
	});
	

	
    describe('WhoAmICtrl', function() {
	    var $rootScope, $scope, $location, Auth, $controller;
		beforeEach(inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();						
			$location = jasmine.createSpyObj('$location',['path']);	
			Auth = {
				user: {name:'מלכה סלע'},				
                updateUserType:function(){					
				}
			};
			
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
            expect($scope.user.userType).toEqual('driver')		
		})
		//angular upadte user to be called
	
	});
    describe('FormCtrl	', function() {
	    var $rootScope, $scope, $location, Auth, $controller;
		beforeEach(inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();						
			$location = jasmine.createSpyObj('$location',['path']);	
			Auth = {
				user: {name:'מלכה סלע'},				
                updateUserDetails:function(){					
				}
			};
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
		//angular upadte user to be called	
	});
	
	
	
	describe('ListCtrl	', function() {
		var $rootScope, $scope, $location, Auth, Tremps, $controller;
		beforeEach(inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();	
			$location = jasmine.createSpyObj('$location',['path']);	
			Auth = {
				user: {name:'מלכה סלע'},				

			};
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
	    it('ListCtrl - scope.user must be defined',function(){	 
			expect($scope.user).toBeDefined();
			expect(angular.isFunction(Tremps.getTremps)).toEqual(true);
		})	
	})
	
	
});