angular.module("Trempi")
.controller('LoginCtrl',['$scope', '$location', 'Auth', 'Gcm', 'Tremps', '$modal', function($scope, $location, Auth, Gcm, Tremps, $modal){

  
  $scope.open = function ($event) {
    $event.preventDefault();
    var modalInstance = $modal.open({
      templateUrl: 'partials/modal.html',
      controller: 'ModalInstanceCtrl',
	  scope:$scope,
      resolve: {

      }
    });

    modalInstance.result.then(function () {
      $scope.user = Auth.user;
	  $scope.authenticated = Auth.isAuthenticated();
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };

  /* end of modal */
  

  $scope.loading = true;  

  $scope.authenticated = Auth.isAuthenticated()
  $scope.trempslist = {type :'driver'}
  $scope.user = Auth.user;
  
  if(! $scope.user.type)$scope.user.type = 'driver';
  $scope.$watch('trempslist.type',function(newVal ,oldVal){ 
    if(!newVal) return;
    $scope.loading = true;      	 
	Tremps.query({type: $scope.trempslist.type}, function(result) {
	    $scope.loading = false;
        $scope.tremps = result;
    });
  },true);
  
 
  
   //login
  $scope.Login = function(event){
    
    if($scope.login_form.$invalid){
	   $scope.showError =true;
    	return false;
	}else{//valid
		$scope.loading = true;
	}
	
	
    $scope.error=null;
    Auth.login($scope.user, function(user){//on success			    
        $scope.user = user;
		$scope.user.type = 'driver'		
		$scope.authenticated = Auth.isAuthenticated();
		$scope.loading = false;
		
	},function(error){
	    $scope.loading = false;
	    if(error=='')error='שגיאה'
		$scope.error = error;
	});
  };

  $scope.LogOut = function($event){
     $event.preventDefault();
     Auth.logout(function(user){
		$scope.user ={type : 'driver'};   
		$scope.authenticated = Auth.isAuthenticated();
			
	 },function(){
	   alert('err')
	 });
   };
   
   //for new tremp
   $scope.tremp = {when : new Date()};
   
   $scope.addTremp = function($event){
      $scope.formloading = true;
 	  if($scope.tremp_details.$invalid){
	     $scope.showError =true;
	     return false;
	  }  
      
      $scope.tremp.name = $scope.user.name;
	  $scope.tremp.type  = $scope.user.type;	  
	  $scope.tremp.phone = $scope.user.phone;
      Tremps.save($scope.tremp,function(){
	       $scope.formloading = false;
           $scope.tremp_details.$setPristine();	  
           if($scope.trempslist.type == $scope.tremp.type) $scope.tremps.push(angular.copy($scope.tremp));
		   $scope.tremp = {when : new Date()};
	  },function(){
	     alert('error')
	  });   
   }
   
}])
.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'Auth', function ($scope, $modalInstance, Auth) {

	 


   $scope.ok = function (register_form) {
	console.log('user',$scope.user);
 	    if(register_form.$invalid){
			$scope.showError =true;
			return false;
	    }   
		
      	Auth.register($scope.user, function(){//on success	
          $modalInstance.close();
		},function(error){
			if(error=='')error='שגיאה'
			$scope.error = error;
	    });	
      
   };

   $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
   };
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
	return;
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