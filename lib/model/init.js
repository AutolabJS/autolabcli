const getOutputString = (username, password) => {
  return new Promise( (resolve, reject) =>
    resolve(`Your username is: ${username}\nYour password is: ${password}`)
  );
}

module.exports = {
  getOutputString
}
