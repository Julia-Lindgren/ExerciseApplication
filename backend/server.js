// server.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT ||3000;
const hostname = '127.0.0.1'
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./DB.js');
const exerciseRoute = require('./routes/exercise.route');
const routineRoute = require('./routes/routine.route');
const userRoute = require('./routes/user.route');
const decodeIDToken = require('./authenticateToken');
const cookieParser = require('cookie-parser');
const path = require('path');

//Adding HTTPS with mkcert
const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync('./mkcert/127.0.0.1-key.pem'),
  cert: fs.readFileSync('./mkcert/127.0.0.1.pem')
};

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => { console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

// app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cookieParser());

app.use('/api/exercises', exerciseRoute);
app.use('/api/routines', routineRoute);
app.use('/api/users', userRoute);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Define a catch-all route that serves the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

  app.listen(PORT, function(){
});