const handleLogin = (e) =>{
  e.preventDefault();
  
  //check fields
  if($("#user").val() == '' || $("#pass").val() == ''){
    handleError("Username or password is empty");
    return false;
  }

  //console.log($("input[name=_csrf]").val());
  //ajax call
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

const handleSignup = (e) =>{
  e.preventDefault();
  //check fields
  if($("#user").val() == "" || $("#pass").val() == '' || $("#pass2").val() == ''){
    handleError("All fields are required");
    return false;
  }
  //check fields
  if($("#pass").val() != $("#pass2").val()){
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};

const renderLogin = function(){
  $("#errorMessage").css("opacity","0");
  $("#errorMessage").css("height","0px");  
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
      <input name="username" id="username" type="text" placeholder="username"></input>

      <label htmlFor="password">PASSWORD</label>
      <input name="password" id="password" type="password" placeholder="password"></input>

      <input name="_csrf" type="hidden" value={this.props.csrf}/>

      <input className="formSubmit" type="submit" value="SIGN IN"/>
    </form>
  );
};
const renderSignup = function(){
  $("#errorMessage").css("opacity","0");
  $("#errorMessage").css("height","0px");
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
      <input id="usernames" type="text" name="username" placeholder="username"/>
      
      <label htmlFor="pass">PASSWORD</label>
      <input name="pass" id="pass" type="password" placeholder="password"/>
      
      <label htmlFor="pass2">CONFIRM PASSWORD</label>
      <input name="pass2" id="pass2" type="password"  placeholder="confirm password"/>
      
      <input type="hidden" name="_csrf" value={this.props.csrf}/>
      <input className="formSubmit" type="submit" value="SIGN IN" />
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

const setup = function(csrf){
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");

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

