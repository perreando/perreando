const User = require('../models/user.model');
const createError = require('http-errors');
const mongoose = require('mongoose');


// module.exports.coordinates = (req, res, next) => {
//   User.find()
//   .then((users) => res.json(users.map(u => u.location)))
//   .catch(next)
// }
module.exports.details = (req, res, next) => {
  const id = req.params.id;

  if(!mongoose.Types.ObjectId.isValid(id)) {
    next(createError(404, 'Este usuario no se ha encontrado'))
  } else {
    User.findById(id)
    .then(user => {
      if(user) {
        //.then(user=> res.render('auth/wall', {user}))
        res.render('auth/wall', {user})
      }
    })
    .catch(error => next(error))
  }
}

module.exports.list = (req, res, next) => {
  User.find()
    .then(users => {
      res.render('users/list', { users });
    })
    .catch(error => next(error))
}   
