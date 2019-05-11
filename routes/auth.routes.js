const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');
const secure = require('../middlewares/secure.mid');
const passport = require('passport');
const storage = require('../config/storage.config');

router.get('/register', auth.register);
router.post('/register', auth.doRegister);
router.get('/login', auth.login);
router.post('/login', auth.doLogin);
router.get('/logout', auth.logout);
router.get('/profile', secure.isAuthenticated, auth.profile);
router.post('/add_walk', secure.isAuthenticated, auth.addWalk);
router.get('/get_walks', secure.isAuthenticated, auth.getWalks);
router.post('/profile', secure.isAuthenticated, storage.single('avatar'), auth.doProfile);
router.get('/authenticate/google', passport.authenticate('google-auth', { scope: ['openid', 'profile', 'email'] }))
router.get('/authenticate/:idp/cb', auth.loginWithIDPCallback)

router.get('/wall', secure.isAuthenticated, auth.wall);

module.exports = router;
