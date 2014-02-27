'use strict';

angular.module('Trempi')
.factory('Auth', ['$http','serverUrl',  function($http, serverUrl){ 
    var currentUser = {};
	
	
    if(localStorage.getItem("user")){
       	
       currentUser = JSON.parse(localStorage.getItem("user"));
	}
    function changeUser(user) {
        angular.extend(currentUser, user);
		localStorage.setItem("user", JSON.stringify(user));
    };
	function clearUser(){
	    currentUser = {};
	    localStorage.removeItem("user");
	
	};
    return {
        login: function(user, success, error) {
		
		   $http({
		      url: serverUrl +'/login',
              method: 'POST',
              data:{username: user.name, password:user.password},
			}).success(function(user, status, headers, config){
				changeUser(user);
				success();
			}).error(function (_error, status, headers, config) {
                error(_error);
            });
        },
		logout: function( success, error) {
		   $http({
		      url: serverUrl +'/logout',
              method: 'POST'              
			}).success(function(user, status, headers, config){
				changeUser({name:undefined});
				success();
			}).error(function (_error, status, headers, config) {
                error(_error);
            });		
		
		},
		updateUserType:	function(user, success, error) {
			changeUser(user);
		},
		updateUserDetails:	function(user, success, error) {
			changeUser(user);
		},
		user:currentUser
	}
}])
.factory('Tremps', ['$http', 'serverUrl', function($http, serverUrl){ 

    return {
	    save: function(user, success, error){
			$http({
				url: serverUrl +'/tremps',
                method: 'POST',
				data: user,
		    }).success(function(tremps, status, headers, config){
               success(tremps);	
            }).error(function (data, status, headers, config) {
               
            });						
		},
        getTremps: function(user, success, error){
            $http({
			 	url: serverUrl +'/tremps/'+user.type,
                method: 'GET'
		    }).success(function(tremps, status, headers, config){
               success(tremps);	
            }).error(function (data, status, headers, config) {
               error();
            });		   
        }
	}
}])
.factory('Gcm',['$rootScope', '$http', 'serverUrl', 'realDevice', function($rootScope, $http, serverUrl, realDevice){
    var pushNotification, callback;
    if(realDevice){
    	pushNotification = window.plugins.pushNotification;
	}
	else{//not realDevice
	    pushNotification = {register:function(){}};
    }
	 
	 
    var registersuccessHandler = function(event){
      // alert('register success')
    }
    var registererrorHandler = function(event){
      // aler('register error ')
    }
    window.onNotificationGCM= function(e){
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {

					//sending token to node:
					$http({
						url: serverUrl + '/registerDevice',
						method: 'POST',
						data:{regid:e.regid}
					}).success(function(tremps, status, headers, config){
					    //alert('device registered');
						callback();
					}).error(function (data, status, headers, config) {
					   //alert('error while registering device');
					});						
                }
                break;

            case 'message':
			   
                // this is the actual push notification. its format depends on the data model from the push server
				$rootScope.$broadcast('phonegapPush.notification', {
					data: 'lplp',
					provider: 'GCM'
				});  
                break;

            case 'error':
                alert('GCM error = '+e.msg);
                break;

            default:
                alert('An unknown GCM event has occurred');
                break;
        }  
    } 

	
   return {
      register:	function(_callback){
	      callback = _callback;
	      if(realDevice){
				pushNotification.register(registersuccessHandler, registererrorHandler,{"senderID":"393773537671","ecb":"onNotificationGCM"});
		  }
		  else{
		     
		     window.onNotificationGCM({event:'registered', regid:'12345'})
		  }
		  
		  
		  
      }	  
   }
}]);