// app/models/destination.js
// load up some mongoose
var mongoose = require('mongoose');

// define the schema
var destinationSchema = mongoose.Schema
({
  "Origin"                          : String,
  "Destination"                     : String,
  "Hotel Property"                  : String,
  "Hotel Nights Stay"               : Number,
  "Hotel Check In Date"             : Date,
  "Hotel Check Out Date"            : Date,
  "Expedia Package Price/Person"    : Number,
  "JetBlue Package Price/Person"    : Number,
  "% Savings (Compared to Expedia)" : String,
  "Month"                           : Number,
  "Advance_weeks"                   : String,
  "count"                           : Number
}, {collection: 'destination'});

// create the model
module.exports = mongoose.model('Destination', destinationSchema);
