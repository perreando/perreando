const createError = require('http-errors');
const mongoose = require('mongoose');
const Comment = require('../models/comments.model');

module.exports.create = (req, res, next) => {
  const comment = new Comment({ user: req.params.userId });

  res.render('comments/form', { comment })
}

module.exports.doCreate = (req, res, next) => {
  const comment = new Comment(req.body)

  comment.save()
    .then((comment) => res.redirect(`/books/${comment.book}`))
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

module.exports.edit = (req, res, next) => {
  const id = req.params.id;

  Comment.findById(id)
    .then(comment => {
      if (comment) {
        res.render('comments/form', { comment })
      } else {
        next(createError(404, 'Comment not found'))
      }
    })
    .catch(error => next(error));
}

module.exports.doEdit = (req, res, next) => {
  const id = req.params.id;

  Comment.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .then((comment) => {
      if (comment) {
        res.redirect(`/books/${comment.book}`)
      } else {
        next(createError(404, 'Comment not found'))
      }
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        const comment = new Comment({ ...req.body, _id: id })
        comment.isNew = false;

        res.render('comments/form', { comment, ...error })
      } else {
        next(error);
      }
    })
}

module.exports.delete = (req, res, next) => {
  const id = req.params.id;

  Comment.findByIdAndDelete(id)
    .then((comment) => {
      if (comment) {
        res.redirect(`/books/${comment.book}`)
      } else {
        next(createError(404, 'Comment not found'))
      }
    })
    .catch((error) => next(error))
}