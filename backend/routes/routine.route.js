const express = require('express');
const { auth } = require('firebase-admin');
const routineRoutes = express.Router();
const Joi = require('joi');

// Require Post model in our routes module
let Routine = require('../schemas/routine.model');

//Joi schema for validation of creating routines
const routineSchema = Joi.object({
  title: Joi.string().min(1).max(26).required(),
  owner: Joi.string().min(3).max(300).required(),
  routineImageUrl: Joi.string().uri().required(),
  exercises: Joi.array().items().min(1).max(50).required()
});

routineRoutes.route('/')
  //Creates a new routine 
  .post(function (req, res) {

    //Validate the input with Joi
    const {error} = routineSchema.validate(req.body);
    if(error) {
      // Return a response with the validation error message
      return res.status(400).json({ error: error.details[0].message });
    }

    let routine = new Routine(req.body);

    const sessionCookie = req.cookies.session || '';
    // Verify the session cookie. 
    auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
        routine.save()
        .then(() => {
          res.status(200).send('Success creating routine');
        }).catch(() => {
              res.status(400).send("unable to create routine");
            });

      })
      .catch((error) => {
        // Session cookie is unavailable or invalid. 
        res.status(400).send("Valid session not found");
      });
  })

  .get(function (req, res) {
    // console.time("get all routines");
    const sessionCookie = req.cookies.session || '';

    const userEmail = req.query.userEmail;
    
    auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then( async (decodedClaims) => {
      const routines = await Routine.find({ owner: userEmail}).exec();

      res.json(routines);
      
      })
      .catch((error) => {
        res.status(400).send("unable to create routine");
      });
  });

// Defined delete | remove | destroy route
routineRoutes.route('/:id')

  .delete(function (req, res) {
    const sessionCookie = req.cookies.session || '';

    auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
        Routine.findByIdAndRemove(req.params.id)
        .then((routine) => {
          res.status(200).send("Deleted routine successfully");
        })
        .catch((err) => {       
        }) 

      })
      .catch((error) => {
        res.status(400).send("Valid session not found");
      });
  });

module.exports = routineRoutes;