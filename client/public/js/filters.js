angular.module("Trempi")
.filter('myDate', function($filter) {
      return function(input, uppercase) {
        var out='',
        dt= new Date(input),
        todaydt= new Date();
        
         
        var currperiod =( todaydt.getMonth()==dt.getMonth() &&  todaydt.getYear()==dt.getYear() );
                
          
        if(!currperiod)return $filter('date')(input, "dd/MM/yyyy HH:mm");         
        if( todaydt.getDate()==dt.getDate()){
            out='היום ב';
        }else if(todaydt.getDate()==(dt.getDate()-1)){
            out = 'מחר ב'; 
        }else{
            out = $filter('date')(input, "dd/MM/yyyy");
        }
            
        out = out + $filter('date')(input, " HH:mm");
   
        return out;
      };
});