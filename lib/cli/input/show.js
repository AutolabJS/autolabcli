const getInput = async (args) => {
  switch (args.stat) {
    case 'status':
      return {
        name: 'status',
      };
    default:
      return {
        name: 'invalid_command',
      };
  }
};

module.exports = {
  getInput,
};
