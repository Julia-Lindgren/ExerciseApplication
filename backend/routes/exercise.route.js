const express = require('express');
const { auth } = require('firebase-admin');
const Joi = require('joi');
const exerciseRoutes = express.Router();

// Require Post model in our routes module
let Exercise = require('../schemas/exercise.model');

// Delete an exercise
exerciseRoutes.route('/:id')
  .delete(function (req, res) {
    const sessionCookie = req.cookies.session || '';

    auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
          Exercise.findByIdAndRemove({_id: req.params.id})
        .then(() => {
          res.status(200).send('Success deleting exercise');
        }).catch(() => {
          res.status(200).send('error deleting exercise');
            });

      })
      .catch((error) => {
        // Session cookie is unavailable or invalid. 
        res.status(400).send("valid session not found");
      });
    
  });


//Joi schema for validation of creating exercises
const exerciseSchema = Joi.object({
  title: Joi.string().min(1).max(26).required(),
  owner: Joi.string().min(3).max(300).required(),
  description: Joi.string().min(1).max(600).required(),
  imageUrl: Joi.string().uri().required(),
  tags: Joi.array().items(Joi.string().valid('custom', 'shoulder', 'elbow', 'wrist', 'hip', 'knee', 'ankle' ,
  'shoulders','chest','back','arms','abs','legs'
  ,'mobility','strength','endurance','stability','favourite')).optional(),
});


exerciseRoutes.route('/')
  //Create an exercise
  .post(function (req, res) {
    //Validate the input with Joi
    const {error} = exerciseSchema.validate(req.body);
    if(error) {
      // Return a response with the validation error message
      return res.status(400).json({ error: error.details[0].message });
    }

    let exercise = new Exercise(req.body);

    const sessionCookie = req.cookies.session || '';
    // Verify the session cookie. In this case an additional check is added to detect
    // if the user's Firebase session was revoked, user deleted/disabled, etc.
    auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
        exercise.save()
        .then(() => {
          res.status(200).send("Created exercise successfully");
        }).catch(() => {
              res.status(400).send("Unable to create exercise");
            });

      })
      .catch((error) => {
        // Session cookie is unavailable or invalid. 
        res.status(400).send("valid session not found");
      });
  })

  //Get all exercises
  .get(function (req, res) {
    const sessionCookie = req.cookies.session || '';
    // Verify the session cookie. 
    auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then( async (decodedClaims) => {
  
      const exercises = await Exercise.find().exec();
      res.json(exercises);
      
      })
      .catch((error) => {
        res.status(400).send("valid session not found");
      });
  });

// Defined get data(index or listing) route
exerciseRoutes.route('/')

module.exports = exerciseRoutes;