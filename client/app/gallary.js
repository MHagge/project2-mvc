const renderAllNotes = function(){
  //console.dir(this.state);
  if(this.state.allNotes.length === 0){
    return(
      <div className="NoteList">
        <h2 id="emptyNote">No notes yet</h2>
      </div>
    );
  }  
  const allNoteNodes = [];

  for(let i = this.state.allNotes.length -1; i >= 0; i--){
    const note = this.state.allNotes[i];
    allNoteNodes.push((
      <div key={note._id} className="note">
        <h2 className="noteTitle">{note.title}</h2>
        <p className="noteBody">{note.noteBody}</p>
        <p className="noteOwnerName"><em>Posted by {note.ownerName}</em></p>
      </div>  
    ));
  }
  return(
    <div className="noteList">
      {allNoteNodes}
    </div>
  );
};

const createGalleryPage = function(){

  const GalleryClass = React.createClass({
    loadAllNotesFromServer: function(){
      sendAjax('GET', '/getAllNotes', null, function(data){
        this.setState({allNotes: data.notes});//????
        //this.setState({data:data.notes});
      }.bind(this));
      //console.dir(this.state);
    },
    getInitialState: function(){
      return {allNotes: []};
    }, 
    componentDidMount: function(){
      this.loadAllNotesFromServer();
    },
    render:renderAllNotes,
  });

  let galleryRenderer = ReactDOM.render(
    <GalleryClass />,
    document.querySelector("#gallery")
  );
};

const gallerySetup = function(csrf){
  if(document.querySelector("#gallery")){
    createGalleryPage();
  }
};
const getGalleryToken = () =>{
  sendAjax('GET', '/getToken', null, (result)=>{
    //console.log(result.csrfToken);
    gallerySetup(result.csrfToken);
  });
};

$(document).ready(function(){
  getGalleryToken();
});

