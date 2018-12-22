const chalk = require('chalk');
const { Spinner } = require('cli-spinner');
const Table = require('cli-table');

const spinner = new Spinner('Evaluating you submission, please wait...');
const { logger } = require('../../utils/logger');

const startSpinner = () => {
  spinner.setSpinnerString(0);
  spinner.start();
};

const stopSpinner = () => {
  spinner.stop();
};

const onInvalidRequest = () => {
  console.log(chalk.red('\nAccess Denied. Please try submitting again'));
};

const onSubmissionPending = () => {
  console.log(chalk.yellow('\nYou have a pending submission. Please try after some time.'));
};

const printTableAndGetScore = (data) => {
  const testCaseColWidth = 15;
  const statusColWidth = 25;
  const scoreColWidth = 15;

  const table = new Table({
    head: [chalk.cyan('Test Case #'), chalk.cyan('Status'), chalk.cyan('Score')],
    colWidths: [testCaseColWidth, statusColWidth, scoreColWidth],
  });
  let totalScore = 0;
  for (let i = 0; i < data.marks.length; ++i) {
    totalScore += +data.marks[i];
    table.push([(i + 1), data.comment[i], data.marks[i]]);
  }
  console.log(table.toString());
  return totalScore;
};

const printStatusAndLog = (data, totalScore) => {
  logger.moduleLog('debug', 'Eval Output', `Evaluation logs: ${Buffer.from(data.log, 'base64').toString()}.`);

  console.log(`\n${chalk.yellow('Log :\n')}${Buffer.from(data.log, 'base64').toString()}`);
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
    case 'invalid_lang':
      stopSpinner();
      console.log(chalk.red(`Please provide the a valid language. The supported languages are ${event.details.supportedLanguages}`));
      break;
    default:
      console.log(chalk.red('\nInvalid Event'));
  }
};

module.exports = {
  sendOutput,
};
