const handleChange = (e) =>{
  e.preventDefault();

  if(e.target.id === "changeUNForm"){
    if($("#newUN").val() == ""){
      handleError("Username cannot be blank");
    }

    sendAjax('POST', $("#changeUNForm").attr("action"), $("#changeUNForm").serialize(), redirect);

  }else if(e.target.id === "changePWForm"){
    if($("#currentPW").val() == "" || $("#newPW").val() == ""){
      handleError("All fields are required.");
      return false;
    }

    if($("#currentPW").val() === $("#newPW").val()){
      handleError("Passwords cannot be the same");
      return false;
    }

    sendAjax('POST', $("#changePWForm").attr("action"), $("#changePWForm").serialize(), redirect);
  }
  return false;
};
const handleClick = (e) =>{
  e.preventDefault();
  //show user their current username
  sendAjax('GET', '/getUsername', null, function(data){
    console.dir(`Current Username is ${data.username}`);
  });
  console.log("handleClick WIP");
  return false;
};
const renderChangePW = function(){
  //console.log("I scream");
  //console.log(this.props.csrf);
  $("#errorMessage").css("opacity","0");
  $("#errorMessage").css("height","0px");
  return(
    <div>
      <form 
        id="changeUNForm"
        name="changeUNForm"
        onSubmit={this.handleSubmit}
        action="/changeUN"
        method="POST"
        className="changeUNForm"
        >
        <label htmlFor="newUN">CHANGE USERNAME</label>
        <input id="newUN" name="newUN" onClick={this.handleClick}type="text" placeholder="new username"/>

        <input name="_csrf" type="hidden" value={this.props.csrf}/>

        <input className="formSubmit" type="submit" value="SAVE"/>  
      </form>
      <hr></hr>
      <form 
        id="changePWForm"
        name="changePWForm"
        onSubmit={this.handleSubmit}
        action="/changePW"
        method="POST"
        className="changePWForm"
        >
        <label htmlFor="currentPW">CHANGE PASSWORD</label>
        <input id="currentPW" name="currentPW" type="password" placeholder="current password"/>

        <input id="newPW" name="newPW" type="password" placeholder="new password"/>
        <input id="newPW2" name="newPW2" type="password" placeholder="confirm new password"/>

        <input name="_csrf" type="hidden" value={this.props.csrf}/>

        <input className="formSubmit" type="submit" value="SAVE"/>  
      </form>
    </div>
  );
};

const createChangePWWindow = function (csrf){
  const ChangePWWindow = React.createClass({
    handleSubmit: handleChange,
    handleClick: handleClick,
    render: renderChangePW,
  });
  ReactDOM.render(
    <ChangePWWindow csrf={csrf}/>,
    document.querySelector("#settingsDiv")
  );
};

const settingsSetup = function(csrf){
  if(document.querySelector("#settingsDiv")){
    createChangePWWindow(csrf);
  }
};
const getSettingToken = () =>{
  sendAjax('GET', '/getToken', null, (result)=>{
    //console.log(result.csrfToken);
    settingsSetup(result.csrfToken);
  });
};

$(document).ready(function(){
  getSettingToken();
});
