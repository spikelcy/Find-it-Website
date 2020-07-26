//changes display image

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


//checks that the confirmed password in the same
function confirmPassword(){
  var passwordA=document.getElementById('password');
  var passwordB=document.getElementById('password-confirm');
  if(passwordA.value==passwordB.value){
    passwordB.className='true';
    return true;
  }
  BootstrapDialog.alert({
    title: 'Incorrect password',
    message: 'Passwords must match'
  });
  passwordB.className='false';
  return false;
}

/*genral input check - changes class name to false if incorrect input*/
function checkInput(a){
  var specialChars ="{}()[]\\%'\"*:<>&;?=";

  for(var i=0;i<specialChars.length; i++){
    if(a.value.indexOf(specialChars.charAt(i))!=-1){

      BootstrapDialog.alert({
        title: 'Special character "'+specialChars.charAt(i)+'" detected',
        message: 'No special characters allowed. \n\n Special characters are {}()[]\\%\'"*:<>&;?='
      });

      a.className='false';
      return false;
    }
  }

  a.className='true';
  return true;
}

/*address input check -  changes class name to false if incorrect input*/
function checkInputAddress(a){
  var specialChars ="{}()[]\\%\"*:<>&;?=";

  for(var i=0;i<specialChars.length; i++){
    if(a.value.indexOf(specialChars.charAt(i))!=-1){

      BootstrapDialog.alert({
        title: 'Special character "'+specialChars.charAt(i)+'" detected',
        message: 'No special characters allowed. \n\n Special characters are {}()[]\\%"*:<>&;?='
      });

      a.className = 'false';
      return false;
    }
  }

  a.className='true';
  return true;
}

//returns false if some fields are incorrect
function verifyForm(){
  var errors = document.getElementsByClassName('false');
  if(errors.length>0){

    BootstrapDialog.alert({
      title: 'Incorrect input',
      message: 'Fields with incorrect input are highlighted in red'
    });

    return false;
  }

  return true;
}

//checks if the username is already being used
function verifyUsername(a,data){
  var state = checkInput(a);

  if(state==false){
    return false;
  }else{

    for(var i=0;i<data.length;i++){

      if(a.value==data[i]){
        alert('This username is taken!');
        a.className='false';
        return false;
      }
    }
    a.className=='true';
    return true;
  }

}

//final check if the place is valid.
//check if place is already in database.
function validatePlace(namedata,addressdata){
  var name=document.getElementById('placename');
  var address = document.getElementById('autocomplete');

  //the length should be the same since they are from the same data
  if(namedata.length!=addressdata.length){
    alert('Have you been editing with the inspect element...');
    return false;
  }else{
    //check if form inputs are valid
    if(!verifyForm()){
      return false;
    }else{

      //check if already in db (checks for a place with same name and address)
      for(var i=0;i<namedata.length;i++){
        if((name.value.toLowerCase()==namedata[i].toLowerCase())&&(address.value.toLowerCase()==addressdata[i].toLowerCase())){
          BootstrapDialog.alert({
            title: 'This place already exists!',
            message: 'It seems someone was a bit faster than you and created this place first...\nThanks for trying though!\nWe appreciate all contributions to our website ^.^'
          });
          return false;
        }
      }
    }
  }
  return true;
}