const getLengthValidator = invalidMessage => (value) => {
  if (value.length) {
    return true;
  }

  return invalidMessage;
};

module.exports = {
  getLengthValidator,
};
