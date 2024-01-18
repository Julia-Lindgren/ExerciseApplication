const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for routines
let Routine = new Schema({
  title: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  routineImageUrl: {
    type: String,
    required: true
  },
  exercises: [{
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Exercise',
          required: true
        },
        title: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        imageUrl: {
          type: String,
          required: true
        },
        tags: {
          type: [String],
          required: false,
          default: []
        },
        customFields: {
          type: mongoose.Schema.Types.Mixed
        }
      }]
},{
    collection: 'routines'
});

module.exports = mongoose.model('Routine', Routine);

