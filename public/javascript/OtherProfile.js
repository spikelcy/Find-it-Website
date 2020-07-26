

// Function to add or remove a follow
$('#follow').on('click', function(e) {
  var id = $(this).attr('value');

    if($(this).hasClass('active')){
      $(this).removeClass('active');
      $.ajax({
        url: "/api/removefriend/" + id ,
        type: 'PUT'
      });
      document.getElementById('follow').innerHTML = 'Follow';
   }else{
      $(this).addClass('active');
      document.getElementById('follow').innerHTML = 'Followed';
      $.ajax({
        url: "/api/add/" + id ,
        type: 'PUT'
      });

}



})

// Log in notification
$('#LogInFirst').on('click', function(e) {
  BootstrapDialog.alert({
    title: 'Log In',
    message: 'Please Log In First'
  });


})

