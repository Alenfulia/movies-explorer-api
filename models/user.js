const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const UnathorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

// Проверка почты и пароля
// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    // Пользователь не нашёлся — отклоняем промис
    if (!user) {
      throw new UnathorizedError('Неправильные почта или пароль.');
    }
    // Нашёлся — сравниваем хеши
    return bcrypt.compare(password, user.password).then((matched) => {
      // Хеши не совпали — отклоняем промис
      if (!matched) {
        throw new UnathorizedError('Неправильные почта или пароль.');
      }
      // Аутентификация успешна
      return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);
