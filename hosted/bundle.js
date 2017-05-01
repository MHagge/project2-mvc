"use strict";

var renderAllNotes = function renderAllNotes() {
  //console.dir(this.state);
  if (this.state.allNotes.length === 0) {
    return React.createElement(
      "div",
      { className: "NoteList" },
      React.createElement(
        "h2",
        { id: "emptyNote" },
        "No notes yet"
      )
    );
  }
  var allNoteNodes = [];

  for (var i = this.state.allNotes.length - 1; i >= 0; i--) {
    var note = this.state.allNotes[i];
    allNoteNodes.push(React.createElement(
      "div",
      { key: note._id, className: "note" },
      React.createElement(
        "h2",
        { className: "noteTitle" },
        note.title
      ),
      React.createElement(
        "p",
        { className: "noteBody" },
        note.noteBody
      ),
      React.createElement(
        "p",
        { className: "noteOwnerName" },
        React.createElement(
          "em",
          null,
          "Posted by ",
          note.ownerName
        )
      )
    ));
  }
  return React.createElement(
    "div",
    { className: "noteList" },
    allNoteNodes
  );
};

var createGalleryPage = function createGalleryPage() {

  var GalleryClass = React.createClass({
    displayName: "GalleryClass",

    loadAllNotesFromServer: function loadAllNotesFromServer() {
      sendAjax('GET', '/getAllNotes', null, function (data) {
        this.setState({ allNotes: data.notes }); //????
        //this.setState({data:data.notes});
      }.bind(this));
      //console.dir(this.state);
    },
    getInitialState: function getInitialState() {
      return { allNotes: [] };
    },
    componentDidMount: function componentDidMount() {
      this.loadAllNotesFromServer();
    },
    render: renderAllNotes
  });

  var galleryRenderer = ReactDOM.render(React.createElement(GalleryClass, null), document.querySelector("#gallery"));
};

var gallerySetup = function gallerySetup(csrf) {
  if (document.querySelector("#gallery")) {
    createGalleryPage();
  }
};
var getGalleryToken = function getGalleryToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    //console.log(result.csrfToken);
    gallerySetup(result.csrfToken);
  });
};

$(document).ready(function () {
  getGalleryToken();
});
"use strict";

var noteRenderer = void 0;

var handleNote = function handleNote(e) {
  e.preventDefault();
  //error check
  if ($("#noteTitle").val() == '' || $("#noteContent").val() == '') {
    handleError("All fields are required");
    return false;
  }

  //ajax call
  sendAjax('POST', $('#noteForm').attr("action"), $("#noteForm").serialize(), function () {
    noteRenderer.loadNotesFromServer();
  });
  return false;
};

var handleNoteRemoval = function handleNoteRemoval(e) {
  //  console.dir(e.target.children.noteId.value);
  //  console.dir(e.target.children._csrf.value);
  e.preventDefault();

  sendAjax('POST', $(e.target).attr("action"), $(e.target).serialize(), function () {
    noteRenderer.loadNotesFromServer();
  });

  return false;
  //idk how to actually handle the ajax call here 
};

var renderNoteMaker = function renderNoteMaker() {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "form",
      { id: "noteForm",
        onSubmit: this.handleSubmit,
        name: "noteForm",
        action: "/makeNote",
        method: "POST",
        className: "noteForm"
      },
      React.createElement("input", { id: "noteTitle",
        type: "text",
        name: "title",
        placeholder: "TITLE" }),
      React.createElement("input", { id: "noteBody",
        type: "text",
        name: "noteBody",
        placeholder: "WRITE NOTE HERE" }),
      React.createElement("input", { id: "private",
        type: "checkbox",
        name: "private",
        value: "false" }),
      React.createElement(
        "label",
        { htmlFor: "private" },
        "Private"
      ),
      React.createElement("input", { name: "_csrf", type: "hidden", value: this.props.csrf }),
      React.createElement("input", { className: "formSubmit", type: "submit", value: "POST" })
    )
  );
};

