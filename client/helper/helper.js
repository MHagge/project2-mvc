const handleError = (message) => {
  //grab and set errorMessage in the html
  $("#errorMessage").text(message);
  //make error message visable and move to animate
  $("#errorMessage").css("opacity","1");
  $("#errorMessage").css("height","50px");

  console.log(message);
};

const redirect = (response) =>{
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) =>{
  //console.dir(data);
  //console.dir(action);
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function(xhr, status, error){
      const messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};