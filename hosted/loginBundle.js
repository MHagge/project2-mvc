"use strict";

var handleLogin = function handleLogin(e) {
  e.preventDefault();

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty.");
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();

  if ($("#user").val() == "" || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required.");
    return false;
  }

  if ($("#pass").val() != $("#pass2").val()) {
    handleError("Passwords do not match.");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};

var handleChangePW = function handleChangePW(e) {
  e.preventDefault();

  if ($("#currentPW").val() == "" || $("#newPW").val() == "") {
    handleError("All fields are required.");
    return false;
  }

  if ($("#currentPW").val() === $("#newPW").val()) {
    handleError("New password is the same as old password.");
    return false;
  }

  console.log("Successful kick off of change password form.. going to ajax next... WIP");

  sendAjax('POST', $("#changePWForm").attr("action"), $("#changePWForm").serialize(), redirect);
  return false;
};

var renderLogin = function renderLogin() {
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
    React.createElement("input", { name: "username", id: "user", type: "text", placeholder: "username" }),
    React.createElement(
      "label",
      { htmlFor: "password" },
      "PASSWORD"
    ),
    React.createElement("input", { name: "password", id: "pass", type: "password", placeholder: "password" }),
    React.createElement("input", { name: "_csrf", type: "hidden", value: this.props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "SIGN IN" })
  );
};
var renderSignup = function renderSignup() {
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
    React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
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

var renderChangePW = function renderChangePW() {
  return React.createElement(
    "form",
    {
      id: "changePWform",
      name: "changePWform",
      onSubmit: this.handleSubmit,
      action: "/changePW",
      method: "POST",
      className: "mainForm"
    },
    React.createElement("input", { id: "currentPW", type: "password", placeholder: "CURRENT PASSWORD" }),
    React.createElement("input", { id: "newPW", type: "password", placeholder: "NEW PASSWORD" }),
    React.createElement("label", { name: "_csrf", type: "hidden", value: this.props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "SAVE" })
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

var createChangePWWindow = function createChangePWWindow(csrf) {
  var ChangePWWindow = React.createClass({
    displayName: "ChangePWWindow",

    handleSubmit: handleChangePW,
    render: renderChangePW
  });
  ReactDOM.render(React.createElement(ChangePWWindow, { csrf: csrf }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");
  var changePWButtom = document.querySelector("#changePWButton");

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
  changePWButtom.addEventListener('click', function (e) {
    e.preventDefault();
    createChangePWWindow(csrf);
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
  $("#errorMessage").text(message);
  console.log("handleError function is WIP");
  console.log(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {

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
