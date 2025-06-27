const { customAlphabet } = require('nanoid');

const generateCode = () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const nanoid = customAlphabet(alphabet, 6);
  return nanoid();
};

module.exports = generateCode;