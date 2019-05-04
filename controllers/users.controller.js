const User = require('../models/user.model');
const createError = require('http-errors');


// module.exports.coordinates = (req, res, next) => {
//   User.find()
//   .then((users) => res.json(users.map(u => u.location)))
//   .catch(next)
// }

module.exports.list = (req, res, next) => {
  User.find()
    .then(users => {
      res.render('users/list', { users});
    })
    .catch(error => next(error))
  }   
