angular.module("Trempi")
.controller('LoginCtrl',['$scope', '$location', 'Auth', 'Gcm', function($scope, $location, Auth, Gcm){
  $scope.user = Auth.user;
  
  if($scope.user.name !== undefined) { //if user stored inside local storage brings me to list page
	   $location.path('list');
  }
 

   //login
  $scope.goToHoAmIPage = function(event){
    if($scope.login_form.$invalid)  return false;
    $scope.error=null;
    Auth.login($scope.user, function(){//on success		
        Gcm.register(function(){
            	
			$location.path('whoami');
			
		});
		
	},function(error){
	    if(error=='')error='שגיאה'
		$scope.error = error;
	});
  }  
}])
.controller('WhoAmICtrl',['$scope', '$location', 'Auth', function($scope, $location, Auth){
  
  $scope.user = Auth.user;
  $scope.user.type = 'driver';//by default should be driver
  
  $scope.goToLoginPage = function(event){
    event.preventDefault();
	//login out
	Auth.logout( function(){ $location.path('login'); })
  }
  $scope.goToFormPage = function(event){
    Auth.updateUserType($scope.user);
	$location.path('form');
  } 
}])
.controller('registerCtrl',['$scope', '$location', 'Auth', function($scope, $location, Auth){
   $scope.user = {};//Auth.user;
   $scope.goToLoginPage = function(event){
      $location.path('list'); 

    }   
 }]) 
.controller('FormCtrl',['$scope', '$location', 'Auth', 'Tremps', function($scope, $location, Auth, Tremps){

  
  $scope.user = Auth.user;
  $scope.user.when = new Date();
  
  $scope.goToWhoAmIPage = function(event){
    event.preventDefault();
	$location.path('whoami');
  }
  $scope.skipToListPage = function(event){
     $location.path('list'); 
  }  
  $scope.goToListPage = function(event){
    Auth.updateUserDetails($scope.user);
	//send new tremp
	Tremps.save($scope.user,function(data){
		$location.path('list');
	},function(err){
		alert('failure!')
	});
	
	
  }   
}])
.controller('ListCtrl',['$rootScope', '$scope', '$location', 'Tremps', 'Auth', 'Gcm',  function($rootScope, $scope, $location, Tremps, Auth, Gcm){
  $scope.user = Auth.user;
  $scope.getTremps= function(){
      $scope.loading = true;
	  Tremps.getTremps($scope.user ,function(tremps){
	    $scope.loading = false;
		$scope.tremps = tremps;  
	  },function(tremps){
	    $scope.loading = false;
		alert('error while getting tremps')
	  });
  };
  Gcm.register(function(){});
  $scope.getTremps();
  $scope.goToFormPage = function(event){
    event.preventDefault();
	$location.path('form');
  } 

  $scope.$on('phonegapPush.notification', function(e, notification) {
      $scope.getTremps();
	  

  });
  $scope.fireEvent = function(){
   alert('o')
  }
  
}])