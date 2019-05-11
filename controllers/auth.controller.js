const createError = require('http-errors');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Walks = require('../models/walks.model');
const passport = require('passport');

const constants = require('../constants');
const GENRE_DOG = constants.GENRE_DOG
const BREED_DOG = constants.BREED_DOG
const WEIGHT_DOG = constants.WEIGHT_DOG
const HOBBIES_DOG = constants.HOBBIES_DOG

// module.exports.coordinates = (req, res, next) => {
//   Walks.find()
//       .then((walks) => res.json(events.map(w => w.location)))
//       .catch(next)
// }

module.exports.register = (req, res, next) => {
  res.render('auth/register');
}

module.exports.doRegister = (req, res, next) => {
  
  function renderWithErrors(errors) {
    res.render('auth/register', {
      user: req.body,
      errors: errors
    })
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        renderWithErrors({ email: 'Email already registered'})
      } else {
        user = new User(req.body);
        return user.save()
          .then(user => res.redirect('/login'))
      }
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        renderWithErrors(error.errors)
      } else {
        next(error);
      }
    });
}

module.exports.login = (req, res, next) => {
  res.render('auth/login');
}

module.exports.doLogin = (req, res, next) => {
  passport.authenticate('local-auth', (error, user, validation) => {
    if (error) {
      next(error);
    } else if (!user) {
      res.render('auth/login', {
        user: req.body,
        errors: validation
      })
    } else {
      return req.login(user, (error) => {
        if (error) {
          next(error)
        } else {
          res.redirect('/users')
        }
      })
    }
  })(req, res, next);
}

module.exports.loginWithIDPCallback = (req, res, next) => {
  const { idp } = req.params; 
  passport.authenticate(`${idp}-auth`, (error, user) => {
    if (error) {
      next(error);
    } else {
      req.login(user, (error) => {
        if (error) {
          next(error)
        } else {
          res.redirect('/users');
        }
      })
    }
  })(req, res, next);
}

module.exports.profile = (req, res, next) => {
  res.render('auth/profile', {
    genres: GENRE_DOG,
    breeds: BREED_DOG,
    weights: WEIGHT_DOG,
    hobbies: HOBBIES_DOG
  })
}

module.exports.doProfile = (req, res, next) => {
  if (!req.body) {
    delete req.body.password;
  }

  if (req.file) {
    req.body.avatarURL = req.file.secure_url;
  }

  
//Si tenemos el user
  const user = req.user;
  
  const returnedUser = Object.assign(user, req.body)
  // console.log(returnedUser, req.body)
  
  user.save()
    .then(user => res.redirect('/profile'))
    .catch(error => {
      console.log(error.errors);
      if (error instanceof mongoose.Error.ValidationError) {
        res.render('auth/profile', {
          user: req.body,
          errors: error.errors
        })
      } else {
        next(error);
      }
    });
}

module.exports.addWalk = (req, res, next) => {
  const walk = new Walks({
    location: {
      type: 'Point',
      coordinates: [req.body.lng, req.body.lat]
    },
    owner: req.user.id
  })

  walk.save()
    .then(walk => res.json(walk))
}

module.exports.getWalks = (req, res, next) => {
  Walks.find({ owner: req.user.id })
    .then(walks => res.json(walks))
}

module.exports.wall = (req, res, next) => {
  console.log(req.user.id)
  User.findById(req.user.id)
  .then(user=> res.render('auth/wall', {user}))
  .catch(err=> res.render('auth/wall', {err}))
}

module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/login');
}

