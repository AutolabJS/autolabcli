const preferenceManager = require('../utils/preference-manager');

const logout = () => {
  preferenceManager.deleteCredentials();
};

module.exports = {
  logout,
};
