const preferenceManager = require('../utils/preference-manager');

const logout = () => {
  preferenceManager.deleteCredentials();
  preferenceManager.removeLocationDirectory();
}

module.exports = {
  logout
};
