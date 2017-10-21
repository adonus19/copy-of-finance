const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      passport = require('passport'),
      mongoose = require('mongoose'),
      config = require('./config/database');

//connect to database
mongoose.connect(config.database);
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database)
});
//if error
mongoose.connection.on('error', (err) => {
    console.log('Database error ' + err)
});

const app = express();
const port = 3000;

const users = require('./routes/users');
const finances =require('./routes/finances');

//cors
app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//body-parser middleware
app.use(bodyParser.json());

//passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use('/users', users);


//index route
app.get('/', (req, res) => {
    res.send('<h1>Home!</h1>');
});

//server
app.listen(port, () => {
    console.log('Running on port '+ port);
})