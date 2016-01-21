// app/routes.js
var Trip = require('./models/trip');
var Person = require('./models/user');
var Destination = require('./models/destination');

module.exports = function(app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    res.sendfile('public_html/login.html'); // load the login.html file
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function(req, res)
  {
    res.redirect('/');
  });
  /*
  app.get('/login', function(req, res) {

  // render the page and pass in any flash data if it exists
  res.render('login.ejs', { message: req.flash('loginMessage') });
});
*/
// process the login form
// app.post('/login', do all our passport stuff here);
// process the login form
app.post('/login', passport.authenticate('local-login', {
  successRedirect : '/myTrips', // redirect to the secure profile section
  failureRedirect : '/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
app.get('/signup', function(req, res) {

  // render the page and pass in any flash data if it exists
  res.sendfile('public_html/signup.html');
});

// process the signup form
app.post('/signup', passport.authenticate('local-signup',
{
  successRedirect: '/myTrips',
  failureRedirect: '/',
  failureFlash: true
}));

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
app.get('/profile', isLoggedIn, function(req, res) {
  //var tripJson = Trip.find({ 'users':[{ 'username': req.user}]})Trip.find({ 'users':[{ 'username': req.user}]});
  var num = {'number' : 2};
  res.render('user.ejs', {
    user : req.user, // get the user out of session and pass to template
    //trip : Trip.find({ 'users':[{ 'username': req.user}]})
    trip : req.user
  });
});

// =====================================
// DASHBOARD ===========================
// =====================================
app.get('/myTrips', isLoggedIn, function(req, res)
{
  //console.log(trip.tripName);
  Trip.find({ $or: [{ 'users': [{ 'username' : req.user.local.username}]}, {'owner': req.user.local.username}]}, function(err, theTrips)
  //Person.findOne({}, function(err, person)
  {
    res.render('mytrips.ejs', {
      user : req.user,
      //trip : JSON.stringify(theTrips),
      trip : theTrips,
      check : req.user
    });
  });
  /*
  var num = { number : 2};
  var test = Person.findOne({'local.username': 'carlin'});
  var tripJSON = [];
  Trip.find()
  res.render('mytrips.jade', {
    user : req.user
    //trip : Trip.findOne({ 'users':[{ 'username': 'carlin'}]}),
    //trip : Trip.find({ 'users':[{ 'username': 'carlin'}]}, function(err,result){res.json(result);}),
    //trip : Trip.findOne().lean(),
    //check : Person.findOne().lean().exec(function(err, docs){return docs.toJSON()})
    //check : Person.findOne().raw()
  });*/
});

app.get('/newTrip', function(req,res)
{
  res.render('newtrip.ejs', {
    user : req.user
  });
});

app.post('/newTrip', function(req, res){
  //req.body.users.push({username: req.user.local.username});

  //console.log(req.body);
  //req.body.users = [{username: req.user.local.username}];
  //delete req.body.users[0]._id;
  console.log(req.body);
  //var tripJSON = req.body;
  var tripModel = new Trip(req.body);
  //console.log(tripJSON.tripName);
  console.log(req.user.local.username);
  //tripModel.remove()
  //tripModel.update({'tripName': tripJSON.tripName},{$set:{'users':[{'username': req.user.local.username}]}});
  tripModel.save(function(err)
  {
    //Trip.update({'tripName': tripJSON.tripName},{$set:{'users':[{'username': req.user.local.username}]}});

  });
  //tripModel.update({'tripName': tripJSON.tripName},{$set:{'users':[{'username': req.user.local.username}]}});
  //Trip.update({'tripName': tripJSON.tripName},{$set:{'users':[{'username': req.user.local.username}]}});
  res.redirect('/tripSuggest');
});

app.get('/tripSuggest', function(req, res){
  Trip.findOne({'owner': req.user.local.username}, function(err, trip)
  {
    console.log(trip);
    console.log(trip.budget);
    console.log(trip.origin);
    Destination.find({$and:[{'JetBlue Package Price/Person': {$lt: trip.budget}}, {'Origin' : trip.origin}]}, function(err, packages)
    {
      console.log(packages);
      if(err)
      {
        res.redirect('/myTrips');
      }
      res.render('suggestions.ejs',
      {
        package : packages
      });
    });
  });
});

app.post('/theTrip', function(req, res){
  console.log(req.body._id);
  var objid = req.body._id;
  Destination.findOne({_id: ObjectId(objid)}, function(req,dest){
    res.render('theTrip.ejs',
    {
      trip : dest
    });
  });
});

// =====================================
// LOGOUT ==============================
// =====================================
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/contactus', function(req, res)
{
  res.sendfile('public_html/contactus.html');
});
app.get('/about', function(req, res)
{
  res.sendfile('public_html/about.html');
});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
  return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}
