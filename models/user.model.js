const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_WORK_FACTOR = 10;
const FIRST_ADMIN_EMAIL = process.env.FIRST_ADMIN_EMAIL || 'admin@example.org';

const constants = require('../constants')
const GENRE_DOG = constants.GENRE_DOG
const BREED_DOG = constants.BREED_DOG
const WEIGHT_DOG = constants.WEIGHT_DOG
const HOBBIES_DOG = constants.HOBBIES_DOG

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
      type: String,
      unique: true
    }
  },
  name: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    enum: GENRE_DOG
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
  city: {
    type: {type: String},
    coordinates: [Number]
  },
  //walks: {
    //type: {type: String},
    //coordinates: [{Number}]
  //}
  hobbies: {
    type: String,
    enum: HOBBIES_DOG
  },
  avatarURL: String,
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

const User = mongoose.model('User', userSchema);
module.exports = User;