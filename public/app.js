angular.module('trempi',[])
.controller('trempiCtrl',function($scope,$http){
    $scope.user={type:1,date:new Date()};
	$scope.step=3;
	console.log('user type-'+$scope.user.type);
	
	$scope.saveTremp = function(user){	    
		$http({method:'POST', url:'/tremps',data:user}).success(function(user){	
		    
		    $http({method:'GET', url:'/tremps/'+$scope.user.type}).success(function(tremps){
			    $scope.tremps = tremps;
				$scope.step=3;
		    })						
		});			
	}	
	
	
		
	$http({method:'GET', url:'/tremps/'+$scope.user.type}).success(function(tremps){
		$scope.tremps = tremps;
		$scope.step=3;
	})						
	
})
.directive('moDateInput', function ($window) {
    return {
        require:'^ngModel',
        restrict:'A',
        link:function (scope, elm, attrs, ctrl) {
            var moment = $window.moment;
            var dateFormat = attrs.moMediumDate;
            attrs.$observe('moDateInput', function (newValue) {
                if (dateFormat == newValue || !ctrl.$modelValue) return;
                dateFormat = newValue;
                ctrl.$modelValue = new Date(ctrl.$setViewValue);
				 console.log('newValue:'+newValue) 
            });
           
            ctrl.$formatters.unshift(function (modelValue) {
                scope = scope;
                if (!dateFormat || !modelValue) return "";
                var retVal = moment(modelValue).format(dateFormat);
                return retVal;
            });

            ctrl.$parsers.unshift(function (viewValue) {
                scope = scope;
                var date = moment(viewValue, dateFormat);
                return (date && date.isValid() && date.year() > 1950 ) ? date.toDate() : "";
            });
        }
    };
});