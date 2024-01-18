const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for exercises
let Exercise = new Schema({
  title: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: false, 
    default: 'premade'
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  muscleImageUrl: {
    type: String,
    required: false
  },
  references: {
    type: [String],
    required: false
  },
  similarExercises: {
    type: [String],
    required: false,
    default: []
  },
  tags: {
    type: [String], 
    required: false,
    default: []
  }
  

},{
    collection: 'exercises'
});

module.exports = mongoose.model('Exercise', Exercise);

