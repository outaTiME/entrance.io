
/**
 * Populate.
 */

var

  // configuration
  config = require('config'),

  // basic
  async = require('async'),

  // mongoose
  mongoose = require('mongoose'),

  // models
  Company = require('../models/company'),
  User = require('../models/user');

// FIXME: Export to generic
mongoose.set('debug', config.verbose);
mongoose.connect(process.env.MONGOHQ_URL || config.database.uri);
mongoose.connection.on('error', function (err) {
  console.error('MongoDB error: ' + err.message);
  console.error('Make sure a mongoDB server is running and accessible by this application');
});

var createUser = function (company_id, username, password, role, callback) {
  console.log('Creating user "' + username + '"');
  var user = new User({
    username: username,
    password: password,
    _company: company_id
  });
  if (typeof role === "string") { // if no role default
    user.role = role;
  }
  user.save(callback);
};

var createCompany = function (name, callback) {
  console.log('Creating company "' + name + '"');
  var company = new Company({
    name: name
  });
  company.save(callback);
};

var createUsers = function (callback) {
  createCompany('test', function (err, company) {
    async.parallel([
      function (cb) { createUser(company._id, 'admin', 'admin', 'admin', cb); },
      function (cb) { createUser(company._id, 'user', 'user', null, cb); }
    ], callback);
  })
};

async.series([createUsers], function (err) {
  if (err) {
    console.dir(err);
  } else {
    console.log('Population complete!');
  }
  setTimeout(function () {
    mongoose.connection.close();
  }, 1000);
});
