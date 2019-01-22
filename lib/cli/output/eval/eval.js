const chalk = require('chalk');
const { Spinner } = require('cli-spinner');
const Table = require('cli-table');

const spinner = new Spinner('Evaluating your submission, please wait...');

const startSpinner = () => {
  spinner.setSpinnerString(0);
  spinner.start();
};

const stopSpinner = () => {
  spinner.stop();
};

const onInvalidRequest = () => {
  console.log(chalk.red('\nAccess Denied. Please try submitting again.'));
};

const onSubmissionPending = () => {
  console.log(chalk.yellow('\nYou have a pending submission. Please try after some time.'));
};

const printTableAndGetScore = (data) => {
  const table = new Table({
    head: [chalk.cyan('Test Case #'), chalk.cyan('Status'), chalk.cyan('Score')],
    colWidths: [15, 25, 15],
  });
  let totalScore = 0;
  for (i = 0; i < data.marks.length; i++) {
    totalScore += +data.marks[i];
    table.push([(i + 1), data.comment[i], data.marks[i]]);
  }
  console.log(table.toString());
  return totalScore;
};

const printStatusAndLog = (data, totalScore) => {
  console.log(`\n${chalk.yellow('Log :\n')}${new Buffer(data.log, 'base64').toString()}`);
  if (data.status !== 0) {
    console.log(chalk.red('Penalty : ') + data.penalty);
  } else if (data.status === 0) {
    console.log(`${chalk.yellow('Warning: ')}This lab is not active. The result of this evaluation is not added to the scoreboard.`);
  }
  console.log(chalk.green('Total Score: ') + totalScore);
};

const onScores = (data) => {
  console.log(chalk.green('\nSubmission successful. Retreiving results'));
  const totalScore = printTableAndGetScore(data);
  printStatusAndLog(data, totalScore);
};

const sendOutput = (event) => {
  switch (event.name) {
    case 'eval_started':
      startSpinner();
      break;
    case 'invalid':
      stopSpinner();
      onInvalidRequest();
      break;
    case 'submission_pending':
      stopSpinner();
      onSubmissionPending();
      break;
    case 'scores':
      stopSpinner();
      onScores(event.details);
      break;
  }
};

module.exports = {
  sendOutput,
};
