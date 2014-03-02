'use strict';

/* jasmine specs for directives go here */


describe('directives', function() {
    var scope, elem;
	beforeEach(module('Trempi'));
	/*
	describe('status picker', function() {		
	    it('should had a btn-danger class (red) if status is new',inject(function($compile, $rootScope, Tasks) {		
			
			spyOn(Tasks, 'updateTask').andCallFake(function(args,callback,errcallback) {
				 callback({summary:'blabla',status:{name:'completed',id:3}});	
			});
		    	
		    scope = $rootScope.$new();
			//mocking the methods of the controller
	        scope.getUserTasks =function(){}
			scope.updateTaskStatus =function(task){}								
						
			
		    //get an element representation
		    elem = angular.element("<status-picker></status-picker>");
	 
		    //create a new child scope
		    scope.task = {status:{name:'new',id:'2'}};
	      
		    //finally compile the HTML
		    $compile(elem)(scope);
	 
		    //expect the background-color css property to be desirabe one
		    expect(elem.attr("class")).toEqual('statuspckr btn-danger');
		}));
		
		
	    it('if status is new, after clicking button it should became "active" and then "completed"',inject(function($compile, $rootScope, Tasks ) {
			
			spyOn(Tasks, 'updateTask').andCallFake(function(args,callback,errcallback) {
				 callback({summary:'blabla',status:{name:'completed',id:3}});	
			});
			
			scope = $rootScope.$new();
			scope.updateTaskStatus =function(task){
			 //  scope.task =  task;
			 //  console.log('new status:'+task.status.name)
		
			}	
			
		    var mySpy = spyOn(scope, 'updateTaskStatus').andCallThrough();
			
			
	        scope.getUserTasks =function(){}
		    //get an element representation
		    elem = angular.element("<status-picker>{{task.status.name}}</status-picker>");
	 
		    //create a new child scope
		    scope.task = {status:{name:'new',id:'2'}};
		    //finally compile the HTML
		    $compile(elem)(scope);	

            elem[0].click();			
            expect(mySpy.mostRecentCall.args[0]).toEqual({status:{name:'active',id:1}});
            elem[0].click();			
            expect(mySpy.mostRecentCall.args[0]).toEqual({status:{name:'completed',id:3}});			
		}));		
	    
	});
	
	describe('accessLevel', function() {		
        beforeEach(function() {
		
		    var mockAuth = {
				user :{ name:'', role:{bitMask: 1, title: "public"}},
				authorize:function(accessLevel, role){
					return accessLevel.bitMask & role.bitMask;
				}
			}
			
			var accessLevels = {
				"public":{"bitMask":7,"title":"*"},
				"anon":{"bitMask":1,"title":"public"},
				"user":{"bitMask":6,"title":"admin"},//user & admin
				"admin":{"bitMask":4,"title":"admin"},
				"useronly":{"bitMask":2,"title":"user"}
			};
							
		    module(function($provide) {
			    $provide.value('Auth', mockAuth);
				$provide.value('accessLevels', accessLevels);				
		    });
		})
	
		it('when user is public and access is public - the menu must be visible',inject(function($compile, $rootScope, accessLevels){
		

		    scope = $rootScope.$new();
			scope.accessLevels = accessLevels;

		    var elem = $compile("<li data-access-level='accessLevels.anon'>some text here</li>")(scope);
			
			//fire watch
			scope.$apply();
						
			expect(elem.css('display')).toEqual('');	
		}));
		
	
		it('when user is public and access is user - the menu must be hidden',inject(function($compile, $rootScope, accessLevels){		

		    scope = $rootScope.$new();
			scope.accessLevels = accessLevels;

		    var elem = $compile("<li data-access-level='accessLevels.user'>some text here</li>")(scope);
			
			//fire watch
			scope.$apply();
						
			expect(elem.css('display')).toEqual('none');	
		}))		
    });

	describe('activeNav', function() {
	    var scope, location, compile;
		beforeEach(inject(function($compile, $rootScope, $location) {
			scope = $rootScope.$new();
            location = $location
			compile = $compile;
		}));
		it('when location is same as "href" of link - the link must be decorated with "active" class',function(){
		    location.path('someurl');
		
		    var elem = compile("<li data-active-nav ><a href='http://server/someurl'>somelink</a></li>")(scope);
			
			//fire watch
			scope.$apply();            		
			expect(elem.hasClass('active')).toBe(true);
		});
		
		it('when location is different from "href" of link - the "active" class must be removed',function(){
		    location.path('some_different_url');
		    //initially  decorated with 'active'
		    var elem = compile("<li data-active-nav class='active'><a href='http://server/someurl'>somelink</a></li>")(scope);
			
			//fire watch
			scope.$apply();            		
			expect(elem.hasClass('active')).toBe(false);
		})		
	})

	describe('cssnotification', function() {
	    var scope, rootScope, compile, timeout;
		beforeEach(inject(function($compile, $timeout, $rootScope) {
		    rootScope = $rootScope;
			scope = $rootScope.$new();       
			compile = $compile;
			timeout = $timeout;
			
		}));
	
		it('Should be visible after rootScope.success became true', function() {	
		    
            var elem = compile('<div data-ng-bind="successmsg" ng-show="success" cssnotification></div>')(scope);	
			rootScope.success = false;
			//'ng-hide' class means the element is hidden
			scope.$digest(); 			
			expect(elem.hasClass('ng-hide')).toBe(true);
			
			
			//lets check if it shows up
			rootScope.success = true;
			rootScope.$digest(); 
			expect(elem.hasClass('ng-hide')).toBe(false);
			
			
			//lets check if it become hidden after 1 secs					
			timeout.flush();			
			expect(elem.hasClass('ng-hide')).toBe(true);
		});
	
	})*/
});