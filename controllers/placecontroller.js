/**
 * Created by spike on 16/4/2017.
 */

var mongoose = require('mongoose');
var Place = mongoose.model('Place');
var Comment = mongoose.model('Comment');
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'hkily5yb6',
  api_key: '829662555852782',
  api_secret: '0D7Fn3EqcANVIkMO4Jcc2xmNoTA'
});

// create place in collection
var createPlace = function(req,res){

  var newTags = req.body.tags;
  var user = 0;
  if(req.user){
    user = 1;
  }
  // upload img to cloud, create new place document
  cloudinary.uploader.upload(req.file.path, function(result) {
    console.log(result.secure_url);
    var place = new Place({
      "name":req.body.name,
      "address":req.body.address,
      "google_id" : req.body.google_id,
      "tags":req.body.newTags,
      "report" : 0,
      "likes" : 0,
      "img" : result.secure_url,
      "img_id" : result.public_id

    });


    for(var i=0; i<newTags.length; i++){
      console.log(newTags[i]);
      var sameTag=0;
      if(newTags[i]!=""){
        console.log('found tag...');
        var tag={"name":newTags[i], "count":1}; //error with this line
        console.log('details:');
        console.log(tag);

        //check if duplicate tags have been selected
        for(var j=0; j<place.tags.length; j++){
          if(tag.name==place.tags[j].name){
            sameTag=1;
            console.log('duplicate tag detected!');
          }
          console.log(place.tags[j]);
        }

        //only add tag if it's not a duplicate
        if(sameTag==0){
          place.tags.push(tag);
          console.log('place tags:');
        }

        sameTag=0;

      }
    }

    place.save(function(err,newComment){
      if(!err){
        res.redirect('/');
      }else{
        res.sendStatus(400);
      }
    });

  },{ invalidate: true });

};

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


// Render place
var renderplacepage = function(req,res){
    var placeInx = req.query.pid;
    console.log(placeInx);
    var user = 0;
    if(req.user){
      user = 1;
    }
  //check if place is in session user's mystuff
  function inArray(id,array)
  {
    var count=array.length;
    for(var i=0;i<count;i++)
    {
      if(array[i]===id){return 1;}
    }
    return 0;
  }
    Place.findById(placeInx, function(err, place) {
      if (!err) {
        var mystuff = 0;
        if(req.user){
          mystuff = inArray(placeInx,req.user.myplaces);
        }
            res.render("Place", {
                aplace: place,
                LoggedIn :user,
                Saved: mystuff
            });


        } else {
            console.log("error");
        }
    });
};


// render add place page
var renderAddPlace = function(req,res){

  var names=[];
  var addresses=[];

  Place.find(function(err,place){
    if(!err){
      //had to do this since js functions wont take the id
      for(var i=0;i<place.length;i++){
        names[i]='"'+place[i].name+'"';
        addresses[i]='"'+place[i].address+'"';
      }

      res.render("addPlace", {
        NameData: names,
        AddressData: addresses,
      });
    }else{
      res.sendStatus(404);
    }
  });

};

// increase report count
var addreport = function(req,res){
  var placeinx = req.params.id;
  console.log(placeinx);
  Place.findOneAndUpdate({_id:placeinx},
    {$inc: {'report': 1}},  function (err, data) {
      if(err) {
        return res.status(500).json({'error' : 'error in reporting'});
      }
      res.send({success:"done"})
    });
}


module.exports.renderAddPlace = renderAddPlace;
module.exports.createPlace = createPlace;
module.exports.findAllPlaces = findAllPlaces;
module.exports.renderplacepage = renderplacepage;
module.exports.addreport =addreport;