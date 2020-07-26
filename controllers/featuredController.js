/**
 * Created by Jane on 26/04/2017.
 *            An on 30/04/2017
 */
/** UPDATES
 * CSS: #featuredSlides
 * ejs;
 */

var mongoose = require('mongoose');
var Place = mongoose.model('Place');
var Person = mongoose.model('Person');

var renderFeatured = function(req,res){
  var topThreeCommenters =[];
  Person.find(function(err,persons){
    if(!err){
      var user = 0;
      if(req.user){
        user = 1;
      }
      //for all people in db
      for(var i=0; i<persons.length; i++){
        console.log(persons[i].Username);

        //check if the user has comments
        if(persons[i].comments.length!=0){
          console.log('has comments');

          //check if user has more comments than current top 3
          for(var j=0; j<3; j++){
            //a spot in top three is empty!
            if(topThreeCommenters[j]==null){
              console.log('j:'+j );
              topThreeCommenters[j]=persons[i];
              console.log('top commentor is now '+persons[i].Username);
              break;
            }else{
              //has more comments than someone in top 3
              if(persons[i].comments.length>topThreeCommenters[j].comments.length){
                console.log('this person has more comments!');
                for(var k=2; k>j; k--){
                  topThreeCommenters[k]=topThreeCommenters[k-1];
                }
                topThreeCommenters[j]=persons[i];
                console.log('top commentor '+j+ ' is now '+persons[i].Username);
                break;
              }
            }
          }
        }
      }
    }else{
      console.log('error');
    }
    //If it's not in the Person.find function, topThreeCommenters gets erased
    //anyone know a way to fix this so we can render out of Person.find()?
    console.log(topThreeCommenters.length+"/3 top commenters");
    res.render("featured",{
      topThree: topThreeCommenters,
      //CHANGES STARTING HERE
      latest: persons[persons.length-1],
      len: persons[persons.length-1].myplaces.length -1,
      follow: persons[persons.length-1].myplaces,
      LoggedIn : user
    });
    console.log(persons[persons.length-1].myplaces.length -1);
    console.log(persons[persons.length-1].myplaces);
  });
}


// UPDATE HERE TO RENDER CONTACT PAGE
var renderContact = function(req,res){
  res.render("contact",{});
};

// LATEST UPDATE FROM HERE TO FIND TOP 3 PLACES

var renderFeatured2 = function(req,res){
  var topThreePlaces =[];
  Place.find(function(err,places){
    if(!err){

      //for all places in db
      for(var i=0; i<places.length; i++){
        console.log(places[i]._id);

        //check if the likes valid
        if(places[i].likes>=0){
          console.log('valid likes');

          //check if the Place has more likes than current top 3
          for(var j=0; j<3; j++){
            //a spot in top three is empty!
            if(topThreePlaces[j]==null){
              console.log('j:'+j );
              topThreePlaces[j]=places[i];
              console.log('top places is now '+places[i]._id);
              break;
            }else{
              //has more likes than place in top 3
              if(places[i].likes>topThreePlaces[j].likes){
                console.log('this place has more likes!');
                for(var k=2; k>j; k--){
                  topThreePlaces[k]=topThreePlaces[k-1];
                }
                topThreePlaces[j]=places[i];
                console.log('top place '+j+ ' is now '+places[i]._id);
                break;
              }
            }
          }
        }
      }
    }else{
      console.log('error');
    }
    //Send the topThreePlaces
    console.log(topThreePlaces.length+"/3 top places");
    res.send(topThreePlaces);
  });
}


module.exports.renderFeatured = renderFeatured;
module.exports.renderFeatured2 = renderFeatured2;
module.exports.renderContact = renderContact;
