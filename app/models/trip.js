// app/models/trip.js
// load things we need
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/travelr-sandbox');

// defined schema for trips
var tripSchema = mongoose.Schema(
  {
    tripName     : String,
    picURL       : String,
    users        : [
      {
        username : String
      }
    ],
    owner        : String,
    budget       : Number,
    origin       : String,
    destination  : String,
    arrival      : Date,
    departure    : Date,
    price        : Number,
    JetBlue      : Number,
    Expedia      : Number
  }, {collection: 'trips'});

// methods

// creating the model
module.exports = mongoose.model('Trip', tripSchema);
