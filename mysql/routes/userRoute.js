const router = require('express').Router();
const controller  = require('../controllers/userController')

router.get('/', controller.getUsers)
router.post('/', controller.createUser)
router.put('/username/:id', controller.updateUserUsername)
router.delete('/:id', controller.deleteUser)

module.exports = router;