const models = require('../models');

const Note = models.Note;

const mainPage = (req, res) => {
  Note.NoteModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), notes: docs });
  });
};

const removeNote = (req, res) => {
//  console.log("hi cody code master");
  const notePromise = Note.NoteModel.findByIdAndRemove(req.body.noteId);

  notePromise.then(() => res.json({ redirect: '/mainPage' }));// uuuhhh but why?

  notePromise.catch((err) => {
    console.log(err);
    return res.status(400).json({ error: 'Error has occured in removeNote' });
  });
  return notePromise;
};

const makeNote = (req, res) => {
  if (!req.body.title || !req.body.noteBody) {
    return res.status(400).json({ error: 'Both fields are required(in makeNote() controllers/Notes.js)' });
  }
  // b/c html checkboxes are weird and backwards
//  console.log(req.body.private);
  if (req.body.private === undefined) {
    req.body.private = false;
  } else {
    req.body.private = true;
  }

  const noteData = {
    title: req.body.title,
    noteBody: req.body.noteBody,
    ownerName: req.session.account.username,
    owner: req.session.account._id,
    privateNote: req.body.private,
  };

  const newNote = new Note.NoteModel(noteData);

  const notePromise = newNote.save();

  notePromise.then(() => res.json({
    redirect: '/getNotes',
  }));

  notePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Note already exists' });
    }

    return res.status(400).json({ error: 'An error has occurred UwU' });
  });
  return notePromise;
};

const getNotes = (request, response) => {
  const req = request;
  const res = response;

  return Note.NoteModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }
    return res.json({ notes: docs });
  });
};

module.exports.mainPage = mainPage;
module.exports.getNotes = getNotes;
module.exports.makeNote = makeNote;
module.exports.removeNote = removeNote;

