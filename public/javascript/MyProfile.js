//search function
$("#contact-list-search").on("keyup", function() {
  var g = $(this).val().toLowerCase();
  $('.list-group .list-group-item .name').each(function() {
    var s = $(this).text().toLowerCase();
    $(this).closest('.list-group-item')[s.indexOf(g) !== -1 ?
      'show' :
      'hide']();
  });
});





// voting buttons

function SubmitRatingVote(id,val){


  var rating = 0;
  if(id == 'uprate'+val){
    if($('#uprate'+val).hasClass('active')){
      rating = 0;
    }else{
      if($('#downrate'+val).hasClass('active')){
        $('#downrate'+val).removeClass('active')
        $('#uprate'+val).addClass('active')
      }else {
        $('#uprate'+val).addClass('active')
      }
      rating = 1;
    }
  }
  if(id == 'downrate'+val){
    if($('#downrate'+val).hasClass('active')){
      rating = 0;
    }else{
      if($('#uprate'+val).hasClass('active')){
        $('#uprate'+val).removeClass('active')
        $('#downrate'+val).addClass('active')
      }else {
        $('#downrate'+val).addClass('active')
      }
      rating = 2;
    }
  }
  var doc= {
    "rating" :rating
  }

  $.ajax({
    url: "/api/comment/updaterating/"+ val,
    type: 'PUT',
    contentType:'application/json',
    data: JSON.stringify(doc),
    dataType:'json'
  });
}


//delete button

Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
  for (var i = this.length - 1; i >= 0; i--) {
    if (this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
}

//Delete a friend
$('button[name="delete"]').on('click', function(e) {
  document.getElementById($(this).closest('li').attr('id')).remove();
  var id = $(this).attr('value');
  $.ajax({
        url: "/api/removefriend/" + id ,
        type: 'PUT'
    });

})

//Delete a place from array
$('button[name="deleteplace"]').on('click', function(e) {
    document.getElementById($(this).closest('li').attr('id')).remove();
    var id = this.value;
    $.ajax({
        url: "/api/removecomment/" + id ,
        type: 'PUT'

});

})

// update a review
function Updatereview(id){
  console.log(id);
  var text = document.getElementById("textarea"+id).value;
  var doc = {
    "review_text": text

  };
  $.ajax({
     url: "/api/comment/update/"+ id,
    type: 'PUT',
    contentType:'application/json',
   data: JSON.stringify(doc),
   dataType:'json'
  });
  window.location.reload(true);
}



// if nothing....
if (!$("#contact-list").has("li").length) {
  document.getElementById("contact-list").innerHTML =
    "Oh No!You have no friends!";
}


// Change password and show confirmation or error
function SubmitPasswordData(){
  var oldpass= document.getElementById("oldpass").value;
  var newpass = document.getElementById("newpass").value;
  var doc = {
    "oldpass": oldpass,
    "newpass": newpass


  };
  $.ajax({
    url: "/api/updatepassword",
    type: 'POST',
    contentType:'application/json',
    data: JSON.stringify(doc),
    dataType:'json',
    error: function(error) {
      if (error.responseText == 'showAlert')
      BootstrapDialog.alert({
        title: 'Password Error',
        message: 'Make sure to enter your old password!'
      });
    },
    success: function(data) {
      if (typeof data.redirect == 'string') {
        BootstrapDialog.alert({
          title: 'Password Changed',
          message: 'Your password has changed!'
        });
        window.location = data.redirect
      }
    }
  });
}

//Check if username is in use
$('input[name=username]').on('change', function(){
  var user = document.getElementById("username").value;
  $.ajax({
    url: "/api/checkusername/"+user,
    type: 'PUT',
    success: function(data) {
      if (data.status == "Taken") {
        BootstrapDialog.alert({
          title: 'Username Error',
          message: 'That Username has been taken!'
        });
      }
    }
  });
});
