const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const firebase = require('firebase');
const morgan = require('morgan');
const config = require('./config/config');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(cors());

mongoose.connect(config.mongoURI);
const db = mongoose.connection;

firebase.initializeApp(config.firebase);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('connected', () => console.log('MongoDB connected...'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', routes);
app.get('*', (req, res) => res.send('Welcome to a world of nothingless'));

app.listen(config.port, () =>
    console.log(`Now listening on Port ${config.port}`)
);
