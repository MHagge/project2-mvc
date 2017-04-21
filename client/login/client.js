const handleLogin = (e) =>{
  e.preventDefault();

  if($("#user").val() == '' || $("#pass").val() == ''){
    handleError("Username or password is empty.");
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

const handleSignup = (e) =>{
  e.preventDefault();

  if($("#user").val() == "" || $("#pass").val() == '' || $("#pass2").val() == ''){
    handleError("All fields are required.");
    return false;
  }

  if($("#pass").val() != $("#pass2").val()){
    handleError("Passwords do not match.");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};

const handleChangePW = (e) =>{
  e.preventDefault();

  if($("#currentPW").val() == "" || $("#newPW").val() == ""){
    handleError("All fields are required.");
    return false;
  }

  if($("#currentPW").val() === $("#newPW").val()){
    handleError("New password is the same as old password.");
    return false;
  }

  console.log("Successful kick off of change password form.. going to ajax next... WIP");
  
  sendAjax('POST', $("#changePWForm").attr("action"), $("#changePWForm").serialize(), redirect);
  return false;
};

const renderLogin = function(){
  return(
    <form 
      id="loginForm"
      name="loginForm"
      onSubmit={this.handleSubmit}
      action="/login"
      method="POST"
      className="mainForm"
      >
      <label htmlFor="username">USERNAME</label>
      <input name="username" id="user" type="text" placeholder="username"></input>

      <label htmlFor="password">PASSWORD</label>
      <input name="password" id="pass" type="password" placeholder="password"></input>

      <input name="_csrf" type="hidden" value={this.props.csrf}/>

      <input className="formSubmit" type="submit" value="SIGN IN"/>
    </form>
  );
};
const renderSignup = function(){
  return(
    <form 
      id="signupForm"
      name="signupForm"
      onSubmit={this.handleSubmit}
      action="/signup"
      method="POST"
      className="mainForm"
      >
      <label htmlFor="username">USERNAME</label>
      <input id="user" type="text" name="username" placeholder="username"/>
      
      <label htmlFor="pass">PASSWORD</label>
      <input name="pass" id="pass" type="password" placeholder="password"/>
      
      <label htmlFor="pass2">CONFIRM PASSWORD</label>
      <input name="pass2" id="pass2" type="password"  placeholder="confirm password"/>
      
      <input type="hidden" name="_csrf" value={this.props.csrf}/>
      <input className="formSubmit" type="submit" value="SIGN IN" />
    </form>
  );
};

const renderChangePW = function(){
  return(
    <form 
      id="changePWform"
      name="changePWform"
      onSubmit={this.handleSubmit}
      action="/changePW"
      method="POST"
      className="mainForm"
      >
      <input id="currentPW" type="password" placeholder="CURRENT PASSWORD"/>

      <input id="newPW" type="password" placeholder="NEW PASSWORD"/>

      <label name="_csrf" type="hidden" value={this.props.csrf}/>
      
      <input className="formSubmit" type="submit" value="SAVE"/>  
    </form>
  );
};

const createLoginWindow = function (csrf){
  const LoginWindow = React.createClass({
    handleSubmit: handleLogin,
    render: renderLogin
  });

  ReactDOM.render(
    <LoginWindow csrf={csrf}/>,
    document.querySelector("#content")
  );
};

const createSignupWindow = function (csrf){
  const SignupWindow = React.createClass({
    handleSubmit: handleSignup,
    render: renderSignup
  });

  ReactDOM.render(
    <SignupWindow csrf={csrf}/>,
    document.querySelector("#content")
  );
};

const createChangePWWindow = function (csrf){
  const ChangePWWindow = React.createClass({
    handleSubmit: handleChangePW,
    render: renderChangePW
  });
  ReactDOM.render(
    <ChangePWWindow csrf={csrf}/>,
    document.querySelector("#content")
  );
};

const setup = function(csrf){
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");
  const changePWButtom = document.querySelector("#changePWButton")

  signupButton.addEventListener('click', (e)=>{
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  loginButton.addEventListener('click', (e)=>{
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  changePWButtom.addEventListener('click', (e)=>{
    e.preventDefault();
    createChangePWWindow(csrf);
    return false;
  });

  createLoginWindow(csrf);//default start up view
};

const getToken = () =>{
  sendAjax('GET', '/getToken', null, (result)=>{
    setup(result.csrfToken);
  });
};

$(document).ready(function(){
  getToken();
});

