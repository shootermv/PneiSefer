angular.module("Trempi")
.constant('buttonConfig', {
  activeClass: 'active',
  toggleEvent: 'click'
})
.controller('ButtonsController', ['buttonConfig', function(buttonConfig) {
  this.activeClass = buttonConfig.activeClass || 'active';
  this.toggleEvent = buttonConfig.toggleEvent || 'click';
}])
.directive('btnRadio', function () {
  return {
    require: ['btnRadio', 'ngModel'],
    controller: 'ButtonsController',
    link: function (scope, element, attrs, ctrls) {
      var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      //model -> UI
      ngModelCtrl.$render = function () {
        element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.btnRadio)));
      };

      //ui->model
      element.bind(buttonsCtrl.toggleEvent, function () {
        if (!element.hasClass(buttonsCtrl.activeClass)) {
          scope.$apply(function () {
            ngModelCtrl.$setViewValue(scope.$eval(attrs.btnRadio));
            ngModelCtrl.$render();
          });
        }
      });
    }
  };
})
.directive('numPicker',function(){
 return {
    restrict:'E', 
    require:'?ngModel',
	scope:{
        num: '=ngModel',
		min:'@min',
		max:'@max',
    },
    templateUrl:'partials/numpicker.html',
	controller:function($scope, $filter){
		$scope.increase =function(){		    			
			if($scope.max && (+$scope.num)==$scope.max)return;
			
			
			$scope.num = +$scope.num + 1;
			if($scope.num<=9)$scope.num = '0'+$scope.num ;
		}
		$scope.decrease =function(){
		    if($scope.min && (+$scope.num)==$scope.min)return;
		    
		    $scope.num = +$scope.num - 1;
			if($scope.num<=9)$scope.num = '0'+$scope.num ;		
		}	
	},
	link:function(scope, elem, attrs){
	   var arrdown  = angular.element(elem.find('span'));
	   
	   
	   arrdown.on('mousedown',function(){	     
	     angular.element(this).addClass('mouse-down')	   
	   })
	   arrdown.on('mouseup',function(){	     
	     angular.element(this).removeClass('mouse-down')	   
	   })	     
	   
	}
  }
})
.directive('myDatePicker',function(){
  
  return {
    restrict:'E', 
    require:'?ngModel',
	scope:{
        dt: '=ngModel'
    },
    templateUrl:'partials/mydatepicker.html',
	controller:function($scope, $filter){
	    console.log($scope.dt)
		 
       $scope.hour = $filter('date')($scope.dt, 'HH');
	   $scope.minutes = $filter('date')($scope.dt, 'mm');
	   $scope.$watch('hour',function(selectedHour, oldval){			
			$scope.dt.setHours( selectedHour);	   
	   })
	   $scope.$watch('minutes',function(selectedMin, oldval){
			$scope.dt.setMinutes( selectedMin);
	   }) 
	}
    /*	
    link:function(scope, elem, attrs, ngModel){
      
      var newdt = new Date();
      elem.find('input').on('change',function(e){
        var hourInpt = elem.find('input')[1];		
		var minuteInpt = elem.find('input')[0];
		//prevent empty
        hourInpt.value = hourInpt.value==''?0:hourInpt.value;
		minuteInpt.value = minuteInpt.value==''?0:minuteInpt.value;
		
        var selectedHour = +hourInpt.value;
        var selectedMin = +minuteInpt.value;
		

        
        if(selectedMin>59 || selectedMin<0 || selectedHour>23 || selectedHour<0){
			if(selectedMin>58)elem.find('input')[0].value=59;
			if(selectedMin<0)elem.find('input')[0].value=0;
			if(selectedHour>23)elem.find('input')[1].value=23;
			if(selectedHour<0)elem.find('input')[1].value=0;			
		}
		else{		
			newdt.setMinutes( selectedMin);
			newdt.setHours( selectedHour);
			
			scope.$apply(function(){                    
			  ngModel.$setViewValue(newdt);
			  console.log('new date '+newdt);
			}) 
        } 		
      })
      elem.find('select').on('change',function(e){
        if(elem.find('select').val()=='מחר'){
          
          scope.$apply(function(){            
            ngModel.$setViewValue(newdt.setDate(newdt.getDate()+1))
			console.log('new date '+newdt);
          })              
        }
      })     
    }*/
  }    
})