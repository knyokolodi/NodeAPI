let mangoose = require('mongoose');

//Create a Database Schema

let articleSchema = mangoose.Schema({
    title:{
        type: String,
        required:true
    },
    author:{
        type: String,
        requires:true
    },
    body:{
        type: String,
        required:true
    },
    date:{
        type: Date, 
        default: Date.now 
    }
});

let Article = module.exports = mangoose.model('Article', articleSchema);