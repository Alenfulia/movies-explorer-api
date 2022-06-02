const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { signUp, signIn } = require('../middlewares/validations');
const NotFoundError = require('../errors/NotFoundError');

// Роуты авторизации и регистрации
router.post('/signup', signUp, createUser);
router.post('/signin', signIn, login);

// Роуты, к которым нужна авторизация
router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);

// Запрос к роуту, который несуществует
router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
