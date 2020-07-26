$(document).ready(function(){
  $('#search').click(function(){
    $('.searchresult').style.display = 'block';
  });
  $('.view').hover(
    function(){
      $(this).find('.caption').slideDown(250); //.fadeIn(250)
    },
    function(){
      $(this).find('.caption').slideUp(250); //.fadeOut(205)
    }
  );
  $('button[name="save"]').on('click',function(e){
    var id=$(this).attr('value');
    $.ajax({
      url:"/api/savemystuff/"+id,
      type:'PUT'
    });
    $(this).attr('title','Already saved to Mystuff');
    $(this).find('span').removeClass('fa fa-heart-o fa-2x');
    $(this).find('span').addClass('fa fa-heart fa-2x');
  });






});


