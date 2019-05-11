const express =  require('express');
const router = express.Router();
const secure = require('../middlewares/secure.mid');
const users = require('../controllers/users.controller');
const comments = require('../controllers/comments.controller');

router.get('/', secure.isAuthenticated, users.list);
router.get('/:id', users.details);
router.post('/comments', secure.isAuthenticated, comments.doCreate)
//router.post('/:id/delete', secure.isAuthenticated, users.delete);

module.exports = router;