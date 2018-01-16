const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { exec } = require('child_process');
const path = require('path');

const controller = require('../lib/controller');

const { expect } = chai;

chai.use(sinonChai);
chai.should();

describe('For application entry point', () => {

  it('should start the controller', () => {
    const startSpy = sinon.spy(controller, 'start');
    exec('npm link;autolab', (err, stdout, stdin) => {
      expect(startSpy).to.have.been.called;
    });
  });
});
