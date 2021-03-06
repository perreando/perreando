const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const constants = require('../constants')

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_WORK_FACTOR = 10;
const FIRST_ADMIN_EMAIL = process.env.FIRST_ADMIN_EMAIL || 'admin@example.org';

const BREED_DOG = constants.BREED_DOG
const WEIGHT_DOG = constants.WEIGHT_DOG
const HOBBIES_DOG = constants.HOBBIES_DOG

const Comment = require('./comments.model');
const Walks = require('./walks.model');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El email es un campo requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [EMAIL_PATTERN, 'Introduce un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es un campo requerido'],
    minlength: [8, 'La contraseña necesita al menos 8 caracteres']
  },
  social: {
    googleId: {
      type: String
    }
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  genre: {
    type: String,
    enum: constants.GENRE_DOG
  },
  weight: {
    type: String,
    enum: WEIGHT_DOG
  },
  breed: {
    type: String,
    enum: BREED_DOG
  },
  age: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  },
  city: {
    type: String,
    default: 'My city'
  },
  city2: {
    type: String,
    default: ''
  },
  hobbies: {
    type: [String],
    enum: HOBBIES_DOG,
    default: []
  },
  avatarURL:{
    type: String,
    default: '../images/dog.png'
  },
  gallery: {
    type: [String]
  },
  // favorites: [{ type: userSchema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })

userSchema.pre('save', function(next) {
  const user = this;
  if(user.isModified('password')) {
    bcrypt.genSalt(SALT_WORK_FACTOR)
    .then(salt => {
      return bcrypt.hash(user.password, salt)
      .then(hash => {
        user.password = hash;
        next();
      });
    })
    .catch(error => next(error));
  } else {
    next();
  }
});

userSchema.index({location: '2dsphere'});

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password);
}

userSchema.virtual('comments', {
  ref: 'Comment', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'owner' // is equal to `foreignField`
});

const User = mongoose.model('User', userSchema);
module.exports = User;