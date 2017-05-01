"use strict";

var handleLogin = function handleLogin(e) {
  e.preventDefault();

  //check fields
  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty");
    return false;
  }

  //console.log($("input[name=_csrf]").val());
  //ajax call
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();
  //check fields
  if ($("#user").val() == "" || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }
  //check fields
  if ($("#pass").val() != $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};

var renderLogin = function renderLogin() {
  $("#errorMessage").css("opacity", "0");
  $("#errorMessage").css("height", "0px");
  return React.createElement(
    "form",
    {
      id: "loginForm",
      name: "loginForm",
      onSubmit: this.handleSubmit,
      action: "/login",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "label",
      { htmlFor: "username" },
      "USERNAME"
    ),
    React.createElement("input", { name: "username", id: "username", type: "text", placeholder: "username" }),
    React.createElement(
      "label",
      { htmlFor: "password" },
      "PASSWORD"
    ),
    React.createElement("input", { name: "password", id: "password", type: "password", placeholder: "password" }),
    React.createElement("input", { name: "_csrf", type: "hidden", value: this.props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "SIGN IN" })
  );
};
var renderSignup = function renderSignup() {
  $("#errorMessage").css("opacity", "0");
  $("#errorMessage").css("height", "0px");
  return React.createElement(
    "form",
    {
      id: "signupForm",
      name: "signupForm",
      onSubmit: this.handleSubmit,
      action: "/signup",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "label",
      { htmlFor: "username" },
      "USERNAME"
    ),
    React.createElement("input", { id: "usernames", type: "text", name: "username", placeholder: "username" }),
    React.createElement(
      "label",
      { htmlFor: "pass" },
      "PASSWORD"
    ),
    React.createElement("input", { name: "pass", id: "pass", type: "password", placeholder: "password" }),
    React.createElement(
      "label",
      { htmlFor: "pass2" },
      "CONFIRM PASSWORD"
    ),
    React.createElement("input", { name: "pass2", id: "pass2", type: "password", placeholder: "confirm password" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "SIGN IN" })
  );
};

var createLoginWindow = function createLoginWindow(csrf) {
  var LoginWindow = React.createClass({
    displayName: "LoginWindow",

    handleSubmit: handleLogin,
    render: renderLogin
  });

  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  var SignupWindow = React.createClass({
    displayName: "SignupWindow",

    handleSubmit: handleSignup,
    render: renderSignup
  });

  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener('click', function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  loginButton.addEventListener('click', function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  createLoginWindow(csrf); //default start up view
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  //grab and set errorMessage in the html
  $("#errorMessage").text(message);
  //make error message visable and move to animate
  $("#errorMessage").css("opacity", "1");
  $("#errorMessage").css("height", "50px");

  console.log(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  //console.dir(data);
  //console.dir(action);
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
