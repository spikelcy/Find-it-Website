
/**
 * Created by Hailie on 4/16/2017.
 */

var mongoose = require('mongoose');
var Place = mongoose.model('Place');
var Person = mongoose.model('Person');
var Comment = mongoose.model('Comment');


var findOnePlace = function(req,res){
    var PlaceInx = req.params.id;

    Place.findById(PlaceInx,function(err,place){
        if(!err){
            res.send(place);
        }else{
            res.sendStatus(404);
        }
    });
};

//find places by text
var findPlacesByText = function(req,res){
  var usercheck = 1;
  if(!req.user){
    usercheck = 0
    console.log("no user");
  }
  console.log(req.param("searchcontent"));
  //if blank input
  if(!req.query.searchcontent){
    Place.find({},function(err,place){
      if(!err){
        res.render("textsearchresult.ejs",{PlaceData:place, LoggedIn : usercheck});

      }else {
        res.redirect("/Search");
      }
    });
  }else {
  //regex to do string search in mongodb
    var inputregex = { $regex: req.query.searchcontent, $options: 'i'};
    Place.find({ $or:[{tags :{$elemMatch: {name:inputregex}}},{address:inputregex},{name:inputregex}]}, function (err, place) {
      if (!err) {
        if(!place.length){
          var oristring = req.query.searchcontent;
          var sub = oristring.substring(0,3);
          var match = {$regex: sub, $options: 'i'};
          console.log(sub);
          Place.find({$or:[{tags :{$elemMatch: {name:match}}},{address:match},{name:match}]}, function (err, places){
            if(!err){
              res.render("noresult.ejs",{PlaceData : places,LoggedIn:usercheck});
            }else{
              res.redirect("/Search");
            }
          });
        }else{
          console.log("find matching");
          res.render("textsearchresult.ejs", {PlaceData: place,LoggedIn:usercheck});
        }

      } else {
        console.log(err);
        res.redirect("/Search");
      }
    });

  }
};

// Used to find places by tags and show result
var findPlacesByTags = function(req,res){
  var usercheck = 1;
  if(!req.user){
    usercheck = 0
    console.log("no user");
  }
 Place.find({tags: {$elemMatch: {name:req.params.tag}}},(function(err,place){
   if(!err){
     console.log(place);
     res.render("textsearchresult",{PlaceData:place,LoggedIn:usercheck});

   }else {
     res.redirect("/Search");
   }
 }));

};





// save place to database
var saveToMyStuff = function(req,res){
  var personid = req.user._id;
  var placeid=req.params.id;
  Place.findByIdAndUpdate(placeid,{$inc:{"tags.count":1}},{new:true},function(err,place){
    console.log("add tag count successfully");
  });
  Person.findOneAndUpdate({_id:personid},
    {$addToSet:{"myplaces":placeid}},  function (err, data) {
      if(err) {
        res.status(500).json({'error' : 'error in adding'});
      }
      res.send("Added Successfully!");

    });

};






var renderSearchPage = function(req,res){
  var usercheck = 1;
  if(!req.user){
    usercheck = 0
    console.log("no user");
  }
  res.render("Search",{
    usercheck:usercheck
  });
};

//seecomments/:id
var seeplacecomments = function(req,res){
  Comment.findById(req.params.id,function(err,comment){
    if(!err){
      res.send(comment);
    }else{
      res.sendStatus(404);
    }
  });
};









module.exports.findOnePlace = findOnePlace;
module.exports.findPlacesByText = findPlacesByText;
module.exports.findPlacesByTags = findPlacesByTags;

module.exports.saveToMyStuff = saveToMyStuff;
module.exports.renderSearchPage = renderSearchPage;
module.exports.seeplacecomments = seeplacecomments;






