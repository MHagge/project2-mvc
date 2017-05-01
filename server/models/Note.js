const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const _ = require('underscore');

let NoteModel = {};

const convertId = mongoose.Types.ObjectId;
const setTitle = title => _.escape(title).trim();
const setBody = noteBody => _.escape(noteBody).trim();
const setOwnerName = ownerName => _.escape(ownerName).trim();

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },

  noteBody: {
    type: String,
    required: true,
    trim: true,
    set: setBody,
  },

  ownerName: {
    type: String,
    required: true,
    trim: true,
    set: setOwnerName,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  privateNote: {
    type: Boolean,
    required: true,
  },

  createdData: {
    type: Date,
    default: Date.now,
  },

});

NoteSchema.statics.toAPI = doc => ({
  name: doc.title,
  age: doc.noteBody,
});

NoteSchema.statics.findByIdAndRemove = id => NoteModel.find({ _id: id }).remove();

NoteSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return NoteModel.find(search).select('title noteBody').exec(callback);
};

NoteSchema.statics.getAllNotesFromDB = (callback) => {
  const search = {
    privateNote: false,
  };
  return NoteModel.find(search).select('title noteBody ownerName').exec(callback);
};

NoteModel = mongoose.model('Note', NoteSchema);

module.exports.NoteModel = NoteModel;
module.exports.NoteSchema = NoteSchema;
