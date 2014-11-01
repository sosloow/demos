function toBeer(money, cost){ 
  var tare = Math.floor(Math.random()*5);
  var phrase = Math.floor(Math.random()*5);
  var liters = Math.round((parseInt(money) / cost)*10)/10;
  var term;
  var string;
  if(isNaN(liters)){ liters = 0 };
  if(liters > 1000){
    return "Это ж дофига пива!"
  }
  else if(liters == 0){
    return "На столько ты пива не купишь"
  }
  else if(liters > 10){
    liters = Math.round(liters) 
  }
  var halves = liters*2;
  
  switch(tare){
  case 0:
    if(halves.toString().match(/1$/)){
      term = "ка"
    } 
    else if(halves % 10 < 5 && halves % 10 > 0 && (halves > 20 || halves < 10)){
      term = "ки"
    }
    else{
      term = "ок"
    };
    string = halves + " бан" + term;
    break;
    
  case 1:
    if(liters.toString().match(/1$/)){
      term = "ка"
    } 
    else if(liters % 10 < 5 && liters % 10 > 0 && (liters > 20 || liters < 10)){
      term = "ки"
    }
    else{
      term = "ок"
    };
    string = liters + " бутыл" + term
    break;
    
  case 2:
    if(liters.toString().match(/1$/)){
        term = ""
    } 
    else if(liters % 10 < 5 && liters % 10 > 0 && (liters > 20 || liters < 10)){
      term = "а"
    }
    else{
      term = "ов"
    };
    string = liters + " литр" + term
    break;
    
  default:
    if(halves.toString().match(/1$/)){
      term = "ка"
    } 
    else if(halves % 10 < 5 && halves % 10 > 0 && (halves > 20 || halves < 10)){
      term = "ки"
    }
    else{
      term = "ек"
    };
    string = halves + " круж" + term;
  };
  
  switch(phrase){
  case 0:
    string += " пенистого пива"
    break;
  case 1:
    string += " свежего, холодного пива"
    break;
  case 2:
    string += " холодненького пива"
    break;
  default:
    string = "Это ж " + string + " пива!"
  };
  return string;
};


function count(){
  $("#bottles").hide("fast", function(){
    $("#output").text(toBeer($("#main-input").val(), 50));
  });
  $("#bottles").slideDown("normal");
};

$(function(){
  $("#bottles").hide();
});
