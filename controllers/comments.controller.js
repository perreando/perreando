const createError = require('http-errors');
const mongoose = require('mongoose');
const Comment = require('../models/comments.model');

module.exports.doCreate = (req, res, next) => {
  const comment = new Comment(req.body)

  comment.save()
    .then((comment) => res.redirect(`/users/${comment.owner}`))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render('comments/form', {
          comment,
          ...error
        })
      } else {
        next(error)
      }
    });
}