var renderNoteList = function renderNoteList() {
  var handleSubmit = this.handleSubmit;
  if (this.state.data.length === 0) {
    return React.createElement(
      "div",
      { className: "NoteList" },
      React.createElement(
        "h2",
        { id: "emptyNote" },
        "No notes yet"
      )
    );
  }
  var noteNodes = [];
  //this is the stuff in noteRenderer
  for (var i = this.state.data.length - 1; i >= 0; i--) {
    var note = this.state.data[i];
    noteNodes.push(React.createElement(
      "div",
      { key: note._id, className: "note" },
      React.createElement(
        "h2",
        { className: "noteTitle" },
        note.title
      ),
      React.createElement(
        "p",
        { className: "noteBody" },
        note.noteBody
      ),
      React.createElement(
        "form",
        { className: "removeForm",
          id: note._id,
          onSubmit: handleSubmit,
          action: "/remover",
          method: "POST"
        },
        React.createElement("input", { className: "makeNoteSubmit", type: "submit", value: "DELETE" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
        React.createElement("input", { type: "hidden", name: "noteId", value: note._id })
      )
    ));
  }
  return React.createElement(
    "div",
    { className: "noteList" },
    noteNodes
  );
};
var createMainPageWindow = function createMainPageWindow(csrf) {
  var NoteFormClass = React.createClass({
    displayName: "NoteFormClass",

    handleSubmit: handleNote,
    render: renderNoteMaker
  });

  var NoteListClass = React.createClass({
    displayName: "NoteListClass",

    loadNotesFromServer: function loadNotesFromServer() {
      sendAjax('GET', '/getNotes', null, function (data) {
        this.setState({ data: data.notes });
      }.bind(this));
    },
    getInitialState: function getInitialState() {
      return { data: [] };
    },
    componentDidMount: function componentDidMount() {
      this.loadNotesFromServer();
    },

    render: renderNoteList,

    handleSubmit: handleNoteRemoval
  });

  var noteForm = ReactDOM.render(React.createElement(NoteFormClass, { csrf: csrf }), document.querySelector("#makeNote"));
  noteRenderer = ReactDOM.render(React.createElement(NoteListClass, { csrf: csrf }), document.querySelector("#personalList"));
};

var setup = function setup(csrf) {
  if (document.querySelector("#makeNote")) {
    createMainPageWindow(csrf);
  }
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    //    console.log(result.csrfToken);
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleChange = function handleChange(e) {
  e.preventDefault();

  if (e.target.id === "changeUNForm") {
    if ($("#newUN").val() == "") {
      handleError("Username cannot be blank");
    }

    sendAjax('POST', $("#changeUNForm").attr("action"), $("#changeUNForm").serialize(), redirect);
  } else if (e.target.id === "changePWForm") {
    if ($("#currentPW").val() == "" || $("#newPW").val() == "") {
      handleError("All fields are required.");
      return false;
    }

    if ($("#currentPW").val() === $("#newPW").val()) {
      handleError("Passwords cannot be the same");
      return false;
    }

    sendAjax('POST', $("#changePWForm").attr("action"), $("#changePWForm").serialize(), redirect);
  }
  return false;
};
var handleClick = function handleClick(e) {
  e.preventDefault();
  //show user their current username
  sendAjax('GET', '/getUsername', null, function (data) {
    console.dir("Current Username is " + data.username);
  });
  console.log("handleClick WIP");
  return false;
};
var renderChangePW = function renderChangePW() {
  //console.log("I scream");
  //console.log(this.props.csrf);
  $("#errorMessage").css("opacity", "0");
  $("#errorMessage").css("height", "0px");
  return React.createElement(
    "div",
    null,
    React.createElement(
      "form",
      {
        id: "changeUNForm",
        name: "changeUNForm",
        onSubmit: this.handleSubmit,
        action: "/changeUN",
        method: "POST",
        className: "changeUNForm"
      },
      React.createElement(
        "label",
        { htmlFor: "newUN" },
        "CHANGE USERNAME"
      ),
      React.createElement("input", { id: "newUN", name: "newUN", onClick: this.handleClick, type: "text", placeholder: "new username" }),
      React.createElement("input", { name: "_csrf", type: "hidden", value: this.props.csrf }),
      React.createElement("input", { className: "formSubmit", type: "submit", value: "SAVE" })
    ),
    React.createElement("hr", null),
    React.createElement(
      "form",
      {
        id: "changePWForm",
        name: "changePWForm",
        onSubmit: this.handleSubmit,
        action: "/changePW",
        method: "POST",
        className: "changePWForm"
      },
      React.createElement(
        "label",
        { htmlFor: "currentPW" },
        "CHANGE PASSWORD"
      ),
      React.createElement("input", { id: "currentPW", name: "currentPW", type: "password", placeholder: "current password" }),
      React.createElement("input", { id: "newPW", name: "newPW", type: "password", placeholder: "new password" }),
      React.createElement("input", { id: "newPW2", name: "newPW2", type: "password", placeholder: "confirm new password" }),
      React.createElement("input", { name: "_csrf", type: "hidden", value: this.props.csrf }),
      React.createElement("input", { className: "formSubmit", type: "submit", value: "SAVE" })
    )
  );
};

var createChangePWWindow = function createChangePWWindow(csrf) {
  var ChangePWWindow = React.createClass({
    displayName: "ChangePWWindow",

    handleSubmit: handleChange,
    handleClick: handleClick,
    render: renderChangePW
  });
  ReactDOM.render(React.createElement(ChangePWWindow, { csrf: csrf }), document.querySelector("#settingsDiv"));
};

var settingsSetup = function settingsSetup(csrf) {
  if (document.querySelector("#settingsDiv")) {
    createChangePWWindow(csrf);
  }
};
var getSettingToken = function getSettingToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    //console.log(result.csrfToken);
    settingsSetup(result.csrfToken);
  });
};

$(document).ready(function () {
  getSettingToken();
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
