let mangoose = require('mongoose');

//Create a Database Schema

let userSchema = mangoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        requires:true
    },
    username:{
        type: String,
        required:true
    },
	password:{
        type: String,
        required:true
    }
});

let User = module.exports = mangoose.model('User', userSchema);