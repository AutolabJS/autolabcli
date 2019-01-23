const util = require('util');
const { Spinner } = require('cli-spinner');

const spinner = new Spinner('Fetching request results, please wait...');
const startSpinner = () => {
  spinner.setSpinnerString(0);
  spinner.start();
};

const stopSpinner = () => {
  spinner.stop();
};

const sendOutput = (event) => {
  const lineBreakLength = 80;
  switch (event.name) {
    case 'fetching_results':
      startSpinner();
      break;
    case 'status':
      stopSpinner();
      console.log(`\n ${util.inspect(event.details.status,
        { compact: true, breakLength: lineBreakLength, colors: true })}`);
      break;
    default:
      break;
  }
};

module.exports = {
  sendOutput,
};
