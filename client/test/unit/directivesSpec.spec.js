'use strict';

/* jasmine specs for directives go here */


describe('directives', function() {
    var scope, elem, templ=
'<div class="form-group_">'+ 
	 '<select class="form-control pull-right" style="width:75px" >'+
	 '<option>היום</option>'+ 
	 '<option>מחר</option>'+ 
	 '</select>'+
	 '<span class="pull-right" style="font-wegiht:bold;line-height:35px;padding:0 10px"> ב </span>'+
	 '<input value="{{user.when | date :'+" 'mm'"+'}}" style="width:55px"  class="form-control pull-right"   required name="min">'+
	 '<span class="pull-right" style="line-height:35px;padding:0 10px"> : </span>'+
	 '<input  value="{{user.when | date :'+" 'HH'"+'}}" style="width:55px"  class="form-control pull-right" required name="hour"/>'+		 
'</div>'



	
	beforeEach(module('Trempi'));
	

	describe('myDatePicker', function() {
	    var scope, location, compile;
		beforeEach(inject(function($compile, $rootScope, $location, $templateCache) {
			scope = $rootScope.$new();
            location = $location
			compile = $compile;
			
            //$httpBackend.whenGET('partials/mydatepicker.html').passThrough();
			$templateCache.put("partials/mydatepicker.html", templ);
		}));
		
		it('when location is same ',function(){
		    location.path('someurl');
		
		    var elem = compile("<my-date-picker  ng-model='user.when'> </my-date-picker>")(scope);
			
			//fire watch
			scope.$apply();            		
			expect(elem.find('input').length).toEqual(2);
		});
		/*
		it('when location is different from "href" of link - the "active" class must be removed',function(){
		    location.path('some_different_url');
		    //initially  decorated with 'active'
		    var elem = compile("<li data-active-nav class='active'><a href='http://server/someurl'>somelink</a></li>")(scope);
			
			//fire watch
			scope.$apply();            		
			expect(elem.hasClass('active')).toBe(false);
		})
		*/
	})

});
