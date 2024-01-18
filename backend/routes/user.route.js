const express = require('express');
const { auth } = require('firebase-admin');
const userRoutes = express.Router();
let User = require('../schemas/user.model');

// Define route to validate user
userRoutes.route('/validate').get(function (req, res) {
  const sessionCookie = req.cookies.session || '';
  // Verify the session cookie. 
  auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((decodedClaims) => {
      res.json(true);
    })
    .catch((error) => {
      res.json(false);
    });   
});

//Endpoint to log a user out and revoke and delete sessions
userRoutes.route('/logout')
  .delete(function (req, res) {
    const sessionCookie = req.cookies.session || '';
    res.clearCookie('session');
    auth()
      .verifySessionCookie(sessionCookie)
      .then((decodedClaims) => {
        return auth().revokeRefreshTokens(decodedClaims.sub);
        
      })
      .then(() => {
       res.redirect('/api/users/loggedOut');
      
      })
      .catch((error) => {
      res.redirect('/api/users/loggedOut');
      });
});

// Not used in frontend, just for backend cookie clearance.
userRoutes.route('/loggedOut').delete(function (req,res) {
})

//Endpoint to login a user and issue a new session cookie
userRoutes.route('/login')
  .post(function (req, res) {
    const idToken = req.body.idToken.toString();
    //Set the cookie to expire in 12 hours
    const expiresIn = 60 * 60 * 24 * 0.5 * 1000;
    auth()
      .createSessionCookie(idToken, { expiresIn })
      .then(
        (sessionCookie) => {
          // Set cookie policy for session cookie.
          const options = { maxAge: expiresIn, httpOnly: true, secure: true};

          res.cookie('session', sessionCookie, options);
          res.end(JSON.stringify({ status: 'success' }));
        },
        (error) => {
          res.status(401).send('UNAUTHORIZED REQUEST!');
        }
      );
  });

//USe to retireve the user by its email
//Email used as ID since firebase UID cant be used as _id for Mongo Document
userRoutes.route('/:email')
.get(function (req,res) {
  const sessionCookie = req.cookies.session || '';

  auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then( async (decodedClaims) => {

      const userRef = User.findOne({ email: req.params.email });
      userRef.exec((err, user ) => {
        if (err) {
            return res.status(404).send({ message: "User not found" });
          }
            res.status(200).send({ status: 'success', user: user });
      })
    })
    .catch((error) => {
    });
})


userRoutes.route('/:email/favourites')
    //Used to add a favourite exercise
    .patch(function (req,res)  {
      const sessionCookie = req.cookies.session || '';

      auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then( async (decodedClaims) => {
        let id = await User.findOne({email: req.params.email}, {_id:1}).exec();

        console.log("req.bodu_id (exerciseid is " , req.body._id);
        const updatedUser = await User.findByIdAndUpdate(id._id, { $push: { favouriteExercises: req.body._id } }, { new: true }).exec();
        const favourites = updatedUser.favouriteExercises;
        res.status(200).json({favourites});
      })
      .catch((error) => {
        res.status(400).send('Error favouriting exercise');
      });
    });

    userRoutes.route('/:email/favourites/:exerciseId')
    //Used to delete an exercise from the users favourites
    .delete(function (req,res)  {
      const sessionCookie = req.cookies.session || '';

      auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then( async (decodedClaims) => {
        let id = await User.findOne({email: req.params.email}, {_id:1}).exec();
        
        const updatedUser = await User.findByIdAndUpdate(id._id, { $pull: { favouriteExercises: req.params.exerciseId } }, { new: true }).exec();
        const favourites = updatedUser.favouriteExercises;
        res.status(200).json({favourites});
      })
      .catch((error) => {
        res.status(400).send('Error removing exercise from favourites');
      });
    });

userRoutes.route('/')
  //When a user registers, create a Mongo DB document for them
  .post(function (req, res) {
    let user = new User(req.body);

    //No need to verify user when creating one.
    user.save((err, user) => {
      if (err) {
        res.status(500).send('Error creating user');
      } else {

        res.status(200).send('Success creating user');
      }
    });
  });
module.exports = userRoutes;