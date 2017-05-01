const models = require('../models');

const Account = models.Account;

// render the settings handlebar page
const settingsPage = (req, res) => res.render('settings', { csrfToken: req.csrfToken() });

const changePW = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings
  req.body.currentPW = `${req.body.currentPW}`;
  req.body.newPW = `${req.body.newPW}`;
  req.body.newPW2 = `${req.body.newPW2}`;

  if (req.body.newPW !== req.body.newPW2) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }

  // check if currentPW matches password of account signed in
  // dear eslint,
  // i know you're trying your hardest to be useful but sometimes.. you frustrate me
  const rsau = req.session.account.username;
  return Account.AccountModel.authenticate(rsau, req.body.currentPW, (errI, account) => {
    if (errI || !account) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // make new, set to old
    const newAccount = account;

    return Account.AccountModel.generateHash(req.body.newPW, (salt, hash) => {
      newAccount.password = hash;
      newAccount.salt = salt;

      const savePromise = newAccount.save();

      savePromise.then(() => res.json({
        password: newAccount.password,
      }));

      savePromise.catch((errII) => {
        res.json(errII);
      });

      return res.json({ redirect: '/mainPage' });
    });
  });
};
const changeUN = (request, response) => {
  const req = request;
  const res = response;

  // cast to string
  req.body.newUN = `${req.body.newUN}`;

  // grab the account
  return Account.AccountModel.findByUsername(req.session.account.username, (errI, account) => {
    //
    const newAccount = account;

    newAccount.username = req.body.newUN;

    const savePromise = newAccount.save();

    savePromise.then(() => res.json({
      password: newAccount.password,
    }));

    savePromise.catch((errII) => {
      res.json(errII);
    });
    req.session.account.username = req.body.newUN;
    return res.json({ redirect: '/mainPage' });
  });
};
const getUsername = (request, response) => {
  console.log('IN getUsername()');
  const req = request;
  const res = response;
  return res.json({ username: `${req.session.account.username}` });
};

module.exports.settingsPage = settingsPage;
module.exports.changePW = changePW;
module.exports.changeUN = changeUN;
module.exports.getUsername = getUsername;
