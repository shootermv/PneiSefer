'use strict';

/* jasmine specs for services go here */


describe('services', function() {
    var svc, httpBackend, serverUrl='http://localhost:3000';
	
	beforeEach(module('Trempi'));
    describe('Auth service', function() {
		var authSvc,
        scope,
		httpBackend,
		store;
		//localStorage mock
		beforeEach(function () {
		  store = {};
		  spyOn(localStorage, 'getItem').andCallFake(function (key) {		   
			return  store[key];
		  });
		  spyOn(localStorage, 'setItem').andCallFake(function (key, value) {
			return store[key] = value + '';
		  });
		  spyOn(localStorage, 'clear').andCallFake(function () {
			  store = {};
		  });
		});	
		
		beforeEach(inject(function($injector, Auth, $httpBackend) {
		    httpBackend = $httpBackend;		
		    authSvc = Auth;
		}));		
		afterEach(function() {
			httpBackend.verifyNoOutstandingExpectation();
			httpBackend.verifyNoOutstandingRequest();
		});	
		
	    it('should bring some user in currentUser variable', function() {
			//expect(authSvc.user).toEqual({});
			expect(authSvc.user).toBeDefined();
		});
		it('should bring {} in currentUser variable if nothing stored inside localStore', function() {                       	
			expect(authSvc.user).toEqual({});
		});
		
    });
    describe('Auth service when some detail already inside localstorage', function() {
		var authSvc,
        scope,
		httpBackend,
		store;
		    //localStorage mock
		beforeEach(function () {
		  store = {user:JSON.stringify({"name":"מלכה סלע"})};
		  spyOn(localStorage, 'getItem').andCallFake(function (key) {		   
			return  store[key];
		  });
		});	
		
		beforeEach(inject(function($injector, Auth, $httpBackend) {
		    httpBackend = $httpBackend;		
		    authSvc = Auth;
		}));

		
		it('should bring User Object in currentUser variable if some user stored inside localStore', function() {	
			expect(authSvc.user).toEqual({name:'מלכה סלע'});
		});	
		
	});	
    describe('Auth service login should replace user with new one', function() {
		var authSvc,
        scope,
		httpBackend,
		store;
		    //localStorage mock
		beforeEach(function () {
		  store = {};
		  spyOn(localStorage, 'getItem').andCallFake(function (key) {		   
			return  store[key];
		  });

		});	
		
		beforeEach(inject(function($injector, Auth, $httpBackend) {
		    httpBackend = $httpBackend;		
			httpBackend.expectPOST(serverUrl+'/login',{username:'shlomo'}).respond(200, {id:12345,name:'שלמה גרזון'});
		    authSvc = Auth;
		}));
		
		it('should bring User Object in currentUser variable if some user stored inside localStore', function() {
            authSvc.login({name:'shlomo'},function(){});
			httpBackend.flush();
			expect(authSvc.user).toEqual({id:12345, name:'שלמה גרזון'});
		});	
		
		it('should bring User Object in currentUser variable if some user stored inside localStore', function() {
            authSvc.updateUserType({name:'שלמה גרזון', type:'driver'}) 		
			expect(authSvc.user).toEqual({name:'שלמה גרזון', type:'driver'});
		});	
        it('should be able to update user details', function() {
            expect(authSvc.updateUserDetails).toBeDefined();
			authSvc.updateUserDetails({name:'שלמה גרזון', userType:'driver', from:'פני קדם'})
			expect(authSvc.user).toEqual({name:'שלמה גרזון', userType:'driver', from:'פני קדם'});
		});	
		
	});
    describe('Tremps service ', function() {
		var trempsSvc,
        scope,
		httpBackend;
		
		beforeEach(inject(function($injector, Tremps, $httpBackend) {
		    httpBackend = $httpBackend;	
			httpBackend.expectGET(serverUrl+'/tremps/driver').respond(200, []);
		    trempsSvc = Tremps;
		}));
		
        it('should be able to update user details', function() {
            expect(trempsSvc.getTremps).toBeDefined();
			var data='';
			trempsSvc.getTremps({name:'shlomo', type:'driver'}, function(_data){data=_data;})
            httpBackend.flush();
			expect(data).toEqual([]);
		});
	});	
	/*
    describe('Gcm service ', function() {
		var gcmSvc,
        scope,
		httpBackend;
		
		beforeEach(inject(function($injector, Gcm, $httpBackend) {
		    httpBackend = $httpBackend;	
			//httpBackend.expectGET('/tremps').respond(200, []);
		    gcmSvc = Gcm;
		}));	
	});
	*/
});