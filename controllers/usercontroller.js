var mongoose = require('mongoose');
var Person = mongoose.model('Person');
var Place = mongoose.model('Place');
var Comment = mongoose.model('Comment')
var fs = require('fs');
var cloudinary = require('cloudinary');

// security info for image upload
cloudinary.config({
  cloud_name: 'hkily5yb6',
  api_key: '829662555852782',
  api_secret: '0D7Fn3EqcANVIkMO4Jcc2xmNoTA'
});


// function to render sign up
var renderSignUpPage = function(req,res){

  var usernames = [];

  Person.find(function(err,persons){
    if(!err){
      for(var i=0;i<persons.length;i++){
        usernames[i] = "'"+persons[i].Username+"'";
      }

      res.render("SignUp", {
        UsernameData: usernames,
      });
    }else{
      res.sendStatus(404);
    }
  });

}


// create a person document
var createPerson = function(req,res){

  // upload picture to cloud service then write person doc to mongo
  cloudinary.uploader.upload(req.file.path, function(pic) {
    var person = new Person({
      "Username":req.body.username,
      "postalcode":req.body.postcode,
      "email":req.body.email,
      "course":req.body.course,
      "password":req.body.password,
      "img": pic.secure_url,
      "img_id" : pic.public_id,

    });
    person.save(function(err,newPerson){
      if(!err){
        req.session.user = newPerson;
        console.log(req.session.user);
        res.redirect('/');
      }else{
        res.sendStatus(400);
      }
    });

  },{ invalidate: true });
};




// find a single person document
var findOnePerson = function(req,res){
    var personInx = req.params.id;
    Person.findById(personInx,function(err,person){
        if(!err){
            res.send(person);
        }else{
            res.sendStatus(404);
        }
    });
};



//Update key information of session user
var findOnePersonAndUpdate = function(req,res) {
  Person.findOneAndUpdate({_id:req.user._id},
            {
                $set: {
                    "Username": req.body.username,
                  "postalcode": req.body.postalcode,
                    "email": req.body.email
                }
            }, {returnNewDocument: true, upsert: true}, function (err, doc) {
      if(err) {
        return res.status(500).json({'error' : 'error in updating'});
      }else{
        res.redirect('/MyProfile');

      }
            });
};
// check if username is in use
var checkusername = function(req,res){
  Person.find({'Username': req.params.username}, function (err, doc) {
      if(err) {
        return res.send(500, 'Error');
      }else{
        if(!doc.length){
          res.send({status:'notaken'});
        }else{

          if(doc.Username == req.user.Username ){
            res.send({status:'notTaken'});
          }else{
            res.send({status:'Taken'});
          }
        }
      }
    });
};

//update password
var updatepassword = function(req,res) {
  console.log(req.body.oldpass);
  console.log(req.body.newpass);
  Person.findById(req.user._id,function(err,user){
    user.comparePassword(req.body.oldpass, function (err, isMatch) {
      if (err) {
        res.send(500, 'showAlert');
        console.log('Password error');
      } else {
        if (isMatch == true) {
          user.password = req.body.newpass;
          user.save(function (err, newPerson) { //this is for the new created person
            if (!err) {
              console.log(req.user);
              res.send({redirect: '/MyProfile'})
            } else {
              res.sendStatus(400);
            }
          })

        } else {
          res.send(500, 'showAlert');
          console.log('Password error');
        }

      }
    });
  });
}

// update profile img of user
var findPicAndUpdate = function(req,res) {

// delete old img in cloud
  cloudinary.uploader.destroy(req.user.img_id, function(result) { console.log(result) },
    { invalidate: true });

// upload new img to cloud and save path in mongo
  cloudinary.uploader.upload(req.file.path, function(result) {
    console.log(result.secure_url)
    Person.findOneAndUpdate( {_id:req.user._id},
      { $set: {'img': result.secure_url,'img_id' : result.public_id}}, {new: true,upsert : true}, function (err, doc) {
       console.log(doc);
        })
  },{ invalidate: true })
    res.redirect('/MyProfile');
};


// render user's profile page
var renderpage = function(req,res) {
  res.render("MyProfile", {
      PersonData: req.user,
    pageId :"profile"
    });
};

// render password part of user's profile
var renderprofilepass = function(req,res) {
  res.render("MyProfile", {
    PersonData: req.user,
    pageId :"password"

  });
};

