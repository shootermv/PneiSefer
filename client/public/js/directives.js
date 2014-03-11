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
	    
		$scope.day = 'היום'; 
        $scope.hour = $filter('date')($scope.dt, 'HH');
	    $scope.minutes = $filter('date')($scope.dt, 'mm');
	    $scope.$watch('hour',function(selectedHour, oldval){			
			$scope.dt.setHours( selectedHour);	   
	    })
	    $scope.$watch('minutes',function(selectedMin, oldval){
			$scope.dt.setMinutes( selectedMin);
	    }) 
	    $scope.$watch('day',function(selectedDay, oldval){
	       if(selectedDay === 'מחר' ){
				$scope.dt.setDate($scope.dt.getDate()+1)
		   }
	    })
	}
  }    
})