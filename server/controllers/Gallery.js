const models = require('../models');

const Note = models.Note;

const galleryPage = (req, res) =>
  /*
  Note.NoteModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }
    console.dir(req.csrfToken());
  });
  */

   res.render('gallery', { csrfToken: req.csrfToken() });

const getAllNotes = (request, response) => {
  const res = response;

  // return res.json({notes:"save me from this nothing i've become"});

  return Note.NoteModel.getAllNotesFromDB((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }
    return res.json({ notes: docs });
  });
};

module.exports.galleyPage = galleryPage;
module.exports.getAllNotes = getAllNotes;
