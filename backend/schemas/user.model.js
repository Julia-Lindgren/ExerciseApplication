// Define collection and schema for users
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    email: {
       type: String,
       required: false, 
    }, 
  favouriteExercises: {
    type: [String],
    required: false,
    default: []
    
  }
},{
    collection: 'users'
});

module.exports = mongoose.model('User', User);

