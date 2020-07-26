/**
 * Created by spike on 12/4/2017.
 */


var express = require('express');
var router = express.Router();
var multer  = require('multer');
var storage = multer.diskStorage({
  dest: __dirname + '../public/uploads/',

    //filename changes it to a png file
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.png')
    }
})
var upload = multer({ storage: storage });

// Controllers
var controller = require('../controllers/usercontroller.js');
var commentcontroller = require('../controllers/commentcontroller.js');
var placecontroller = require('../controllers/placecontroller.js');
var searchcontroller = require('../controllers/searchcontroller.js')
var mystuffcontroller = require('../controllers/mystuffcontroller.js');
var featuredController = require('../controllers/featuredController.js')

// RENDERING ROUTES

// Render Sign Up page
router.get('/SignUp', controller.renderSignUpPage);

router.post('/SignUp',function(req,res){
  console.log(req.body);
  res.send('Welcome to Find It!');
});

//render my profile with data
router.get('/MyProfile',controller.requireLogin, controller.renderpage);

//render my profile with data
router.get('/MyProfile/password',controller.requireLogin, controller.renderprofilepass);

//render other profile with data
router.get('/OtherProfile', controller.renderotherpage);

//Render place page
router.get('/Place',placecontroller.renderplacepage);

//render search page
router.get('/Search', searchcontroller.renderSearchPage);

// Render featured page
router.get('/featured', featuredController.renderFeatured);

// Render MyStuff page
router.get('/MyStuff',controller.requireLogin, mystuffcontroller.rendermypage);

//text search
router.get('/textsearch',searchcontroller.findPlacesByText);

//find places by tags
router.get('/tagsearch/:tag',searchcontroller.findPlacesByTags);

//Add place page
router.get('/addPlace',controller.requireLogin, placecontroller.renderAddPlace);


//////////

//USER FUNCTIONS

// Create new person
router.post('/api/newUser',upload.single('file'),controller.createPerson);

// Find one person by id
router.get('/api/person/:id',controller.findOnePerson);

//update person
router.post('/api/updateperson',controller.findOnePersonAndUpdate);

//update password
router.post('/api/updatepassword',controller.updatepassword);

//find any delete friend
router.put('/api/removefriend/:id',controller.findFollowAndRemove);

//uploads picture
router.post('/api/updatepic/:id',upload.single('file'),controller.findPicAndUpdate);

//remove comment from array.
router.put('/api/removecomment/:id',controller.findCommentAndRemove);

//add follow to array.

router.put('/api/add/:id',controller.findFollowAndAdd);

//Login
router.post('/api/login',controller.Login);

//logout
router.get('/api/logout',controller.Logout);

//remove place from myplaces
router.put('/api/removemystuff/:id',controller.RemoveFromMyStuff);

//Check if username has been taken
router.put('/api/checkusername/:username',controller.checkusername);

//////////

//COMMENT FUNCTIONS

// Create new comment
router.post('/api/comment',commentcontroller.createComment);

// Find all comments
router.get('/api/comment',commentcontroller.findAllComments);

// Find one comment by id
router.get('/api/comment/:id',commentcontroller.findOneComment);

//remove a comment
router.put('/api/comment/remove/:id',commentcontroller.findOneCommentAndRemove);

//update a comment
router.put('/api/comment/update/:id',commentcontroller.findOneCommentAndUpdate);

//update rating
router.put('/api/comment/updaterating/:id',commentcontroller.UpdateRating);

////////

//PLACES FUNCTIONS


// Create new place
router.post('/api/place/create',upload.single('file'),placecontroller.createPlace);

// Find all places
router.get('/api/place',placecontroller.findAllPlaces);

//add Report
router.put('/api/addReport/:id',placecontroller.addreport);

////////



//SEARCH FUNCTIONS



//text search
router.get('/api/search/:searchcontent',searchcontroller.findPlacesByText);

//find one place by id
router.get('/api/findplace/:id',searchcontroller.findOnePlace);

//method to save to database
router.put('/api/savemystuff/:id',searchcontroller.saveToMyStuff);

//text search
router.get('/textsearch',searchcontroller.findPlacesByText);

//find comments by id
router.get('/api/seecomments/:id',searchcontroller.seeplacecomments);

//////////

//FEATURED FUNCTIONS
router.get('/api/featured/topThreePlaces', featuredController.renderFeatured2);

//////////

//MYSTUFF FUNCTIONS
router.get('/api/MyStuff/data',mystuffcontroller.findAllPlaces);
router.put('/api/MyStuff/remove/:id', mystuffcontroller.findAndRemove);
router.get('/api/MyStuff/top', mystuffcontroller.findTopThree);
router.get('/api/MyStuff/:id', mystuffcontroller.findOnePlace);

//////////

module.exports = router;