/**
 * Created by spike on 24/4/2017.
 */

// Send login data to database for check
function SubmitLoginData(){
  var id= document.getElementById("id").value;
  var pass = document.getElementById("pass").value;
  var doc = {
    "Username": id,
    "password": pass

  };
  $.ajax({
    url: "/api/login",
    type: 'POST',
    contentType:'application/json',
    data: JSON.stringify(doc),
    dataType:'json',
    error: function(error) {

      if (error.responseText == 'showAlert')
        BootstrapDialog.alert({
          title: 'Log In',
          message: 'Incorrect user or password'
        });

    },
    success: function(data) {

      if (typeof data.redirect == 'string') {
        window.location = data.redirect

      }
    }
  });


}

// show user submitted profile picture
function readURL(input){
  if(input.files && input.files[0]){
    var reader = new FileReader();

    reader.onload = function(e){
      $('#display-image')
        .attr('src', e.target.result)
        .width(220)
        .height(200);
    };

    reader.readAsDataURL(input.files[0]);

  }
}
