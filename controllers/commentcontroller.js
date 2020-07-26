/**
 * Created by spike on 15/4/2017.
 */


var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var Place = mongoose.model('Place');
var Person = mongoose.model('Person');

//Create comment
var createComment = function(req,res){
   console.log(req.body.rating);
   Comment.findOne({person_id :req.user_id,place_id : req.body.place_id}, function(err,doc)
     {
      if(doc){
        res.send(500,'showAlert');
      }else{
        var comment = new Comment({
          "address":req.body.address,
          "rating":req.body.rating,
          "place_id" : req.body.place_id,
          "person_id":req.user._id,
          "review_text":req.body.review_text

        });
        comment.save(function(err,newComment){
          if(!err){
            Place.findByIdAndUpdate(req.body.place_id,
              {$addToSet:{"comments":newComment._id}},  function (err, data) {
                if(err) {
                  res.status(500).json({'error' : 'error in adding'});
                }
              });
            // Change the place's likes based on rating
            if(req.body.rating == 2 ){
              Place.findByIdAndUpdate(req.body.place_id,{$inc:{"likes":-1}},{new:true},function(err,place){
                console.log("change to downvote");
              });
            }else if(req.body.rating == 1 ){
              Place.findByIdAndUpdate(req.body.place_id,{$inc:{"likes":1}},{new:true},function(err,place){
                console.log("changed to upvote");
              });
            }
            // add the comment id to session user's comment array
            Person.findByIdAndUpdate(req.user._id,
              {$addToSet:{"comments":newComment._id}},  function (err, data) {
                if(err) {
                  res.status(500).json({'error' : 'error in adding'});
                }
              });
            res.send(newComment);
          }else{
            res.sendStatus(400);
          }
        });
      }

     });
};

//Find all comments
var findAllComments = function(req,res){
    Comment.find(function(err,comments){
        if(!err){
            res.send(comments);
        }else{
            res.sendStatus(404);
        }
    });
};

//Find a comment
var findOneComment = function(req,res){
    var commentInx = req.params.id;
    Comment.findById(commentInx,function(err,person){
        if(!err){
            res.send(person);
        }else{
            res.sendStatus(404);
        }
    });
};

// Delete a comment
var findOneCommentAndRemove = function(req,res){
    var commentInx = req.params.id;
    Comment.findByIdAndRemove(commentInx, function(err, comment) {
        if (!err) {
            res.json("Deleted!");
        } else {
            console.log("error");
        }
    });



};

//Update a comment
var findOneCommentAndUpdate = function(req,res) {
    var commentInx = req.params.id;
    Comment.findOneAndUpdate({_id :commentInx},
        {
            $set: {
                "review_text": req.body.review_text
            }
        }, {new: true, upsert: true}, function (err, doc) {
            console.log(doc);

        });

};

// Updates the rating of a comment and adds the value to likes in relevant place doc
var UpdateRating = function(req,res) {
  var commentInx = req.params.id;
  Comment.findOne({_id :commentInx}, function (err, doc) {
    if(err){
      console.log(err)
    }else {
      if(doc.rating == 1 && req.body.rating == 2 ){
        Place.findByIdAndUpdate(doc.place_id,{$inc:{"likes":-2}},{new:true},function(err,place){
          console.log("change to downvote");
        });
      }else if(doc.rating == 2 && req.body.rating == 1 ){
        Place.findByIdAndUpdate(doc.place_id,{$inc:{"likes":2}},{new:true},function(err,place){
          console.log("changed to upvote");
        });
      }
      if(req.body.rating != 0) {
        doc.rating = req.body.rating;
        console.log(doc);
      }
    }
    doc.save(function(err,newComment){
      if(err){
        console.log(err);
      }

    });
    });



};




module.exports.createComment = createComment;
module.exports.findAllComments = findAllComments;
module.exports.findOneComment = findOneComment;
module.exports.findOneCommentAndRemove = findOneCommentAndRemove;
module.exports.findOneCommentAndUpdate = findOneCommentAndUpdate;
module.exports.UpdateRating =UpdateRating;


