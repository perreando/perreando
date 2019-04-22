const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_WORK_FACTOR = 10;
const FIRST_ADMIN_EMAIL = process.env.FIRST_ADMIN_EMAIL || 'admin@example.org';
const BREED_DOG = ['Mestizo', 'Pastor Alemán', 'San Bernardo', 'Labrador Retriever', 'Golden Retriever', 'Braco de Weimar', 'Border Collie', 'Boxer', 'Schnauzer', 'Bichón Maltés', 'Jack Russell Terrier', 'Beagle', 'Shar Pei', 'Bull Terrier', 'Yorkshire Terrier', 'Dálmata', 'Bretón', 'Bulldog Francés', 'Carlino', 'Otras razas']

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
    enum: ['Macho', 'Hembra'],
    required: true
  },
  weight: {
    type: String,
    enum: ['0kg - 3kg', '3kg - 8kg', '8kg - 15kg' , 'Más de 15kg']
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
    enum: ['Ir a pasear', 'Jugar a pelota', 'Dar besitos', 'Slalon', 'Comer premios', 'Agility', 'Rastrear']
  },
  avatarURL: String,
  gallery: {
    type: [String]
  }
  //favorites: [{ type: userSchema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })

userSchema.index({location: '2dsphere'});

const User = mongoose.model('User', userSchema);
module.exports = User;
