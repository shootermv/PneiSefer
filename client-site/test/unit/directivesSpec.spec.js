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
			
           
			$templateCache.put("partials/mydatepicker.html", templ);
		}));
		
		it('should place 2 inputs on the dom ',function(){
		    
		    scope.user={when : new Date()};
		    var elem = compile("<my-date-picker  ng-model='user.when'> </my-date-picker>")(scope);
			
			//fire watch
			scope.$apply();            		
			expect(elem.find('input').length).toEqual(2);
		});
        
	})

});
