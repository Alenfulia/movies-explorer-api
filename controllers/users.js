const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

// Возвращаем информацию о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    if (!user) {
      return next(new NotFoundError('Пользователь не найден.'));
    }
    return res.status(200).send(user);
  }).catch(next);
};

// Обновление информации о пользователе
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные пользователя.'));
      } else {
        next(err);
      }
    });
};

// Создание нового пользователя
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Неправильный логин или пароль.'));
  }
  return User.findOne({ email }).then((user) => {
    if (user) {
      next(new ConflictError(`Пользователь с ${email} уже существует.`));
    }
    return bcrypt.hash(password, 10);
  })
    .then((hash) => User.create({
      name,
      email,
      password: hash,

    }))
    .then((user) => res.status(200).send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные пользователя.'));
      } else {
        next(err);
      }
    });
};

// Аутентификация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // Создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        {
          expiresIn: '7d',
        },
      );
      // Вернём токен
      return res.send({ token });
    })
    .catch(next);
};
