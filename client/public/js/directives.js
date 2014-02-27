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
.directive('myDatePicker',function(){
  
  return {
    restrict:'E', 
    require:'?ngModel',
    template:'<div class="form-group_"> '+
	 '<select class="form-control pull-right" style="width:75px" >'+
	 '<option>היום</option>' +
	 '<option>מחר</option>' +
	 '</select>'+
	 '<span class="pull-right" style="font-wegiht:bold;line-height:35px;padding:0 10px"> ב </span>'+
	 '<input  value="{{user.when | date : '+"'mm'"+'}}" style="width:45px"  class="form-control pull-right">'+
	 '<span class="pull-right" style="line-height:35px;padding:0 10px"> : </span>'+
	 '<input  value="{{user.when | date : '+"'HH'"+'}}" style="width:45px"  class="form-control pull-right"> '+ 
	  
       
	 '</div>'
   ,
    link:function(scope, elem, attrs, ngModel){
      
      var newdt = new Date();
      elem.find('input').on('change',function(e){
         
        var selectedHour =elem.find('input')[1].value;
        var selectedMin =elem.find('input')[0].value;
        
        
        console.log('selectedMin '+selectedMin);
		console.log('selectedHour '+selectedHour);
        newdt.setMinutes( selectedMin);
        newdt.setHours( selectedHour);
        
        scope.$apply(function(){                    
          ngModel.$setViewValue(newdt);
		  console.log('new date '+newdt);
        })  
      })
      elem.find('select').on('change',function(e){
        if(elem.find('select').val()=='מחר'){
          
          scope.$apply(function(){            
            ngModel.$setViewValue(newdt.setDate(newdt.getDate()+1))
			console.log('new date '+newdt);
          })              
        }
      })     
    }
  }    
})