const handleError = (message) => {
  $("#errorMessage").text(message);
  console.log("handleError function is WIP");
  console.log(message);
};

const redirect = (response) =>{
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) =>{
    
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