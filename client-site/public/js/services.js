﻿'use strict';

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
				success(user);
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
				success(user);
			}).error(function (_error, status, headers, config) {
                error(_error);
            });		
		
		},
		register:function(user, success, error) {
		   $http({
		      url: serverUrl +'/register',
              method: 'POST',
              data:user             
			}).success(function(_user, status, headers, config){	
                changeUser(user);			
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
		isAuthenticated:function(){//returns false if currentUser is empty object
		   console.log('auth:',!(typeof currentUser.name==="undefined"));
		   return !(typeof currentUser.name==="undefined");
		},
		user:currentUser
	}
}])
.factory('Tremps', ['$http', 'serverUrl', '$resource', function($http, serverUrl, $resource){ 
    /*
    return {
	    save: function(user, success, error){
			$http({
				url: serverUrl +'/tremps',
                method: 'POST',
				data: user,
		    }).success(function(tremps, status, headers, config){
               success(tremps);	
            }).error(function (err, status, headers, config) {
               error(err)
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
	}*/
	return $resource(serverUrl +'/tremps/:type');
}])
.factory('Gcm',['$rootScope', '$http', 'serverUrl', 'realDevice', function($rootScope, $http, serverUrl, realDevice){
    var pushNotification, callback,  errcallback  ;
    if(realDevice){
    	pushNotification = window.plugins.pushNotification;
	}
	else{//not realDevice
	    pushNotification = {register:function(){}};
    }
	 
	 
    var registersuccessHandler = function(event){
       //alert('register success')
    }
    var registererrorHandler = function(data){
      errcallback(data);
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
					    errcallback(data);
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
                callback('error while sending push notification');
                break;

            default:
                alert('An unknown GCM event has occurred');
                break;
        }  
    } 

	
   return {
      register:	function(_callback, _errcallback){
	      callback = _callback;
		  errcallback = _errcallback;
		  
	      if(realDevice){
		    setTimeout(function(){
				pushNotification.register(registersuccessHandler, registererrorHandler,{"senderID":"393773537671","ecb":"onNotificationGCM"});
				
			},100);
		  }
		  else{		     
		     window.onNotificationGCM({event:'registered', regid:'12345'})
		  }		  		  	
      }	  
   }
}]);