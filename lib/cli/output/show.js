const _ = require('lodash');
const chalk = require('chalk');
const { spawn } = require('child_process');
const fs = require('fs-extra');
const Table = require('cli-table');
const { Spinner } = require('cli-spinner');
const util = require('util');

const spinner = new Spinner('Fetching request results, please wait...');
const startSpinner = () => {
  spinner.setSpinnerString(0);
  spinner.start();
};

const stopSpinner = () => {
  spinner.stop();
};

const showScoreLess = async (scoreboard) => {
  const file = '/tmp/autolabjs/scoreboard';
  try {
    await fs.outputFile(file, scoreboard);
    spawn('cat /tmp/autolabjs/scoreboard | less -r', {
      stdio: 'inherit',
      shell: true,
    });
    console.log('\n');
  } catch (err) {
    console.error(err);
  }
};

const showScore = (details) => {
  const { scores } = details;
  const posColWidth = 10;
  const idColWidth = 15;
  const scoreColWidth = 10;
  const timeColWidth = 23;

  const threshold = 1;

  const table = new Table({
    head: ['Position', 'ID Number', 'Score', 'Time'],
    colWidths: [posColWidth, idColWidth, scoreColWidth, timeColWidth],
  });

  const scoreboard = _.zipWith(scores, _.range(1, scores.length + 1), (score, position) => {
    score.unshift(position);
    return score;
  });

  table.push(...scoreboard);
  if (scores.length <= threshold) {
    console.log(`\n${table.toString()}`);
  } else {
    showScoreLess(table.toString());
  }
};

const sendOutput = (event) => {
  const lineBreakLength = 80;
  switch (event.name) {
    case 'fetching_results':
      startSpinner();
      break;
    case 'status':
      stopSpinner();
      console.log(`\n${util.inspect(event.details.status,
        { compact: true, breakLength: lineBreakLength, colors: true })}`);
      break;
    case 'score':
      stopSpinner();
      showScore(event.details);
      break;
    default:
      stopSpinner();
      console.log(chalk.red('\nInvalid Event'));
      break;
  }
};

module.exports = {
  sendOutput,
};
