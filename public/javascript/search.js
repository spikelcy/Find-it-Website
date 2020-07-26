$(document).ready(function(){
  //update on 5/3/2017: delete all original stuff
  // restrict the search input type
  // not sure does it work or not??
  //how to correctly ref the js file
  $.getScript("jquery.alphanum.js", function(){
    $("#searchinput").alphanum({
      allowNumeric : true,
      allowupper : true,
      allowlower : true,
      allowNewline: false,
      allowspace : true,
      allow :"-,/"
    });
  });

});