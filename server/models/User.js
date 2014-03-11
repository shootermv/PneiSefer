var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , _ = require('underscore')

var UserSchema = new Schema({
  username: String,
  firstname: String,  
  lastname: String,  
  phone:String,
  hashed_password: String,
  salt: String
})

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
	
	console.log('setting the passwd')
  })
  .get(function() { return this._password });
  
UserSchema
  .virtual('fullname')
  .get(function () {
	  return this.firstname + ' ' + this.lastname;
  });

UserSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },



  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },



  encryptPassword: function(password) {
    if (!password) return ''
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
  }
}
mongoose.model('User', UserSchema)