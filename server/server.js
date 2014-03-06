var express =       require('express')
, http =        require('http')
, path =        require('path')
, mongoose = require('mongoose')
, passport =    require('passport')
, Schema = mongoose.Schema
, gcm = require('node-gcm');
require('./models/User.js');
var User  = mongoose.model('User');
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
mongoose.connect('mongodb://localhost/trempi');

var app = module.exports = express();

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname,'../client/public')));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

/*-passport-stuff-*/
app.use(express.cookieSession({    
        secret: process.env.COOKIE_SECRET || "Superdupersecret"
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
	console.log('serializing-'+user.firstname+ ' '+user.lastname );
	done(null, user.firstname + ' ' + user.lastname)
})

passport.deserializeUser(function(name, done) {
	console.log('deserializing-'+name);
	/*
	User.findOne({ _id: id }, function (err, user) {
	  console.log('deserializing user-'+user.name)
	  done(err, user)
	})
	*/
	done(null, {name:name})
})

var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(/*{
	usernameField: 'name',
	passwordField: 'password'
  },*/
  function(username, password, done) {
		User.findOne({ username: username }, function (err, user) {
			if (err) { return done(err) }
			if (!user) {
			  return done(null, false, { message: 'Unknown user' })
			}
			if (!user.authenticate(password)) {
			  return done(null, false, { message: 'Invalid password' })
			}
			return done(null, user)
		})
  }
));
/*-passport-END-*/




/*
app.post('/login', function(req, res){
    if(req.body.username=='shlomo' && req.body.password=='12345')
        res.json({id:12345,name:'שלמה גרזון', phone:'050-8101748'});
	else
	   res.send(400, 'לא קיים משתמש בשם '+req.body.username);
});
*/

require('./routes.js')(app);

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
	
	var oppositetype = req.params.type == 'driver' ? 'trempist' : 'driver';
	//console.log('oppositetype: '+oppositetype);
	var today = new Date();
	today.setHours(0);
	
	
	
	console.log(today.getHours())
	
	Tremps.find({ $and:[{'type':oppositetype}/*,{'when':{$gt:today}}*/]},function(err, tremps){
	    if(tremps.length>0){
		   console.log('tremps.length-',tremps.length)
			/*var dateofFirstTremp = tremps[0].when;		
			showDate(dateofFirstTremp,'dateofFirstTremp');
			showDate(today,'today');				
	        console.log('dateofFirstTremp  > today=',dateofFirstTremp  > today)*/
		}
		res.send(tremps);
		
	})
	
});
function showDate(dt, variable){

	console.log(variable+':',addZero(dt.getDate())+'.'+addZero(dt.getMonth()+1)+'.'+dt.getFullYear()+' '+addZero(dt.getHours())+':'+addZero(dt.getMinutes()));
}
function addZero(num){
  return ('0'+num).substr(-2)
}
//insert new tremp
app.post('/tremps', function(req, res){


    console.log('adding new tremp - ',req.body);

   	
    var newtremp = new Tremps(req.body);
	setTimeout(function(){
	newtremp.save(function(err){
	    
		if(!err){	 
          var messg = (newtremp.type=='dirver')?'נוסע ל ':'זקוק לטרמף ל';
		  messg = messg + newtremp.to;
		  
          sendMessage({body:messg, title:newtremp.name})		  
		  res.json({});
		}else{
		   res.send(403,'some error occurred:'+err)
		}
	});	
	},1000);
});
/*  --for gcm:--  */
var registrationIds = [];
var message = new gcm.Message();
var sender = new gcm.Sender('AIzaSyDMVJNX61-qVe5tqRn-R-XKoNUpWd9n75o');

function sendMessage(messg){
	if(registrationIds.length==0){
	   console.log('no devices registered');
	   return;	
	}
	
	//console.log('registrationIds.length - ',registrationIds.length)
	
	message.addData('message', messg.body);
	message.addData('title', messg.title );
	message.addData('msgcnt','3'); // Shows up in the notification in the status bar
	message.addData('soundname','beep.wav'); //Sound to play upon notification receipt - put in the www folder in app

	message.timeToLive = 3000;
	sender.send(message, registrationIds, 4, function (result) {
		console.log('registrationIds sended callback -',result);
	});
}
function arrayContains(needle, arrhaystack)
{
    return (arrhaystack.indexOf(needle) > -1);
}

app.get('/send',function(req, res){
  sendMessage();  
  res.render('registrationIds', { registrationIds:registrationIds });
})

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