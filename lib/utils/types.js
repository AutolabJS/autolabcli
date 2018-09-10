
const getType = elem => Object.prototype.toString.call(elem).slice(8, -1);

module.exports = getType;
