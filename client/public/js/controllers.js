angular.module("Trempi")
.controller('LoginCtrl',['$scope', '$location', 'Auth', 'Gcm', function($scope, $location, Auth, Gcm){
 

  $scope.loading = false;

  if(Auth.isAuthenticated()){
	 $location.path('list');
  }
  $scope.user = Auth.user;

   //login
  $scope.goToHoAmIPage = function(event){
    
    if($scope.login_form.$invalid){
	   $scope.showError =true;
    	return false;
	}else{//valid
		$scope.loading = true;
	}
    $scope.error=null;
    Auth.login($scope.user, function(){//on success		
	    
        Gcm.register(function(){            	
			$location.path('whoami');			
		});
		
	},function(error){
	    $scope.loading = false;
	    if(error=='')error='שגיאה'
		$scope.error = error;
	});
  }  
}])
.controller('registerCtrl',['$scope', '$location', 'Auth', function($scope, $location, Auth){
   $scope.user = {};//Auth.user;
   
    
    $scope.goToLoginPage = function(event){
		if($scope.register_form.$invalid){
		   $scope.showError =true;
			return false;
		} 	
	    Auth.register($scope.user, function(){//on success	
          $location.path('login'); 
		},function(error){
			if(error=='')error='שגיאה'
			$scope.error = error;
	    });	
    }   
 }]) 
.controller('WhoAmICtrl',['$scope', '$location', 'Auth', function($scope, $location, Auth){
  
  if(Auth.isAuthenticated()){
	$scope.user = Auth.user;
  }else{
	$location.path('login');
  }
 
  if(!$scope.user.type)$scope.user.type = 'driver';//by default should be driver
  
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
.controller('FormCtrl',['$scope', '$location', 'Auth', 'Tremps', function($scope, $location, Auth, Tremps){
  if(Auth.isAuthenticated()){
	$scope.user = Auth.user;
  }else{
	$location.path('login');
  }
  $scope.loading = false;
  $scope.user.when = new Date();
  
  $scope.goToWhoAmIPage = function(event){
    event.preventDefault();
	$location.path('whoami');
  }
  $scope.skipToListPage = function(event){
     $location.path('list'); 
  }  
  $scope.goToListPage = function(event){
	if($scope.tremp_details.$invalid){
	   $scope.showError =true;
	   return false;
	}else{//valid	  
	
		$scope.loading = true;
	}
    Auth.updateUserDetails($scope.user);
	//send new tremp

	Tremps.save($scope.user, function(data){
		$location.path('list');
	},function(err){
	    $scope.loading = false;
		$scope.error= err;
	});		
  }   
}])
.controller('ListCtrl',['$rootScope', '$scope', '$location', 'Tremps', 'Auth', 'Gcm',  function($rootScope, $scope, $location, Tremps, Auth, Gcm){
  if(Auth.isAuthenticated()){
	$scope.user = Auth.user;
  }else{
	$location.path('login');
  }
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
  
  Gcm.register(function(){
     $scope.getTremps();
  },function(data){
     $scope.error = data;
  });
  
  
  
  
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