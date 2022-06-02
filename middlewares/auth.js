const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // Достаём авторизационный заголовок
  const { authorization } = req.headers;

  // Убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnathorizedError('Необходима авторизация.');
  }

  // Извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    // Попытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    // Отправим ошибку, если не получилось
    throw new UnathorizedError('Необходима авторизация.');
  }
  // Записываем пейлоуд в объект запроса
  req.user = payload;
  // Пропускаем запрос дальше
  next();

  return true;
};
