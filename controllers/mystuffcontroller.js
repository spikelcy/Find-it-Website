/**
 * Created by spike on 16/4/2017.
 */

var mongoose = require('mongoose');
var Place = mongoose.model('Place');
var Person = mongoose.model('Person');
var Comment = mongoose.model('Comment');

//find all places
var findAllPlaces = function(req,res){
  Place.find(function(err,places){
    if(!err){
      res.send(places);
    }else{
      res.sendStatus(404);
    }
  });
};

// Find one place
var findOnePlace = function(req,res){
  var PlaceInx = req.params.id;
  Place.findById(PlaceInx,function(err,place){
    if(!err){
      console.log(place);
      res.send(place);
    }else{
      res.sendStatus(404);
    }
  });
};


//Render My stuff
var rendermypage = function(req,res){
      res.render("MyStuff", {
        PersonData: req.user
      });
};



//Find top 3
var findTopThree = function(req, res) {
  Place.find({address: 'address'}).sort({viewCount: -1}).limit(3).exec(
    function(err, places) {
      if (!err) {
        res.render("MyStuff", {
          PlaceData: place
        });
      } else {
        console.log("error");
      }

    }
  );

};

//Remove place from user's mystuff
var findAndRemove = function(req,res){
  var Inx = req.params.id;
  console.log(Inx);
  Person.findOneAndUpdate({_id:req.user._id},
    {$pull: {'myplaces': Inx}},  function (err, data) {
      if(err) {
        return res.status(500).json({'error' : 'error in deleting'});
      }else{
        res.end('{"success" : "Updated Successfully", "status" : 200}');
      }


      console.log(data);
    });
};


module.exports.findAllPlaces = findAllPlaces;
module.exports.findOnePlace = findOnePlace;
module.exports.rendermypage = rendermypage;
module.exports.findTopThree = findTopThree;
module.exports.findAndRemove = findAndRemove;