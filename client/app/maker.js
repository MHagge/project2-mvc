let noteRenderer;

const handleNote = (e) =>{
  e.preventDefault();
  //error check
  if($("#noteTitle").val() == '' || $("#noteContent").val() == ''){
    handleError("All fields are required");
    return false;
  }
  
  //ajax call
  sendAjax('POST', $('#noteForm').attr("action"), $("#noteForm").serialize(), function(){
    noteRenderer.loadNotesFromServer();
  });
  return false;
};

const handleNoteRemoval = (e) =>{
//  console.dir(e.target.children.noteId.value);
//  console.dir(e.target.children._csrf.value);
  e.preventDefault();
  
  sendAjax('POST', $(e.target).attr("action"), $(e.target).serialize(), function(){
    noteRenderer.loadNotesFromServer();
  });
  
  return false;
  //idk how to actually handle the ajax call here 
};

const renderNoteMaker = function(){
  return(
    <div>
      <form id="noteForm"
        onSubmit={this.handleSubmit}
        name="noteForm"
        action="/makeNote"
        method="POST"
        className="noteForm"
        >
        <input id="noteTitle" 
          type="text" 
          name="title" 
          placeholder="TITLE" />

        <input id="noteBody" 
          type="text" 
          name="noteBody" 
          placeholder="WRITE NOTE HERE" />
        

        <input id="private"
          type="checkbox"
          name="private"
          value="false"/>
        <label htmlFor="private">Private</label>
        
        <input name="_csrf" type="hidden" value={this.props.csrf}/>

        <input className="formSubmit" type="submit" value="POST"/>  
      </form>
    </div>
  );
};

const renderNoteList = function(){
  let handleSubmit = this.handleSubmit;
  if(this.state.data.length === 0){
    return(
      <div className="NoteList">
        <h2 id="emptyNote">No notes yet</h2>
      </div>
    );
  }  
  const noteNodes = [];
  //this is the stuff in noteRenderer
  for(let i = this.state.data.length -1; i >= 0; i--){
    const note = this.state.data[i];
    noteNodes.push((
      <div key={note._id} className="note">
        <h2 className="noteTitle">{note.title}</h2>
        <p className="noteBody">{note.noteBody}</p>
        
        <form className='removeForm' 
          id={note._id} 
          onSubmit={handleSubmit} 
          action="/remover"
          method="POST"
          >
          <input className="makeNoteSubmit" type="submit" value="DELETE"/>
          <input type="hidden" name="_csrf" value={this.props.csrf} />
          <input type="hidden" name="noteId" value={note._id}/>
        </form>
      </div>  

    ));
  }
  return(
    <div className="noteList">
      {noteNodes}
    </div>
  );
};
const createMainPageWindow = function(csrf){
  const NoteFormClass = React.createClass({
    handleSubmit: handleNote,
    render: renderNoteMaker,
  });

  const NoteListClass = React.createClass({
    loadNotesFromServer: function(){
      sendAjax('GET', '/getNotes', null, function(data){
        this.setState({data:data.notes});
      }.bind(this));
    },
    getInitialState: function(){
      return {data: []};
    },
    componentDidMount: function(){
      this.loadNotesFromServer();
    },

    render: renderNoteList,

    handleSubmit: handleNoteRemoval,
  });

  let noteForm = ReactDOM.render(
    <NoteFormClass csrf={csrf} />,
    document.querySelector("#makeNote")
  );
  noteRenderer = ReactDOM.render(
    <NoteListClass csrf={csrf} />,
    document.querySelector("#personalList")
  );
};

const setup = function(csrf){
  if(document.querySelector("#makeNote")){
    createMainPageWindow(csrf);
  }
};

const getToken = () =>{
  sendAjax('GET', '/getToken', null, (result)=>{
//    console.log(result.csrfToken);
    setup(result.csrfToken);
  });
};

$(document).ready(function(){
  getToken();
});

















