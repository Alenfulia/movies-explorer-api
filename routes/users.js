const userRouter = require('express').Router();
const { updateUserValidation } = require('../middlewares/validations');
const { getCurrentUser, updateUser } = require('../controllers/users');

userRouter.get('/me', getCurrentUser);
userRouter.patch('/me', updateUserValidation, updateUser);

module.exports = userRouter;