//render profile page for other user's profile
var renderotherpage = function(req,res){
    var personInx = req.query.pid;
  function inArray(id,array)
  {
    var count=array.length;
    for(var i=0;i<count;i++)
    {
      if(array[i]===id){return 1;}
    }
    return 0;
  }
    Person.findById(personInx, function(err, person) {
      if (!err) {
        var user = false;
        var followed = 0;
        if(req.user){
          user = true ;
          followed = inArray(req.query.pid,req.user.follows);
        }

            console.log(followed);
            res.render("OtherProfile", {
                PersonData: person,
                Followed : followed,
                LoggedIn : user
            });


        } else {
            console.log("error");
        }
    });
};


// add another user to current user's follow list
var findFollowAndAdd = function(req,res){
    var personInx = req.params.id;
    Person.findOneAndUpdate({_id:req.user._id},
        {$push: {'follows': personInx}},  function (err, data) {
            if(err) {
                return res.status(500).json({'error' : 'error in adding'});
            }
            console.log(data);
            res.json(data);
        });
};

// remove from follow list
var findFollowAndRemove = function(req,res){
    var personInx = req.params.id;
    Person.findOneAndUpdate({_id:req.user._id},
        {$pull: {'follows': personInx}},  function (err, data) {
            if(err) {
                return res.status(500).json({'error' : 'error in deleting'});
            }
            console.log(data);
            res.json(data);
        });
};

// remove comment to current user's comment list
var findCommentAndRemove = function(req,res){
    var commentInx = req.params.id;
    // remove comment from array
    Person.findOneAndUpdate({_id:req.user._id},
        {$pull: {'comments': commentInx}},  function (err, data) {
            if(err) {
              console.log("error");
                res.send(500,'showAlert');
            }else{

              console.log('deleted comment');

            }

        });

  // remove comment from comment collection
  Comment.findById(commentInx, function(err, comment) {
    if (!err) {
      Place.findOneAndUpdate({_id:comment.place_id},
        {$pull: {'comments': commentInx}},  function (err, data) {
          if(err) {
            console.log("error");
            res.send(500,'showAlert');
          }else{
            console.log('deleted comment')
          }
        });
    } else {
      return res.send(500,'showAlert');
      console.log("error");
    }
  });
   Comment.findByIdAndRemove(commentInx, function(err, comment) {
     if (!err) {
     } else {
       res.send(500,'showAlert');
       console.log("error");
     }
   });
   res.send({success:'done'});
};



//login stuff
var Login = function(req,res){
    console.log(req.body.password);
    Person.findOne({ Username: req.body.Username }, function(err, user) {
        if (!user) {
          res.send(500,'showAlert');
          console.log('username error')
        } else {
          user.comparePassword(req.body.password, function(err, isMatch) {
            if (err){
              res.send(500,'showAlert');
              console.log('Password error');
            } else{
              if(isMatch == false){
                res.send(500,'showAlert');
                console.log('Password error');
              }else{
                req.session.user = user;
                res.send({redirect: '/'})
              }
            }
          });
        }
    });

};

// check if user is logged in, if not redirect to login page
function requireLogin (req, res, next) {
  if (!req.user) {

    res.redirect('LogIn');
  } else {
    next();
  }
};

 function Logout(req, res) {
  req.session.reset();
  res.redirect('/');
};

// remove place from user's saved spot
var RemoveFromMyStuff = function(req,res){
  var personid = req.user._id;
  var placeid=req.params.id;
  Place.findByIdAndUpdate(placeid,{$inc:{"tags.count":-1}},{new:true},function(err,place){
    console.log("add tag count successfully");
  });
  Person.findOneAndUpdate({_id:personid},
    {$pull:{"myplaces":placeid}},  function (err, data) {
      if(err) {
        res.status(500).json({'error' : 'error in adding'});
      }
      res.send({success:"deleted"});

    });

};

module.exports.createPerson = createPerson;

module.exports.findOnePerson = findOnePerson;
module.exports.findOnePersonAndUpdate = findOnePersonAndUpdate;
module.exports.renderpage = renderpage;
module.exports.findFollowAndRemove = findFollowAndRemove;
module.exports.findPicAndUpdate = findPicAndUpdate;
module.exports.findCommentAndRemove = findCommentAndRemove;
module.exports.renderotherpage = renderotherpage;
module.exports.findFollowAndAdd = findFollowAndAdd;
module.exports.Login = Login;
module.exports.requireLogin = requireLogin;
module.exports.Logout = Logout;
module.exports.updatepassword = updatepassword;
module.exports.renderprofilepass = renderprofilepass;
module.exports.renderSignUpPage = renderSignUpPage;
module.exports.RemoveFromMyStuff = RemoveFromMyStuff;
module.exports.checkusername = checkusername;