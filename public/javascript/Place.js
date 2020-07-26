


var modal = document.getElementById('myModal');

var btn = document.getElementById("myBtn");

var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }

}
// voting buttons

$('#uprate').click(function(){
  if($(this).hasClass('active')){
    $(this).removeClass('active')
  } else {
    if($('#downrate').hasClass('active')){
      $('#downrate').removeClass('active')
      $(this).addClass('active')
    }else {
      $(this).addClass('active')
    }
  }
});

$('#downrate').click(function(){
  if($(this).hasClass('active')){
    $(this).removeClass('active')
  } else {
    if($('#uprate').hasClass('active')){
      $('#uprate').removeClass('active')
      $(this).addClass('active')
    }else {
      $(this).addClass('active')
    }
  }
});

//write review
function SubmitCommentData(){
    var address = document.getElementById("address").value;
    var place_id = document.getElementById("place_id").value;
    var text = document.getElementById("textarea").value;
    var rating = 0

// check which button user pressed
    if($('#uprate').hasClass('active')){
      rating = 1;
    }else if($('#downrate').hasClass('active')){
        rating = 2;
    }
    var doc = {
        "rating": rating,
        "address": address,
        "review_text": text,
        "place_id": place_id
    };


    $.ajax({
        url: "/api/comment",
        type: 'POST',
        contentType:'application/json',
        data: JSON.stringify(doc),
        dataType:'json',
        error: function(error) {
        if (error.responseText == 'showAlert')
          BootstrapDialog.alert({
            title: 'Review Error',
            message: 'You have already written a review!'
          });
      }
    });
    location.reload(true);


}

// Send report trigger to database
function SendReport(val){
  $.ajax({
    url: "/api/addReport/" + val,
    type: 'PUT',
    contentType: 'application/json',
    success: function (data) {
      if (data.success == "done") {
        BootstrapDialog.alert({
          title: 'Report Status',
          message: 'Report Success!'
        });
      }
    }
  });
}
// add or remove place to user's saved places
$('#save').on('click',function(e){
  var id = $(this).attr('value');

  //check if user has place saved, if so delete else add.
  if($(this).hasClass('active')){
    $(this).removeClass('active');
    $.ajax({
      url: "/api/removemystuff/" + id ,
      type: 'PUT'
    });
    document.getElementById('save').innerHTML = '<i class="fa fa-user" aria-hidden="true"></i> Save';
  }else {
    $(this).addClass('active');
    document.getElementById('save').innerHTML = '<i class="fa fa-user" aria-hidden="true"></i> Saved';
    $.ajax({
      url: "/api/savemystuff/" + id,
      type: 'PUT'
    });
  }

});

// display modal to ask user to log in
$('#LogInFirst').on('click', function(e) {
  BootstrapDialog.alert({
    title: 'Log In',
    message: 'Please Log In First'
  });


})
