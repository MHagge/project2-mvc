const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.post('/changePW', mid.requiresLogin, controllers.Settings.changePW);

  app.post('/changeUN', mid.requiresLogin, controllers.Settings.changeUN);

  app.get('/mainPage', mid.requiresLogin, controllers.Note.mainPage);

  app.post('/makeNote', mid.requiresLogin, controllers.Note.makeNote);

  app.get('/settings', mid.requiresLogin, controllers.Settings.settingsPage);

  app.get('/getUsername', mid.requiresLogin, controllers.Settings.getUsername);

  app.get('/getNotes', mid.requiresLogin, controllers.Note.getNotes);

  app.post('/remover', mid.requiresLogin, controllers.Note.removeNote);

  app.get('/gallery', mid.requiresLogin, controllers.Gallery.galleyPage);

  app.get('/getAllNotes', mid.requiresLogin, controllers.Gallery.getAllNotes);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
