var express =       require('express')
, http =        require('http')
, path =        require('path')
, mongoose = require('mongoose')
, Schema = mongoose.Schema
, gcm = require('node-gcm');


/*----------------*/
var TrempSchema = new Schema({
	name:String,	
	type:String,
	to:String,
	from:String,
	phone:String,
    when:{ type : Date, default: Date.now }	
});	
var Tremps = mongoose.model('Tremp',TrempSchema);	
mongoose.connect('mongodb://shootermv:Vstorm1000@ds061238.mongolab.com:61238/trempi');//('mongodb://localhost/trempi');

var app = module.exports = express();

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.post('/login',function(req, res){
    if(req.body.username=='shlomo' && req.body.password=='12345')
        res.json({id:12345,name:'שלמה גרזון'});
	else
	   res.send(400, 'לא קיים משתמש בשם '+req.body.username);
});
app.post('/logout',function(req, res){
	res.send(200)
})
//get tremps
app.get('/tremps/:type',function(req, res){
	/*var data = [{			
	   username:"משה וילנר",
	   from:"פני קדם",
	   to:"בית שמש",
	   when:"2014-02-26T13:30:00.000Z",
	   phone:"050-8101748"
	},
	{
	   username:"אריאל ברג",
	   from:"פני קדם",
	   to:"בית שמש",
	   when:"2014-02-25T16:00:00.000Z",
	   phone:"050-8101748"
	}];
	res.json(data);	*/
    Tremps.find(function(err, tremps){
       res.send(tremps);
    })	
});
//insert new tremp
app.post('/tremps', function(req, res){
    console.log('adding new tremp - ',req.body)	
    var newtremp = new Tremps(req.body);
	newtremp.save(function(err){
		if(!err){	 
          //notification;
          sendMessage({body:req.body.username+ "  מחכה בצומת גוש"})		  
		  res.json({});
		}else
		  console.log(err)
	});	
});


/*  --for gcm:--  */
var registrationIds = [];
var message = new gcm.Message();
var sender = new gcm.Sender('AIzaSyDMVJNX61-qVe5tqRn-R-XKoNUpWd9n75o');

function  sendMessage(messg){
	if(registrationIds.length==0){
	   console.log('no devices registered');
	   return;	
	}
	
	console.log('registrationIds.length - ',registrationIds.length)
	
	message.addData('message', messg.body);
	message.addData('title','שלמה גרזון' );
	message.addData('msgcnt','3'); // Shows up in the notification in the status bar
	message.addData('soundname','beep.wav'); //Sound to play upon notification receipt - put in the www folder in app

	message.timeToLive = 3000;
	sender.send(message, registrationIds, 4, function (result) {
		console.log(result);
	});
}
function arrayContains(needle, arrhaystack){

    return (arrhaystack.indexOf(needle) > -1);
}

app.get('/send',function(req, res){
  sendMessage({body:"שלמה גרזון מחכה בצומת אפרת"});  
  res.render('registrationIds', { registrationIds:registrationIds });
})
app.get('/clear',function(req, res){
  registrationIds=[];
  res.send('registrations is empty');
});
app.post('/registerDevice',  function(req, res){
    console.log('trying to push -'+ req.body.regid);
     if(arrayContains(req.body.regid , registrationIds)) {
		console.log('this device already registered!');
	 }
	 else{
         registrationIds.push(req.body.regid);
	}
	res.send('device id saved successfully');	
});
app.get('/removeDevice/:index',function(req, res){
    //console.log('index -'+ req.params.index);
   registrationIds.splice(req.params.index, 1)
   res.render('registrationIds', { registrationIds:registrationIds });
});


app.set('port', process.env.PORT || 3000);
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});